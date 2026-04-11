# iOS Shortcut "JPN Upload" — Spec v4.2

The iOS Shortcut that sends photos and videos from iPhone → GitHub → Vercel → live site.

Version: **4.2**  
Last updated: **2026-04-11**  
Status: 4 branches built, Library + Bulk tested, Body position/size separation DONE.

---

## Top-level flow

```
Share Sheet / Shortcut app icon
      │
      ▼
  Branch picker (Menu)
      ├─► Library        (no slug, caption only)
      ├─► Featured       (slug + featured hint)
      ├─► Body           (slug + position + size)
      └─► Bulk Library   (loop multiple selected photos → library)
      │
      ▼
  Build filename (v4.2 contract — see SCHEMA_v4_2.md §1)
      │
      ▼
  GitHub Contents API PUT
    → public/images/inbox/<filename>
      │
      ▼
  GitHub Actions runs "Process image inbox"
    → ffmpeg extracts video keyframes (if video)
    → v4.2 pipeline: quality + semantic + face-aware crop
    → PR created: [image] inbox auto-process v4.2
      │
      ▼
  Takapon reviews & merges → Vercel deploys
```

---

## Branch 1: Library

**Purpose:** Dump a photo into the unassigned library for later manual assignment.

**Steps:**
1. Get image from input
2. Resize to max 2400px long edge (Shortcut "Resize Image")
3. Format current date → `yyyyMMdd_HHmmss` (**ABC keyboard** to avoid locale bugs)
4. Ask "Caption? (optional)" → text input
5. Base64-url encode caption (Scriptable step: `encodeURIComponent` then replace `+`→`-`, `/`→`_`, strip `=`)
6. Compose filename: `IMG_<timestamp>__library[__<b64>].jpg`
7. GitHub Contents API PUT (see §5)

**Tested:** ✅

---

## Branch 2: Featured

**Purpose:** Assign a photo as the featured image of a specific article. The pipeline will auto-generate 3 variants (hero/list/og).

**Steps:**
1. Get image + resize
2. Format date
3. Ask "Article slug?" → text input (e.g. `chiikawa-bakery-2026`)
4. Compose: `IMG_<timestamp>__existing__<slug>__featured.jpg`
5. GitHub PUT

**Tested:** ⚠️ built, end-to-end not yet tested.

---

## Branch 3: Body (v4.2 — position AND size menus)

**Purpose:** Insert a photo into the body of an article at a specific position, with explicit size hint.

**Steps:**
1. Get image + resize
2. Format date
3. Ask "Article slug?" → text input
4. **Menu "Where?"** → position (ALPHABETIC ORDER to avoid misfires):
   - `after-h2-1` (After first heading)
   - `after-h2-2` (After second heading)
   - `after-h2-3` (After third heading)
   - `body-bottom` (Bottom of article)
   - `body-top` (Top of article)
   - `replace-worst` (Replace weakest existing)
5. **Menu "Size?"** — NEW in v4.2 (no more `body-tall` in position menu):
   - 📐 `--wide` — force 16:9 (landscape crop)
   - 📏 `--tall` — force 4:3 or portrait-tolerant
   - 🤖 `auto` (no suffix) — let pipeline decide
6. Combine: `<position>` + (if size != auto) `--<size>`
   - Example: `body-top--wide`
7. Compose: `IMG_<timestamp>__existing__<slug>__<combined>.jpg`
8. GitHub PUT

**Tested:** ⚠️ built, end-to-end not yet tested.

**Migration note:** `body-tall` as a position hint is DEPRECATED. Old shortcuts using `__body-tall` still work (pipeline falls back to the legacy behaviour) but new uploads should use `__body-top--tall` / `__body-bottom--tall` instead.

---

## Branch 4: Bulk Library

**Purpose:** Push multiple selected photos into library in one run.

**Steps:**
1. Get images from input (multiple selection)
2. **Repeat Each**:
   - Resize
   - Format date (unique per photo — add `-<index>` if timestamps collide within same second)
   - Compose `IMG_<timestamp>__library.jpg`
   - GitHub PUT
3. End Repeat
4. Show count: "<N> photos uploaded to library."

**Tested:** ✅

---

## 5. GitHub Contents API (shared by all branches)

### 5.1 Get current SHA (required — PUT without sha fails 422)

```
GET https://api.github.com/repos/Takashi-Kiyohara/japan-pop-now/contents/public/images/inbox/<filename>
Headers:
  Authorization: Bearer <GITHUB_PAT>
  Accept: application/vnd.github+json
```

Most of the time this returns 404 (file doesn't exist yet) — treat as "no sha needed".

### 5.2 PUT file

```
PUT https://api.github.com/repos/Takashi-Kiyohara/japan-pop-now/contents/public/images/inbox/<filename>
Headers:
  Authorization: Bearer <GITHUB_PAT>
  Accept: application/vnd.github+json
  Content-Type: application/json

Body:
{
  "message": "[shortcut] upload <filename>",
  "content": "<base64 of image bytes>",
  "branch": "main"
  // "sha": "<existing-sha>"  ← only if file already exists
}
```

### 5.3 GitHub PAT scope

Required scopes:
- `repo` (Contents: Read/Write)
- Contents API access to `public/images/inbox/**`

Store in Shortcut's "Get Contents" action as plain text (iOS Keychain protects the Shortcut).

---

## 6. Known gotchas

### 6.1 Locale bug (`IMG_20264月10_151038`)

Format Date in iOS Shortcut uses the device locale by default. On Japanese locale, the month comes out as `4月` (full-width kanji) instead of `04`. **Fix:** in the Format Date action, tap the format field and switch to **ABC keyboard**, then type `yyyyMMdd_HHmmss`. Do NOT use the autocomplete suggestions.

### 6.2 Repeat loop drift

Actions placed AFTER the Repeat End block run only once (not per iteration). Drag the GitHub PUT action INSIDE the Repeat body, not after End.

### 6.3 "Shortcut input" is a magic variable

It doesn't appear in the action search. To reference it, tap a variable slot → variable picker → scroll to top → "Shortcut Input".

### 6.4 Shortcut fails silently on 422

The Contents API returns 422 when the file exists and you didn't send `sha`. In Shortcut there's no visible error — the upload just vanishes. Check the GitHub commit log to verify. To prevent, always do the GET first and include `sha` when present.

### 6.5 Video files

Videos (`.mp4`/`.mov`) are now supported (v4.2 — 2026-04-11). Push them to the same inbox like any image; the GitHub Actions `Extract keyframes from video inbox` step runs `ffmpeg` before the pipeline and produces up to 10 JPG frames named `<base>__library_<NN>.jpg`. The original video is deleted after extraction.

---

## 7. Future improvements (pending)

- [ ] Add a "Cancel & retry" dialog when GitHub PUT returns non-2xx
- [ ] Add an IG reel capture branch (just Bulk Library with `#ig` caption tag)
- [ ] Add a GPS auto-caption step (reverse-geocode to "近くの店名")
- [ ] Push notification when the GitHub Actions PR is ready for review
