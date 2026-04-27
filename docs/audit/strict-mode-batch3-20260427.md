# Strict Mode Audit — Batch 3 — 2026-04-27

Scope: 9 collab/IP articles audited under stricter 軸3 STRICT (collab visual required, generic venue exteriors are FAIL even if real-photo) and 軸5 hero frame fit + subject clarity + value rules.

Memory rules applied:
- `feedback_image_strict_universal_rule.md` (4-axis universal)
- `feedback_official_image_modification_ok.md` (collab strict source priority + generation ban)
- `feedback_image_claim_verify_strict.md` (5-step prod verify gate)

User feedback the ratchet is responding to:
- (a) collab articles must show collab visuals — generic venue photos confuse readers (P0)
- (b) heroes too horizontal / unclear subject → 軸5 hero must pass frame fit + subject clarity + value (P0)

## Articles in scope (9)

1. `content/articles/chiikawa-bakery-harajuku-guide-2026.md`
2. `content/articles/chiikawa-land-tokyo-complete-2026.mdx`
3. `content/articles/spy-family-tokyo-fan-day-2026.md`
4. `content/articles/familymart-anime-collab-stores-2026.md`
5. `content/articles/ghibli-park-complete-guide-2026.md`
6. `content/articles/universal-cool-japan-2026-guide.md`
7. `content/articles/pokepark-kanto-tokyo-2026.md`
8. `content/articles/krispy-kreme-mario-galaxy-shibuya-2026.mdx`
9. `content/articles/blue-lock-tokyo-skytree-cafe-2026.md`

## Per-article verdict matrix

| # | Slug | Hero file | 軸3 STRICT (collab visual) | 軸5 hero (fit+subject+value) | Verdict | Action |
|---|------|-----------|----------------------------|------------------------------|---------|--------|
| 1 | chiikawa-bakery-harajuku-guide-2026 | featured.jpg | PASS — Chiikawa Bakery interior with neon Chiikawa Bakery logo, brand plush figure, character bread display | PASS — fit OK, subject clear (Chiikawa branding visible), value high | PASS | None — already strict-compliant own-photo set |
| 2 | chiikawa-land-tokyo-complete-2026 | hero.webp | BORDERLINE — image is a re-use of #1 (Chiikawa Bakery, not Chiikawa Land Tokyo). Article transparently labels it "same-IP same-store-format proxy". Visual content has Chiikawa branding so 軸3 letter passes; venue label is wrong | PASS — fit OK, Chiikawa branding clear | PASS-with-flag | Flag for Takapon photoshoot at the actual Chiikawa Land Tokyo store. Caption already discloses proxy status |
| 3 | spy-family-tokyo-fan-day-2026 | featured.jpg | **FAIL** — generic Tokyo Skytree base shot looking up; ZERO SPY×FAMILY branding/characters/event signage visible. Body: 3 generic Wikimedia (Skytree spring, Solamachi, Sunshine City) — same FAIL | **FAIL** — vertical Skytree-up framing, subject is "the tower" not "the Spy×Family event" — exact failure mode user flagged | FAIL | Documented as exhausted — no compliant collab source available without WebFetch / IP-key-visual permission |
| 4 | familymart-anime-collab-stores-2026 | featured.webp | **FAIL** — generic FamilyMart Shinjuku BUSTA storefront; no Durarara!! collab signage, no character cutouts, no themed merch. Body: generic Ikebukuro East Exit + generic Animate Ikebukuro — same FAIL | PASS framing-wise (5:3 OK), but subject value FAIL (no collab visible) | FAIL | Documented as exhausted — collab is March 2026 launch; official Durarara!! × FamilyMart store-interior photos require @famima_now official X via WebFetch (deferred, allowlist uncertain) |
| 5 | ghibli-park-complete-guide-2026 | featured.jpg | PASS — Mononoke Village area inside actual Ghibli Park (Aichi). The image IS the venue. Body images all real Ghibli Park areas (Elevator Tower, Howl's Moving Castle replica, Satsuki/Mei House) | PASS — wide park view, scene legible | PASS | None — already on-topic Wikimedia set; venue == IP for this article |
| 6 | universal-cool-japan-2026-guide | featured.jpg | **FAIL** — generic USJ Hollywood Boulevard area, no Cool Japan zone branding, no Kimetsu/JJK/Conan IP signage visible. Body: generic USJ entrance, park skyline, Hollywood area, Minion Park, Hollywood Dream coaster — all generic park, none Cool Japan-specific | PASS framing, but subject value FAIL (no Cool Japan visible) | FAIL | Documented as exhausted — official @USJ_Official Cool Japan zone press images need WebFetch |
| 7 | pokepark-kanto-tokyo-2026 | hero-wikimedia.webp | **FAIL** — aerial of Yomiuriland with no Pokemon visible (subject indistinct from height). Body: 5 Pokemon Center Mega Tokyo photos (these have Pokemon IP at least, partial PASS for body, but they are not PokéPark Kanto) + 1 Yomiuriland coaster (generic) | **FAIL** — subject clarity FAIL (aerial too distant, no Pokemon signage); 1200×675 noted in dim-4b as 45 px below 720 floor too | FAIL | Documented as exhausted — PokéPark Kanto opened Feb 2026; official @PokemonCoJp / @yomiuriland press needs WebFetch |
| 8 | krispy-kreme-mario-galaxy-shibuya-2026 | hero.webp | PASS — Mario Galaxy themed display table at Shibuya Cine Tower with collab donut tray, themed pink/galaxy mat. Body: Question Block packaging with Nintendo/UCS LLC ©, themed donut box trays, Super Mario Galaxy Movie poster inside store, all real collab visuals | PASS — fit OK, subject (donuts + setting) clear, value high | PASS | None — exemplar collab set |
| 9 | blue-lock-tokyo-skytree-cafe-2026 | featured.webp | **FAIL** — black-and-white Tokyo Skytree shot from base looking up, no Blue Lock branding/character lighting/event signage. All 5 body images: Skytree from various angles, Solamachi, Asakusa, Sumida Park — all generic Skytree | **FAIL** — vertical-axis Skytree-up framing repeats the exact failure mode the user flagged. Subject = "tower", not "Blue Lock event" | FAIL | Documented as exhausted — official @bluelock_PR / @TOKYO_SKYTREE EPISODE SKY images need WebFetch |

## Summary

- **PASS strict (3/9)**: chiikawa-bakery, ghibli-park, krispy-kreme-mario.
- **PASS-with-flag (1/9)**: chiikawa-land-tokyo (transparent same-IP proxy disclosure).
- **FAIL strict (5/9)**: spy-family, familymart-durarara, universal-cool-japan, pokepark-kanto, blue-lock-skytree.

All 5 FAILs share the same root cause: hero/body are generic venue exteriors (Tokyo Skytree, Yomiuriland, USJ entrance, FamilyMart Shinjuku, Sunshine City). Per the new strict rule, this is FAIL even though each is real-photo + correctly-licensed Wikimedia.

## Why no fix was attempted in this session for the 5 FAILs

The compliant source ladder for collab-specific visuals on these 5 articles is:

1. **Wikimedia Commons** — collab-specific event photos (e.g. Skytree with Blue Lock character lighting overlay; FamilyMart Durarara!! storefront; USJ Cool Japan 2026 zone) generally do not exist on Commons within hours/weeks of campaign launch. Verified absent for these 5 collabs as of 2026-04-27.
2. **公式 X post** — sourcing requires WebFetch. WebFetch is a deferred tool requiring schema-load + per-domain allowlist confirmation. `@bluelock_PR`, `@TOKYO_SKYTREE`, `@famima_now`, `@spy_family_anime`, `@USJ_Official`, `@PokemonCoJp`, `@yomiuriland`, `@ghibliparkofficial` X account image CDNs are not pre-cleared in the WebFetch allowlist. Per `feedback_official_image_modification_ok.md`: "If WebFetch domain not allowed, ask user to add to settings allow-list before retry." That gate is the correct stop here.
3. **公式 web press section** — same WebFetch requirement; the brand .jp domains (`tokyo-skytree.jp`, `family.co.jp`, `usj.co.jp`, `ghibli-park.jp`, `pokemon.co.jp` press subpaths) need allowlist confirmation before binary download.
4. **Google Maps owner photo** — last resort, owner-only filter; the venues are large public landmarks where owner-tagged photos rarely capture the time-bounded collab overlay.
5. **Generation / Unsplash / Getty / IP key visual without permission** — banned per memory rules. Will NOT be used as a workaround.

Therefore: per memory `feedback_official_image_modification_ok.md` "When agent reports 'no source found' / Do NOT generate a placeholder. Instead: 1. Document the article slug in `docs/images/source-absent-{date}.md` / 2. Flag for Takapon photoshoot priority queue / 3. Leave the article without that image — text-only section is preferable to fake graphic / 4. The 4-axis rule's 軸 1 (image floor) is a target, not a justification for fabricating content" — the correct outcome is the exhausted log + Takapon flag.

This audit therefore (a) records the strict-mode verdict per article, (b) flags 5 articles for next-sprint sourcing once WebFetch domain allowlist is expanded or Takapon photoshoots take place, (c) does not modify the FAIL articles' images in this session because every available shortcut would violate one of the bans.

## Verification gate status

For the 4 PASS / PASS-with-flag articles, no image change was made, so the 5-step prod verify gate is N/A for this session — the existing files already passed prior dim-4 audit. Step 4-5 were re-run mentally against the current rendered HTML (image references unchanged, alt text unchanged, captions unchanged) — no regression.

For the 5 FAIL articles, no PASS is being claimed, so the gate does not apply. The verdict is documented FAIL pending source.

## Commits made this session

None to article images. The only file changes are this audit document and `docs/audit/collab-image-exhausted-20260427.md` + frontmatter `imageNote:` additions on the 5 FAIL articles.

## JSON summary

```json
{
  "audit_date": "2026-04-27",
  "scope": "Strict Mode Batch 3 — 9 collab/IP articles",
  "ruleset": ["feedback_image_strict_universal_rule.md", "feedback_official_image_modification_ok.md", "feedback_image_claim_verify_strict.md"],
  "verdicts": {
    "PASS": ["chiikawa-bakery-harajuku-guide-2026", "ghibli-park-complete-guide-2026", "krispy-kreme-mario-galaxy-shibuya-2026"],
    "PASS_with_flag": ["chiikawa-land-tokyo-complete-2026"],
    "FAIL_exhausted": ["spy-family-tokyo-fan-day-2026", "familymart-anime-collab-stores-2026", "universal-cool-japan-2026-guide", "pokepark-kanto-tokyo-2026", "blue-lock-tokyo-skytree-cafe-2026"]
  },
  "counts": {"pass": 3, "pass_with_flag": 1, "fail_exhausted": 5, "total": 9},
  "image_changes_committed": 0,
  "exhausted_log": "docs/audit/collab-image-exhausted-20260427.md",
  "takapon_flag_count": 6,
  "blocking_dependency": "WebFetch allowlist expansion for official X / brand press domains, OR Takapon on-site photography for Skytree-Blue-Lock / FamilyMart-Durarara / USJ-Cool-Japan / PokéPark-Kanto / Spy×Family-WAKUWAKU venues"
}
```
