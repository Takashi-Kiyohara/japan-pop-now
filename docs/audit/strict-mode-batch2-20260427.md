# Strict Mode Audit — Batch 2 (Collab 軸3 STRICT + Hero 軸5)

**Date:** 2026-04-27
**Auditor:** Claude (autonomous)
**Scope:** 8 high-priority collab articles (MHA / Okami / Apothecary / Rilakkuma / Pokemon)
**Time budget:** 4h, documentation mode entered after structural source-block discovered.

## TL;DR

- **7 of 8 articles fail 軸3 STRICT (collab visuals).** Existing strategy is "Wikimedia venue + illustrative caption" with explicit "not 2026 collab decor" disclosure.
- **1 of 8 hero passes 軸5** (Pokemon Center Tokyo — Pokemon Center Shibuya storefront with brand visible).
- **Structural source-block confirmed:** Capcom / Pokemon Co. / San-x / Shueisha official key visuals are copyrighted IP. Re-hosting on a commercial affiliate site without explicit license violates affiliate.md image rules and would also breach the official-source-priority rule (Wikimedia Commons is OK, copyrighted IP key visuals from 公式 X/web press are NOT redistributable).
- **MHA Waffle Diner closed 2026-04-26 (yesterday).** Window for Takapon onsite photoshoot has closed for that one. Other 7 venues remain photoshoot-eligible.
- **Action taken:** Added `imageNote:` frontmatter explaining the constraint where missing. Documented exhausted state. Flagged 7 articles for Takapon onsite reshoot as the only path to lift 軸3 PASS without IP licensing.
- **No image binaries replaced.** The existing Wikimedia venue images are the truthful compromise the memory rules permit; replacing them with downloaded official IP visuals would worsen state on copyright + affiliate rules.

## File existence verification

| Slot | Path checked | Exists? |
|---|---|---|
| 1 | `content/articles/mha-cafe-tokyo-2026.mdx` | NO — only `.md` exists at slot 2 |
| 2 | `content/articles/my-hero-academia-cafe-tokyo-2026.md` | YES (.md, 12.5 KB, 833) |
| 2 | `content/articles/my-hero-academia-cafe-tokyo-2026.mdx` | NO |
| 3 | `content/articles/my-hero-academia-waffle-diner-ikebukuro-2026.mdx` | YES (19.9 KB) |
| 4 | `content/articles/okami-20th-monster-hunter-sakaba-tokyo-osaka-2026.mdx` | YES (16.1 KB) |
| 5 | `content/articles/apothecary-diaries-oshi-tabi-osaka-shinkansen-2026.mdx` | YES (20.8 KB) |
| 6 | `content/articles/rilakkuma-cafe-tokyo-osaka-2026.mdx` | YES (21.7 KB) |
| 7 | `content/articles/pokemon-karaoke-manekineko-30th-anniversary-2026.mdx` | YES (22.0 KB) |
| 8 | `content/articles/pokemon-center-tokyo-complete-guide-2026.mdx` | YES (24.6 KB) |

Slot 1 (`mha-cafe-tokyo-2026.mdx`) is collapsed into slot 2 (`my-hero-academia-cafe-tokyo-2026.md`) — same article, different slug attempt. Treated as 7 unique articles.

## 軸3 STRICT collab + 軸5 hero audit matrix

| # | Slug | Hero source | Hero AR | 軸5 fit | 軸5 subject | 軸5 collab? | 軸3 body | Overall | Action |
|---|---|---|---|---|---|---|---|---|---|
| 2 | my-hero-academia-cafe-tokyo-2026 | Kabukicho neon (Wikimedia) | 1920x1280 (1.50) | FAIL — sides crop on 1200x720; also Kabukicho is Shinjuku not Ikebukuro | generic Tokyo neon | NO MHA | 4 Wikimedia venue + 1 generic photo, all "illustrative" with disclosure | **FAIL all 3 axes** | exhausted; flag for Takapon Ikebukuro reshoot — but venue (DECOTTO collab) closed 2026-04-26 |
| 3 | my-hero-academia-waffle-diner-ikebukuro-2026 | Ikebukuro 西一番街 arcade | 1200x720 | PASS fit | generic arcade | NO MHA | 2 Takapon stand-in (generic diner/waffle) + 1 Wikimedia Sunshine City | **FAIL 軸3+collab clarity** | exhausted; venue CLOSED 2026-04-26, retroactive shoot impossible |
| 4 | okami-20th-monster-hunter-sakaba-tokyo-osaka-2026 | Akihabara Yodobashi crossing | 1200x720 | PASS fit | generic Akiba street | NO Okami/MH | 2 Takapon Pasela exterior, no Okami/MH branding | **FAIL 軸3+collab clarity** | venue OPEN through 2026-06-01; flag Takapon for AKIBA Pasela 3F + Namba 4F shoot of in-frame collab signage |
| 5 | apothecary-diaries-oshi-tabi-osaka-shinkansen-2026 | Dotonbori night | 1200x720 | PASS fit | generic Osaka neon | NO Apothecary; also wrong area (article is Doshomachi/Animate Umeda, not Dotonbori) | 1 Sukunahikona Shrine (Wikimedia, on-topic for stamp #4), 1 KITTE Osaka, 1 Animate Umeda exterior | **FAIL 軸3+wrong area** | venue OPEN through 2026-07-20; flag Takapon for Animate Umeda 3F campaign poster + Shin-Osaka platform poster shoot |
| 6 | rilakkuma-cafe-tokyo-osaka-2026 | Arashiyama Rilakkuma shop (Kyoto, Wikimedia) | 1200x720 | PASS fit | Rilakkuma retail shop visible (so brand IS legible — partial collab signal) | partial — Rilakkuma brand on signage but NOT the 2026 SHIBUYA 109 venue | 1 Solamachi Rilakkuma store (brand-on), 2 Wikimedia venue exteriors (Tennoji MIO, Nagoya PARCO) | **PARTIAL — hero has Rilakkuma brand but wrong venue** | venue OPEN through 2026-07-12; flag Takapon for SHIBUYA 109 B2F entrance shoot |
| 7 | pokemon-karaoke-manekineko-30th-anniversary-2026 | Manekineko Fukkusaki branch (Wikimedia) | 1200x720 | PASS fit | Manekineko brand legible | partial — Manekineko visible, NO Pokemon | all 4 body images Wikimedia chain exteriors + 1 Pokemon Center Shibuya + 1 generic plush display | **PARTIAL — chain visible, Pokemon not** | venue OPEN through 2026-06-14; flag Takapon for Tokyo collab-room interior shoot (45-prefecture program) |
| 8 | pokemon-center-tokyo-complete-guide-2026 | Pokemon Center Shibuya storefront (Wikimedia) | 1200x720 | PASS fit | Pokemon Center logo legible | **YES — Pokemon brand+store both clear** | all 5 body Wikimedia Pokemon Center photos with Pokemon branding visible | **PASS all axes — only article in batch passing 軸3+5** | NO ACTION; this is the model the rest of the batch should aim for |

## Why 7 of 7 collab articles cannot be lifted to 軸3 PASS today

The memory rule chain is:

1. `feedback_official_image_modification_ok.md` — generation banned; source priority Wikimedia Commons → 公式 X → 公式 web press → GMaps owner.
2. `feedback_image_strict_universal_rule.md` — must show real-photo, on-topic, in-frame collab content.
3. `affiliate.md` / `CLAUDE.md` image rule — "No Unsplash images — only official/authentic"; commercial use of third-party IP key visuals without license is not authorized.

For these 7 collab articles, the **only image classes that satisfy ALL 3 rules at once** are:

- **A.** Takapon-shot original photos taken inside or directly adjacent to the licensed collab venue, with in-frame collab signage that doesn't reproduce copyrighted character key art at high resolution (editorial fair use). **This is what's missing.**
- **B.** Wikimedia Commons venue photos with explicit caption disclosure ("illustrative venue context, not 2026 collab decor"). **This is what's currently used.** It cannot pass 軸3 STRICT by definition because the photos predate or postdate the collab.
- **C.** Official press release images explicitly licensed to press for re-publication. JR Tokai, Capcom, Koshidaka, San-x, Pokemon Co. press kits typically license press for editorial use only — but the affiliate-monetized format of japan-pop-now.com sits in a grey zone that requires per-campaign written permission. None has been obtained.

The articles' authors have already done the second-best thing the rules permit: every Wikimedia body photo carries an explicit "illustrative ... not 2026 collab decor" caption, removing reader-confusion risk in text even when the image cannot show the collab. The visual axis is still FAIL.

**The unblock path is class A: dispatch Takapon to each venue while it's still open.** Of the 7 fails, 6 venues are still open:

| Slug | Venue open until | Photoshoot priority |
|---|---|---|
| my-hero-academia-cafe-tokyo-2026 | 2026-04-26 (CLOSED) | LOST — keep Wikimedia + caption forever |
| my-hero-academia-waffle-diner-ikebukuro-2026 | 2026-04-26 (CLOSED) | LOST — keep Wikimedia + caption forever |
| okami-20th-monster-hunter-sakaba-tokyo-osaka-2026 | 2026-06-01 | HIGH — 5 weeks |
| apothecary-diaries-oshi-tabi-osaka-shinkansen-2026 | 2026-07-20 | MEDIUM — 12 weeks |
| rilakkuma-cafe-tokyo-osaka-2026 | 2026-07-12 (Nagoya) / 2026-05-31 (Shibuya 109) | HIGH for Shibuya 109 — 5 weeks; MEDIUM for Tennoji/Nagoya |
| pokemon-karaoke-manekineko-30th-anniversary-2026 | 2026-06-14 | HIGH — 7 weeks |
| pokemon-center-tokyo-complete-guide-2026 | evergreen | none — already PASS |

## Frontmatter `imageNote:` additions

To make the rule-induced compromise legible to future audits, an `imageNote:` line was added to the frontmatter of each article that failed 軸3 STRICT but cannot be lifted today. The note states: "Hero/body images use Wikimedia Commons venue photos. Direct collab IP visuals are not redistributable on a commercial affiliate site without explicit license. Captions disclose the gap. Flagged for Takapon onsite reshoot while venue is open."

(Articles where the photoshoot window is closed are flagged as `imageNote: exhausted`.)

## Forbidden actions not taken

- No image generation (banned).
- No download of copyrighted IP key visuals from 公式 X / press pages (would breach copyright + affiliate rules).
- No `.deprecated.{ext}` rename of currently-used files (would orphan working production renders).
- No `git add .` / `-A`. No `--force`. No `--no-verify`.
- No commit fabricating PASS where 軸3 STRICT clearly fails.

## Recommended next steps for the user

1. **Dispatch Takapon to AKIBA Pasela (Okami) and Karaoke Manekineko Tokyo collab room (Pokemon)** in the next 2 weeks. Highest collab-axis ROI because both venues have 5+ weeks runway.
2. **Apply for press credentials** with Pokemon Company / Capcom / Koshidaka for licensed key-visual use on the affiliate site if the volume of collab articles justifies the legal overhead.
3. **Accept "Wikimedia + disclosure" as the permanent state** for closed-window collabs (MHA Waffle Diner, MHA Cafe). These 2 articles will never pass 軸3 STRICT and should be marked `imageNote: exhausted` with no further reshoot attempts.
4. **For evergreen Pokemon Center Tokyo article (slot 8), use it as the template** — the Wikimedia Pokemon Center storefront photos pass 軸3 because the venue brand IS the collab subject. The model breaks down for time-limited IP collabs because the brand and the collab don't share a permanent storefront.

## JSON summary

```json
{
  "audit_date": "2026-04-27",
  "scope": 8,
  "files_present": 7,
  "files_missing": 1,
  "axis5_pass": ["pokemon-center-tokyo-complete-guide-2026"],
  "axis5_partial": ["rilakkuma-cafe-tokyo-osaka-2026", "pokemon-karaoke-manekineko-30th-anniversary-2026"],
  "axis5_fail": ["my-hero-academia-cafe-tokyo-2026", "my-hero-academia-waffle-diner-ikebukuro-2026", "okami-20th-monster-hunter-sakaba-tokyo-osaka-2026", "apothecary-diaries-oshi-tabi-osaka-shinkansen-2026"],
  "axis3_pass": ["pokemon-center-tokyo-complete-guide-2026"],
  "axis3_fail_exhausted": ["my-hero-academia-cafe-tokyo-2026", "my-hero-academia-waffle-diner-ikebukuro-2026"],
  "axis3_fail_reshoot_eligible": ["okami-20th-monster-hunter-sakaba-tokyo-osaka-2026", "apothecary-diaries-oshi-tabi-osaka-shinkansen-2026", "rilakkuma-cafe-tokyo-osaka-2026", "pokemon-karaoke-manekineko-30th-anniversary-2026"],
  "image_binaries_changed": 0,
  "frontmatter_imagenote_added": "see git diff",
  "commits": [],
  "blocker": "official-IP-key-visuals-not-redistributable-without-license; venue-photoshoot-required-for-axis3-pass"
}
```
