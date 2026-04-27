# Strict Mode Audit — Batch 1 (JJK / DS / Conan / JoJo / Dark Moon)

**Date:** 2026-04-27
**Auditor:** Claude (Strict Mode subagent)
**Scope:** 10 high-priority collab cafe / pilgrimage articles flagged from
user feedback that JJK × Sweets Paradise hero photos were "non-collab"
(generic same-brand venues) → confusing for readers.
**Standards applied:** 4-axis universal rule + 軸5 hero frame fit + collab
visual strict (公式 X / press priority, key-art IP ban).

## TL;DR

- Found systemic issue: across all 10 articles, **0 had legitimate collab-decoration
  photos** in repo. Existing images were generic Wikimedia venue exteriors
  filled in by prior agents, with several **factually false alt-text claims**
  (e.g. Shibuya Crossing labeled "ufotable Cafe storefront with Demon Slayer
  Kizuna collaboration signage").
- **5 hero replacements committed** using existing accurate venue photos
  in repo (real Sweets Paradise + JJK collab poster, Yura Conan Station,
  HEP FIVE, Conan's House, Nogata Station).
- **3 articles flagged exhausted** (JoJo, Dark Moon, DS Kizuna body-menu/body-venues)
  — official collab visuals are IP-licensed and cannot be reproduced;
  captions and alt text rewritten to honest "illustrative neighborhood context"
  instead of false "collab signage / menu plate" claims.
- **2 articles already pass** (#1 JJK gold sample with SP Umeda + JJK poster
  visible in window; #3 DS rerun with accurate Nogata Station hero;
  #5 DS pilgrimage with accurate Kaminarimon).

Honest assessment: This batch demonstrates the limit of what agent-only image
work can accomplish. Without on-site Takapon photography of actual collab
decor, or explicit IP-holder permission for key art, the most we can do is
(a) use accurate venue exterior photos and (b) be honest in captions about
what the photo shows. **The pre-fix state was actively misleading readers** —
the post-fix state is honest about limitations.

## Per-article matrix

| # | slug | wc | hero 軸5 verdict | body 軸3 STRICT | replaced | sources | commit | exhausted? |
|---|------|----|----|------|----------|---------|--------|------------|
| 1 | jjk-sweets-paradise-complete-guide-2026 | ~3300 | PASS (SP Umeda + JJK poster window) | PASS (5 SP venue exteriors, all clearly hedged "illustrative chain venue") | none — already gold | Wikimedia (existing) | (no change) | partial — body images are non-collab venue exteriors, but captions are honest |
| 2 | jujutsu-kaisen-cafes-japan-2026-guide | ~1900 | **FIX** Akihabara generic → SP Umeda + JJK collab poster | PASS — body uses 4 SP venue exteriors with hedged captions | hero | Wikimedia (existing repo asset re-used) | a11e560 | partial |
| 3 | demon-slayer-rerun-cafe-ufotable-2026 | ~2400 | PASS — Nogata Station accurate | PASS — Tokushima Station + Nogata platform, accurate captions | none | (no change) | (no change) | partial |
| 4 | demon-slayer-rerun-cafe-ufotable-kizuna-2026 | ~2200 | **FIX** Shibuya Crossing (alt claimed "ufotable storefront with Kizuna signage" — FALSE) → Nogata Station | **FIX** body-menu (residential street) and body-venues (Kabukicho neon) had FALSE captions claiming "menu plates" / "venue montage" → corrected to "illustrative residential context" / "illustrative central Tokyo cafe-district context" | hero + 2 body alts/captions | Wikimedia (Asanagi Nogata Station, existing repo asset) | a11e560 | yes — collab decor photos unavailable; key art on ufotable.co.jp is IP-licensed |
| 5 | demon-slayer-pilgrimage-tokyo | ~2500 | PASS — Kaminarimon w/ autumn leaves | PASS — Mt. Kumotori, Kaminarimon | none | (no change) | (no change) | n/a |
| 6 | detective-conan-cafe-tokyo-osaka-3venue-2026 | ~2700 | **FIX** Shibuya Crossing aerial → HEP FIVE Osaka facade (the actual venue building) | PASS — body uses Global Gate Nagoya + Sasashima station + Shibuya South Gate (all named venues per article); 3 yoshoku body images already disclose "representative, not the actual cafe plate" | hero | Wikimedia (Mc681 HEP FIVE, existing repo asset) | a11e560 | yes — official Retro Port Town key art is IP-licensed |
| 7 | detective-conan-cafe-2026-japan-guide | ~1500 | **FIX** Akihabara generic featured.jpg → Conan's House Tottori (Conan-themed building w/ Conan poster visible) | PASS — body uses Tokyo Solamachi, Yura Conan Station theming, HEP FIVE, Conan-themed JR train | hero | Wikimedia (Hsu Tzu-hsun Conan's House, existing repo asset) | a11e560 | partial |
| 8 | detective-conan-pilgrimage-events-2026 | ~2200 | **FIX** Shibuya night (alt falsely claimed "Yura Conan Station") → real Yura Conan Station | PASS — body uses Conan Station, Sunshine City, Tokyo Tower, Yokohama Minato Mirai (all named in body) | hero | Wikimedia (existing repo asset) | a11e560 | n/a |
| 9 | jojo-stone-ocean-cafe-jojo-world-2026 | ~2100 | FAIL → text-only fix: hero is Takeshita Street (alt previously claimed "JoJo World near Takeshita") → corrected to "Takeshita Street goods shop, illustrative Harajuku context" | **FIX** body-menu (Chiikawa Land cafe interior, totally different IP) and body-venue (Animate exterior) had FALSE captions claiming "JoJo World cafe counter / Stone Ocean signage" → corrected to "illustrative anime cafe ambience" / "Animate Harajuku exterior, illustrative anime-retail context" | 3 alts/captions | (text only — no image swap; no accurate JoJo World photo available in repo or Wikimedia) | a11e560 | **yes** — JoJo World does not publish press photos for editorial reuse; key art is IP-licensed; Wikimedia has no JoJo World Harajuku photos |
| 10 | dark-moon-chara-cafe-ikebukuro-2026 | ~1700 | FAIL → text-only fix: hero is Sunshine City atrium fountain (frontmatter alt OK; body alt claimed "Ikebukuro skyline at night with dark purple moon-lit tone" — FALSE for fountain interior) → corrected | PASS — body-cafe (Grandscape exterior) and body-area (Nishi-Ichibangai arcade) accurate | hero alt + caption | (text only) | a11e560 | **yes** — DARK MOON is HYBE/Naver Webtoon IP; key art is licensed; Grandscape Ikebukuro 2F has no press-released collab photos |

## Key findings & patterns

### Pattern 1: Frontmatter alt-text lies
Several articles had alt text describing what the editor *wished* the image
showed, not what the image actually contained:
- DS Kizuna: Shibuya Crossing labeled "ufotable Cafe Tokyo storefront with
  Kizuna signage"
- Conan pilgrimage: Shibuya Scramble at night labeled "Yura Conan Station"
- Dark Moon: Sunshine City fountain interior labeled "Ikebukuro skyline at
  night with dark purple moon-lit tone"

These are not just SEO drift — they are factually false claims that confuse
readers and damage trust. All corrected in batch 1.

### Pattern 2: Body images mislabeled as collab visuals
Three article body images were captioned as showing collab content but
actually showed unrelated locations:
- DS Kizuna body-menu (residential street) ↔ caption "Kamado chicken bowl &
  parfait, each ships with novelty card"
- DS Kizuna body-venues (Kabukicho neon) ↔ caption "Montage of ufotable Cafe
  venues in 5 cities"
- JoJo body-menu (Chiikawa Land cafe — different IP entirely!) ↔ caption
  "JoJo World cafe counter, 6 Stand drinks rotation"

All caption fixes in batch 1.

### Pattern 3: Existing accurate photos buried as body images
Articles 2 (JJK guide), 6 (Conan 3-venue), 7 (Conan Japan guide), and 8
(Conan pilgrimage) all had **better** photos already in their image folders
as `body-wikimedia-N.webp` than as their hero/featured. Hero swaps used
existing repo assets — no new downloads required.

This suggests prior image-fix passes prioritized "fill the body gallery"
over "make sure the hero communicates value" — exactly the 軸5 gap the user
flagged.

### Pattern 4: Collab photos genuinely unavailable
For 5 of 10 articles, no collab-decoration photo exists that can be sourced
under our policy:
- JoJo World: zero Wikimedia photos; official press is IP key art
- Dark Moon: HYBE/Naver Webtoon controls all visuals; no press-release imagery
- DS Kizuna body images: ufotable.co.jp has banner art (`musundaen_top_event_header_pc.webp`) but it's IP-licensed Demon Slayer character art
- Conan Cafe interiors: BOX cafe&space publishes press images, but they reproduce IP-licensed Conan character plating
- JJK Sweets Paradise menu plates: SP press section has lazy-loaded images that did not resolve via WebFetch; sweets-paradise.jp visual menu uses Aniplex JJK key art under license

Honest path forward: **Takapon on-site photography priority queue** for
these 5 articles. Until then, captions disclose "illustrative venue context"
rather than fabricate a "collab visual" claim.

## Replacements committed (commit a11e560)

```
content/articles/jujutsu-kaisen-cafes-japan-2026-guide.md      (frontmatter + featuredImage path)
content/articles/demon-slayer-rerun-cafe-ufotable-kizuna-2026.mdx  (alt + caption + 2 body alts)
content/articles/detective-conan-cafe-tokyo-osaka-3venue-2026.mdx  (frontmatter + caption)
content/articles/detective-conan-cafe-2026-japan-guide.md       (frontmatter)
content/articles/detective-conan-pilgrimage-events-2026.md      (frontmatter)
content/articles/jojo-stone-ocean-cafe-jojo-world-2026.mdx      (3 alts + 3 captions)
content/articles/dark-moon-chara-cafe-ikebukuro-2026.mdx        (frontmatter + body caption)
public/images/articles/jujutsu-kaisen-cafes-japan-2026-guide/hero.webp   (NEW — re-cropped from body-wikimedia-1)
public/images/articles/demon-slayer-rerun-cafe-ufotable-kizuna-2026/hero.webp  (REPLACED Shibuya → Nogata)
public/images/articles/detective-conan-cafe-tokyo-osaka-3venue-2026/hero.webp  (REPLACED Shibuya → HEP FIVE)
public/images/articles/detective-conan-cafe-2026-japan-guide/hero.webp  (NEW — re-cropped from body-wikimedia-5 Conan's House)
public/images/articles/detective-conan-pilgrimage-events-2026/hero.webp  (REPLACED Shibuya night → Yura Conan Station)
```

All Pillow processing followed the mandated pipeline:
`exif_transpose → fit(1200×720, LANCZOS, centering=(0.5, 0.4)) →
UnsharpMask(r=1.5, p=120, t=3) → save WebP q=92 method=6`.

Old files deprecated (`.deprecated.{ext}` or `.bak.deprecated.webp`) — no
deletion per CLAUDE.md never-delete rule.

## Verification gate (post-deploy)

Steps 1-3 of the 5-step gate completed in-session:
1. Local Read of each new hero.webp ✓
2. Pillow byte counts confirmed (~170 KB to 290 KB range, q=92 expected)
3. Visual inspection of each saved hero confirmed correct content

Steps 4-5 (md5 prod compare, _next/image proxy Read, article HTML inspect)
deferred — Vercel deploy needs ~3 minutes after push (a11e560 pushed at
session timestamp). Recommended follow-up:

```bash
sleep 180
for slug in jujutsu-kaisen-cafes-japan-2026-guide demon-slayer-rerun-cafe-ufotable-kizuna-2026 detective-conan-cafe-tokyo-osaka-3venue-2026 detective-conan-cafe-2026-japan-guide detective-conan-pilgrimage-events-2026; do
  curl -sIL "https://www.japan-pop-now.com/images/articles/$slug/hero.webp" | head -3
  curl -sL "https://www.japan-pop-now.com/articles/$slug" | grep -oE '<img[^>]+>' | head -3
done
```

## Source priority compliance

All replacement heroes used **Wikimedia Commons** (priority 1) — no 公式 X
fetch needed because (a) sweets-paradise.jp lazy-loaded images don't resolve
via WebFetch, (b) ufotable.co.jp banner is IP key art (banned), (c) JoJo
World has no Wikimedia presence and no press section, (d) all replacements
were sourced from existing CC-licensed assets already in the repo.

Source-priority order from `feedback_official_image_modification_ok.md`:
1. ✓ Wikimedia Commons (used for all 5 swaps)
2. – 公式 X (not needed; no IP-key-art ban violations)
3. – 公式 web press (lazy-loaded; would have required JS rendering)
4. – Google Maps owner photo (not needed)
5. – Banned: skipped

## Articles flagged for Takapon photoshoot priority queue

Per `feedback_official_image_modification_ok.md` "When agent reports no
source found":

1. **JoJo World Harajuku Stone Ocean** — every body image needs replacement
   when on-site shoot is feasible (April-mid June 2026 collab window)
2. **Dark Moon × THE Chara CAFE Grandscape Ikebukuro** — entry signage,
   menu plates, goods wall (April 25 – May 6, 2026 only)
3. **Demon Slayer Kizuna ufotable Cafe** — Tokyo Nakano-Nogata storefront
   collab decor (March 31 – May 6, 2026)
4. **Detective Conan Cafe BOX cafe&space GEMS Shibuya** — venue interior +
   menu plates (April 10 – June 28, 2026)
5. **JJK × Sweets Paradise Shinjuku East / Tennoji Mio** — collab decor
   wall + menu plates (April 2 – April 29, 2026)

## Final aggregate counts

```json
{
  "articles_audited": 10,
  "hero_replacements_committed": 5,
  "body_caption_corrections_committed": 6,
  "frontmatter_alt_corrections_committed": 5,
  "articles_already_passing": 3,
  "articles_partial_pass_post_fix": 5,
  "articles_flagged_exhausted": 5,
  "false_alt_claims_eliminated": 8,
  "ip_key_art_reproduction": 0,
  "agent_generated_placeholders": 0,
  "commit_sha": "a11e560",
  "deploy_status": "pushed; vercel build pending verification",
  "verification_gate_steps_completed": "1-3 of 5"
}
```

## Recommendation

Continue strict-mode audit on remaining 67 articles in subsequent batches
following the same playbook. Track H REDO and Phase 3 prior agents
established the pattern of "fill body gallery with Wikimedia chain photos"
which inadvertently buried the most accurate venue+IP photos in the body
position. A repo-wide pass to **rotate body-wikimedia-N.webp into hero
position when N has clearer IP/venue signal than current hero** could
resolve a large fraction of 軸5 hero clarity failures cheaply.

For the 5 exhausted articles, no further agent action is appropriate;
the next move is a Takapon Tokyo cafe-day photo run on the listed cafes
during their respective collab windows.
