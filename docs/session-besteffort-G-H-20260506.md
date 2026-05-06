# Best-effort cleanup G+H session report — 2026-05-06

V2 deferred buckets G (anime-hotels-tokyo-2026) and H (anime-merch-shopping-guide-japan) executed in this session per the v3 best-effort spec. **Critic GREEN 5/5 on independent verification.**

## Bucket G — anime-hotels-tokyo-2026 (commit `3a93402`)

### Pre-edit fabrication audit (the actual reason this was deferred)
The original article contained the following first-person stay claims that violate `feedback_no_first_person_fabrication`:

- Excerpt: *"I've tested six anime-themed hotels"*
- Body line 21: *"I've spent the last three months testing six anime-themed hotels"*
- Body line 122: *"This is what I recommend to friends visiting for their first time."*
- Body line 273: *"I've stayed in all of them. My personal choice? Tavinos."*
- Plus subjective stay claims throughout: *"smell like stale energy drink and sleep"*, *"front desk speaks English and gives actual helpful advice"*, *"if you're over 6'2″, you'll touch both walls"* — all fabricated experience-level details.

### Plus a factual error
Astro Station was placed in *"Asakusa (1-minute walk to Tawaramachi Station)"*. WebSearch on the property's listings (Tripadvisor, Agoda, Trip.com) shows it is located in **Takadanobaba (Shinjuku Ward), 2-minute walk to Takadanobaba Station** — completely different ward.

### Edits applied
- Excerpt + opening rewritten as operator-source comparison.
- Quick comparison table rebuilt with operator-citation rate ranges (Booking.com, KAYAK, Agoda) + corrected Astro Station location.
- All 5 hotel sections rewritten:
  1. **Astro Station** — moved to correct Takadanobaba; replaced subjective claims with operator-listing facts (game room, projector, shared baths, 24h front desk).
  2. **Manga Art Hotel Jimbocho** — sourced from operator's official page (12F Book Hotel Jimbocho, ~5,000 manga volumes, sister Manga Art Room + Bakurocho location, ~1-min walk).
  3. **Hotel Tavinos Asakusa** — pulled directly from operator official site (4-min Tsukuba Express Asakusa A1; festival theme with taiyaki/cotton-candy/water-balloon motifs; check-in/out times; coin-laundry, 24h coffee, free morning snacks).
  4. **Hotel Gracery Shinjuku** — Godzilla floor section rebuilt as a room-types table with operator-published rates (Godzilla vs King Ghidorah Room from ¥122,400). Booking rule (3-month-prior 1st-of-month online-only specialty rooms) added.
  5. **Sunshine City Prince IKEPRI25** — recent collab table with sourced examples: Evangelion (Aug-Nov 2025), Black Butler (2024-25), Attack on Titan (Dec 2025). Earlier "Demon Slayer / AoT / JJK rotate" line was incorrect — no Demon Slayer / JJK collabs surfaced in independent verification.
- "I've stayed in all of them" final paragraph removed; replaced with operator-positioning summary.
- "Explore by Area" stale legacy slug block replaced with current canonical internal links.

### Critic 3-step
- Critic 1 (syntax): npm run validate PASS — all 87 articles
- Critic 2 (factual): **26 source citations** (per the operator / official site / per Booking.com / per the announcement / etc.)
- Critic 3 (no-fabrication): **0 first-person stay claims, 0 "My personal" editorial, 0 Takapon-visited claims**

## Bucket H — anime-merch-shopping-guide-japan (commit `a75bdf6`)

### Pre-edit audit finding
The H article was already **0 first-person fabrication** (verified via grep on `\b(I (bought|shopped|stayed|visited|tested|tried|spent|recommend|own))\b` and `My (personal|favorite|take|honest|stay|haul|purchase)`) — both returned 0 matches before the edits started. The H deferral in the v2 cycle was driven by user instruction ("waiting on Takapon shopping receipts"), not by fabrication risk in the existing text.

So the H bucket pivoted to: **add source citations + material policy updates** rather than removing first-person.

### Edits applied
- lastUpdated bumped (frontmatter + inline body).
- **Animate Ikebukuro flagship corrected**: "9 floors" → **"9 above-ground floors plus 2 basement levels"** per the [official Animate floor guide](https://www.animate.co.jp/en/shop/ikebukuro/floor/). Added 8F Space Galleria + 9F Animate Hall details. Added official address (1-20-7 Higashiikebukuro, Toshima City) + 5-min walk from East Exit per official access page.
- **Mandarake Nakano Broadway**: added the operator's "27+ individual specialty stores" figure per the [store directory](https://earth.mandarake.co.jp/shop/). Listed major specialty stores (Main / Special / Cosplay / Doujinshi).
- **Mandarake Akihabara Complex**: added "opened April 2008" per operator + Wikipedia.
- **Tax-free shopping section**:
  - Added per-JNTO citation for the existing ¥5,000-same-day-same-store rule against Japan's 10% consumption tax (VAT).
  - **Added MATERIAL CHANGE notice for 2026-11-01** "pay full tax + airport refund" system overhaul per Japan Tourism Agency announcements: ¥500,000 cap abolished, general-goods/consumables distinction removed. Travelers arriving after 2026-11-01 will need extra airport time for the refund step. Sourced from [JNTO](https://www.japan.travel/en/plan/japans-tax-exemption/) + [Japan Tourism Agency](https://www.mlit.go.jp/kankocho/).

### Critic 3-step
- Critic 1 (syntax): npm run validate PASS
- Critic 2 (factual): **24 source citations** across the article
- Critic 3 (no-fabrication): 0 first-person, 0 fabrication, 0 Takapon-visited claims (was already 0 pre-edit)

## Combined session — final critic verdict
A consolidated end-of-session Critic agent independently verified 5 high-leverage claims via repo Read:
1. G — no fabrication remaining ✓
2. G — Astro Station location corrected to Takadanobaba ✓
3. H — 2026-11-01 tax-free transition documented with JTA + JNTO sources ✓
4. H — Animate Ikebukuro corrected to "9 above-ground + 2 basement" with citation ✓
5. Markdown / mdx structural integrity intact ✓

**Overall verdict: GREEN 5/5.**

## Word counts before / after

| Article | Before | After | Delta |
|---|---|---|---|
| anime-hotels-tokyo-2026.md | ~3,275 words (subjective Pros/Cons / first-person experience prose) | ~2,650 words (operator-cited factual blocks) | -625 words; net density / source-quality up |
| anime-merch-shopping-guide-japan.md | ~3,360 words | ~3,490 words | +130 words (added tax-free 2026-11 section + Animate / Mandarake citations) |

Source-citation density rose substantially in both — G went from ~5 inline operator references to 26; H from ~10 to 24.

## Constraint compliance
- ✅ no fabrication added (Critic verified)
- ✅ no destructive ops (only metadata + body content edits)
- ✅ no file deletes (.deprecated rule preserved; both articles updated in place)
- ✅ no `--no-verify` / `--force` / `--admin`
- ✅ direct push to main within allowed paths (content/articles/, docs/)
- ✅ "1 commit 1 機能" — G in commit `3a93402`, H in commit `a75bdf6`, this report separate
- ✅ Critic loop 3-step on every change
- ✅ image / Takapon byline / 5-silo / no-delete rules honored

## Combined v2+v3 backlog status (post G+H)

Now done across v2 + v3:
- ✅ A — Mojibake repair (6 articles)
- ✅ I — your-name link sweep + cross-article broken-link fixes (5 articles)
- ✅ F — frieren USJ pre-launch rewrite + un-noindex
- ✅ C — cannibalization cluster review (no edits needed)
- ✅ G — anime-hotels source-cited rewrite (this session)
- ✅ H — anime-merch source-cited expansion (this session)

Still deferred (next session):
- D — anime-pilgrimage ranked reorganization (needs paid Google Trends API for "objective" ranking criteria)
- E — AI-tone diversification 10 articles (per-paragraph judgment work, slow)
- B — primaryVenueUrl + price refresh (multi-file lib + 88-article migration)
- J — embedding pipeline (out of session budget)
- K — alt text + schema P2 polish (heuristic false positives; better human-in-loop)
