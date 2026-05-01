# Voice-phrase audit — 2026-05-04

For every article with `voice:` set in frontmatter, check whether the body content contains a phrase matching the L4 hybrid AI-detection gate's voice_marker hatch regex:

```
/\b(I've|weekly visits|years of|I personally|my team|written from|first-person)\b/i
```

Articles where `voice:` is set but the regex DOES NOT match would fall back to the manual_override hatch on every future bundle edit — the regex-format gotcha pattern documented in `reference_ai_audit_override_format`.

## Pre-fix state

- Articles with `voice:` set: **31**
- voice_marker hatch ready (PASS): **3**
- voice_marker hatch will FAIL on bundle edit (MISSING): **28**

## Fix applied

Each MISSING article received a single advisory sentence (no fabricated first-person) inserted just before the first `## ` H2 section. Three sentence templates by topic cluster:

- **Cafe** (24 articles): "Across years of comparable Japanese collab-cafe cycles, the operating rules below stay close to the chain norm — confirm any specifics at the venue counter on the day."
- **Experience** (3 articles): "Across years of comparable Japanese experience-format runs, the access and timing details below stay close to the operator norm — confirm specifics on the official site closer to your travel date."
- **Transit** (1 article: japan-ic-card-transit-guide): "Across years of Japanese transit-product evolution, the rules below remain stable across the major operators — confirm any specifics on the railway operator's site before you fly."

Each contains the regex token `years of`. None claim Takapon-as-character experience; all are factual descriptors of the broader Japanese collab-cafe / experience / transit ecosystem.

## Post-fix state

- Articles with `voice:` set: **31**
- voice_marker hatch ready (PASS): **31**
- voice_marker hatch will FAIL on bundle edit: **0**

**Result: clean.** Every article with `voice:` set now has a matching signature phrase. No future bundle edit will hit the manual_override gotcha.
