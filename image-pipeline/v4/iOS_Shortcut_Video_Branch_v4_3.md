# iOS Shortcut "JPN Upload" — Video Branch (v4.3)

Step-by-step tutorial for adding a **5th branch "📹 Video"** to the existing
JPN Upload shortcut. Written in iPhone action-picker terms: what to tap, what
to type, what variable to drag where.

Version: **4.3**
Prereq: JPN Upload v4.2 already built (Library / Featured / Body / Bulk).
Target: iOS 17+, Shortcuts app.

---

## Overview of the new branch

```
📹 Video
  ├─► Purpose menu          (Library / Featured / Body)
  ├─► Slug prompt            (only if Featured/Body)
  ├─► Position menu          (only if Body — reuse Body branch menu)
  ├─► Size menu              (only if Body — reuse Body branch menu)
  ├─► Frame count menu       (f5 / f10 / f15 / f20 / fauto)
  ├─► Moe filter toggle      (yes / no)
  ├─► Encode video 720p 4Mbps (GitHub Contents API 25MB limit)
  ├─► Build filename (v4.3 contract)
  ├─► Base64 encode video
  ├─► GitHub PUT
  └─► Notify
```

The filename contract the GitHub Actions workflow expects (enforced by the
parser in `.github/workflows/process-image-inbox.yml`):

```
IMG_<ts>__library__video[__f<N>|__fauto][__moe].mp4
IMG_<ts>__existing__<slug>__featured__video[__f<N>|__fauto][__moe].mp4
IMG_<ts>__existing__<slug>__<position>[--<size>]__video[__f<N>|__fauto][__moe].mp4
```

---

## Before you start

1. Open the **Shortcuts** app on iPhone.
2. Tap **JPN Upload** → ⋯ to edit.
3. Scroll to the **Choose from Menu** action at the very top (the 4-branch
   picker from v4.2).
4. Tap **Add new item** inside that Choose from Menu action.
5. Type: `📹 Video`
6. Drag the new menu item to the position you prefer (I recommend between
   📄 Body and 🚀 Bulk Library).

The rest of this tutorial fills in the actions under that new menu branch.

---

## Step 1 — Get the source video

Inside the `📹 Video` branch of the Choose from Menu:

1. Tap **➕ Add Action** → search `Select Photos` → tap it.
2. On the action, tap the **ⓘ** (more) → turn **Select Multiple** OFF.
3. Tap **Image Types** → deselect **Images** → select **Videos** only.
   - Action title should now read: **Select Videos**
4. (Optional) Rename the output variable to `SourceVideo` (tap the blue
   variable chip at the bottom of the action → Rename).

---

## Step 2 — Pick the purpose (Library / Featured / Body)

1. Tap **➕ Add Action** → search `Choose from Menu` → tap it.
2. Prompt field: type `Upload as?`
3. Tap **Add new item** three times and fill in:
   - `📦 Library`
   - `⭐ Featured`
   - `📄 Body`
4. The action expands into 3 branches. Leave them empty for now — we'll
   fill them in below.

---

## Step 3 — Ask for the slug (Featured + Body only)

Because both Featured and Body need a slug, do this **once** after the
menu closes. But Shortcuts doesn't have early-return, so the cleanest
approach is:

1. Inside the `⭐ Featured` menu item, tap **➕ Add Action** → search
   `Ask for Input` → tap it.
2. Prompt: `Article slug?`
3. Input type: **Text**
4. Rename the output variable to `SlugFeatured`.
5. Repeat exactly the same inside the `📄 Body` menu item, but name the
   output `SlugBody`.

(You could reuse one variable for both, but giving them different names
makes the final filename concat step unambiguous.)

---

## Step 4 — Position + size menus (Body branch only)

Inside the `📄 Body` branch, immediately **after** the slug prompt:

1. **➕ Add Action** → `Choose from Menu` → prompt `Where?`
2. Add these items **in alphabetic order** (misfire-safe):
   - `after-h2-1`
   - `after-h2-2`
   - `after-h2-3`
   - `body-bottom`
   - `body-top`
   - `replace-worst`
3. For **each** of the 6 sub-branches, add a `Set Variable` action:
   - Variable name: `Position`
   - Value: type the exact position string (e.g. `body-top`)
4. After the position Choose from Menu closes, add another
   **Choose from Menu** → prompt `Size?` with items:
   - `📐 wide`
   - `📏 tall`
   - `🤖 auto`
5. For each size sub-branch, `Set Variable`:
   - Variable name: `Size`
   - Value: `wide` / `tall` / `auto`

---

## Step 5 — Frame count menu (all 3 purposes)

After Step 3 (Library) / Step 4 (Featured/Body), each branch needs a
frame-count menu. The easiest way is to put this **outside** the purpose
menu, right after it closes, so you write it once.

Put this action **after** the `Upload as?` Choose from Menu action ends:

1. **➕ Add Action** → `Choose from Menu` → prompt `Frames?`
2. Add items:
   - `5`
   - `10`
   - `15`
   - `20`
   - `auto`
3. For each sub-branch, **Set Variable** `FrameHint` to:
   - `5` → value `__f5`
   - `10` → value `__f10`
   - `15` → value `__f15`
   - `20` → value `__f20`
   - `auto` → value `__fauto`

(Yes, include the double underscore — the filename builder concatenates
`FrameHint` directly.)

---

## Step 6 — Moe filter toggle

Right after the frame-count menu:

1. **➕ Add Action** → `Choose from Menu` → prompt `Moe only?`
2. Items:
   - `no`
   - `yes (filter to Moe)`
3. In the `no` branch, `Set Variable` **MoeHint** = (leave empty — tap
   the value, then tap the `x` to clear).
4. In the `yes` branch, `Set Variable` **MoeHint** = `__moe`

---

## Step 7 — Encode video for upload (GitHub 25MB cap)

GitHub Contents API rejects files > 25MB. iPhone 4K/60 videos are way
bigger, so we transcode before upload.

1. **➕ Add Action** → search `Encode Media` → tap it.
2. In the action:
   - **Media**: tap the variable slot → pick `SourceVideo`
   - Tap **Show More**
   - **Audio Only**: OFF
   - **Speed**: Normal
   - **Quality**: tap → **Custom**
   - **Preserve**: Aspect Ratio
   - **Resolution**: `1280×720` (720p)
   - **Frame Rate**: `30`
   - **Bitrate**: `4000 kbps` (4 Mbps)
3. Rename the output variable to `EncodedVideo`.

A ~30-second 4K clip at these settings lands around 14–18 MB. A 60-second
clip will land around 28–32 MB — tell the shortcut to bail politely:

4. **➕ Add Action** → `Get Details of Files` → choose `EncodedVideo` and
   set Detail to **File Size**. Rename output to `VideoSize`.
5. **➕ Add Action** → `If` → condition: `VideoSize` **is greater than**
   `25000000`
   - Inside: `Show Alert` → Title `Too big` → Message `Re-encode shorter
     clip (<60s).` → **Stop Shortcut**.

---

## Step 8 — Format the timestamp (locale-safe)

This is the same trick as v4.2 — watch out for Japanese locale 4月 bug.

1. **➕ Add Action** → search `Current Date` → tap.
2. **➕ Add Action** → search `Format Date` → tap.
3. In Format Date:
   - **Format**: tap **Custom**
   - **Format String**: tap the field. **IMPORTANT**: switch the keyboard
     to **ABC** (tap the 🌐 globe until the bottom row shows the English
     ABC keyboard), then type exactly: `yyyyMMdd_HHmmss`
   - Do NOT accept any autocomplete suggestions.
4. Rename output variable to `Timestamp`.

---

## Step 9 — Build the filename

This is where all the variables come together. Use a **Text** action so
you can interleave plain text and magic variables.

1. **➕ Add Action** → search `Text` → tap it.
2. In the Text body, compose as follows (each `$Var` below means: tap the
   **Select Variable** button in the Text keyboard row and pick the
   corresponding variable):

```
IMG_{Timestamp}__{Mode}{SlugPart}{PositionPart}__video{FrameHint}{MoeHint}.mp4
```

Since Shortcuts Text doesn't support real templating, the cleanest way is
to build it as one concatenated Text action where you type the literal
parts (`IMG_`, `__`, `__video`, `.mp4`) and drag variables in between.

To avoid branching misery, set three helper variables earlier in each
purpose branch:

**In 📦 Library branch (before the Text action):**
- `Set Variable` `Mode` = `library`
- `Set Variable` `SlugPart` = (empty)
- `Set Variable` `PositionPart` = (empty)

**In ⭐ Featured branch:**
- `Set Variable` `Mode` = `existing`
- `Set Variable` `SlugPart` = `__` + `SlugFeatured` (use Text action with
  the literal `__` and the variable)
- `Set Variable` `PositionPart` = `__featured`

**In 📄 Body branch:**
- `Set Variable` `Mode` = `existing`
- `Set Variable` `SlugPart` = `__` + `SlugBody`
- `Set Variable` `PositionPart` = build with an **If** on `Size`:
  - If `Size` is `auto`: `__` + `Position`
  - Otherwise: `__` + `Position` + `--` + `Size`

After the helpers are set, the single final Text action reads:

```
IMG_[Timestamp]__[Mode][SlugPart][PositionPart]__video[FrameHint][MoeHint].mp4
```

Where each `[Var]` is a blue variable chip dragged in from the variable
picker. Rename the Text action output to `Filename`.

---

## Step 10 — Base64 encode the video

1. **➕ Add Action** → search `Base64 Encode` → tap it.
2. In the action:
   - **Input**: tap the variable slot → pick `EncodedVideo`
   - **Encode/Decode**: **Encode**
   - **Line Breaks**: **None** (important! GitHub API rejects
     pretty-printed Base64 with line breaks)
3. Rename output variable to `VideoBase64`.

---

## Step 11 — Build the JSON body

GitHub Contents API wants:
```json
{
  "message": "[shortcut] upload <filename>",
  "content": "<base64>",
  "branch": "main"
}
```

Shortcuts has a **Dictionary** action which is cleaner than writing raw JSON:

1. **➕ Add Action** → search `Dictionary` → tap it.
2. Tap **Add new item**:
   - Type: **Text**
   - Key: `message`
   - Value: `[shortcut] upload ` + `Filename` (type literal, then drag
     variable)
3. Tap **Add new item**:
   - Type: **Text**
   - Key: `content`
   - Value: `VideoBase64` (variable only)
4. Tap **Add new item**:
   - Type: **Text**
   - Key: `branch`
   - Value: `main`
5. Rename the Dictionary output variable to `PutBody`.

---

## Step 12 — PUT to GitHub Contents API

1. **➕ Add Action** → search `Get Contents of URL` → tap it.
2. Tap **Show More** to reveal all fields.
3. **URL**: build as a Text-style field. The URL template is:
   ```
   https://api.github.com/repos/Takashi-Kiyohara/japan-pop-now/contents/public/images/inbox/[Filename]
   ```
   Type the literal prefix, then drag the `Filename` variable at the end.
4. **Method**: **PUT**
5. **Headers**: tap **Add new header** three times:
   - `Authorization` → `Bearer ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx` (your PAT)
   - `Accept` → `application/vnd.github+json`
   - `Content-Type` → `application/json`
6. **Request Body**: tap → **JSON**
   - Tap **Add new field** → type: **Dictionary** → value: `PutBody`
   - *(Alternative:* Request Body: Form → one field of type Text with
     key `__raw__` containing `PutBody`. But the JSON option above is
     cleaner.)*
7. Rename the Get Contents output variable to `GithubResp`.

---

## Step 13 — Check the response

GitHub returns 201 (created) or 422 (exists, need sha). For videos, the
same filename almost never collides because the timestamp is per-second,
so 422 is rare — but handle it anyway.

1. **➕ Add Action** → `Get Dictionary Value` → input `GithubResp`, key
   `commit`. Rename output `Commit`.
2. **➕ Add Action** → `If` → `Commit` **has any value**:
   - **Yes** branch: `Show Notification` → Title `JPN Upload ✅` → Body
     `Video queued: ` + `Filename`
   - **No** branch: `Show Alert` → Title `Upload failed` → Body
     `GithubResp` (so you can see what went wrong) → **Stop Shortcut**.

---

## Step 14 — Test it

Save the shortcut. From the share sheet on a video in Photos:

1. Share → JPN Upload → 📹 Video
2. Purpose: 📦 Library
3. Frames: 10
4. Moe only?: no
5. Wait for "JPN Upload ✅"
6. Go to https://github.com/Takashi-Kiyohara/japan-pop-now/tree/main/public/images/inbox
   — the file should be there as
   `IMG_<ts>__library__video__f10.mp4`
7. Within ~2 minutes, GitHub Actions will run `process-image-inbox.yml`.
   Watch it at
   https://github.com/Takashi-Kiyohara/japan-pop-now/actions
8. It should extract 10 JPGs, delete the .mp4, create a PR titled
   `[image] inbox auto-process v4.3`
9. Merge the PR → frames land in `public/images/library/` → Vercel
   redeploys.

---

## Filename examples (copy-paste to verify in the Text action)

| Scenario                                   | Filename                                                                           |
| ------------------------------------------ | ---------------------------------------------------------------------------------- |
| Library, 10 frames, no Moe                 | `IMG_20260411_153012__library__video__f10.mp4`                                     |
| Library, auto frames, Moe only             | `IMG_20260411_153012__library__video__fauto__moe.mp4`                              |
| Featured for chiikawa-bakery-2026          | `IMG_20260411_153012__existing__chiikawa-bakery-2026__featured__video__f10.mp4`    |
| Body top wide on blue-lock                 | `IMG_20260411_153012__existing__blue-lock__body-top--wide__video__f5.mp4`          |
| Body after h2-2 tall, Moe filter, 15 frames| `IMG_20260411_153012__existing__slug__after-h2-2--tall__video__f15__moe.mp4`       |

---

## Known gotchas (video-specific)

### 14.1 Base64 line breaks

iOS Base64 Encode has a **Line Breaks** toggle that defaults to **Every 76
characters**. If you leave it on, the Base64 string will contain `\n`
characters, the JSON encoder will escape them, and GitHub's JSON parser
will see a malformed `content` field and return 400. **Always set Line
Breaks → None.**

### 14.2 Encode Media quality vs file size

4 Mbps × 60s ≈ 30 MB — over the 25 MB limit. Either:

- Shorten the clip to ≤50s before uploading, or
- Drop bitrate to 3 Mbps (acceptable for keyframes, since we only
  extract stills anyway).

### 14.3 Photos library auto-HEVC

Some iPhones store 4K60 as HEVC (H.265). Encode Media transcodes to H.264
automatically — no action needed, but CPU use is heavier on older phones.

### 14.4 The `fauto` heuristic

`fauto` tells the workflow to emit `duration_seconds / 6` frames, clamped
to `[3, 20]`. So:
- 10-second clip → 3 frames (clamped up from ~1.7)
- 30-second clip → 5 frames
- 60-second clip → 10 frames
- 120-second clip → 20 frames (clamped down from 20)

### 14.5 Moe filter + small `f<N>`

Be careful combining `__f5__moe`. If Moe only appears in 2 of the 5
extracted frames, the pipeline keeps 2 (not 5). For Moe-heavy content,
prefer `__f15__moe` or `__fauto__moe` so the filter has more material
to select from.

---

## What happens on the GitHub side (for reference)

1. `push` to `main` under `public/images/inbox/**` triggers
   `.github/workflows/process-image-inbox.yml`.
2. The **"Extract keyframes from video inbox (v4.3)"** step:
   - Parses the filename for `__video`, `__f<N>|__fauto`, `__moe`
   - Runs `ffmpeg` with `select='gt(scene,0.3)'` scene detection
   - Falls back to uniform sampling if scene detect yields <50% of the
     target frame count
   - Deletes the original `.mp4`
   - If `__moe`, writes a `.filter` sidecar next to each frame containing
     the literal text `moe`
3. The **"Process image inbox"** step runs
   `scripts__process-image-inbox_v4_2.ts`, which:
   - Calls `applyFaceFilters()` — groups frames by sidecar target,
     loads `data/face-db/<person>.json`, runs `identifyInImage` with
     euclidean threshold 0.5, deletes non-matching frames
   - Proceeds with the normal pipeline (quality scoring, semantic
     placement, face-aware cropping, library indexing, etc.)
4. Opens a PR for review.

---

## Next up

Once the Video branch works, the parallel track is **Option B: Google
Drive polling** — for when iPhone upload bandwidth is bad and you'd
rather drop a video into a GDrive folder from desktop. See
`.github/workflows/gdrive-video-poll.yml` and
`scripts/gdrive_video_poll.py` — no iOS changes required for that path.
