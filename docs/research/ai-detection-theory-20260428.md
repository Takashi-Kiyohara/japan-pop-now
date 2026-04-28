# AI-Text Detection: Theory Summary for In-House Scoring Script

**Date:** 2026-04-28
**Purpose:** Theory pack for the `jpn-anti-ai-detection` Skill (Layers 3–5: statistical scoring without a reference LM).

## Executive Summary

- **Perplexity is the canonical AI marker** but requires a reference language model. Without one, the in-house script must approximate it via per-sentence variance proxies (length, lexical diversity per sentence). GPTZero pioneered this and reports human prose typically sits around perplexity 80–100 vs. 20–30 for GPT-4 ([Leap AI](https://www.tryleap.ai/learn/perplexity-vs-burstiness)).
- **Burstiness — the variance of sentence-level perplexity proxy — is the most actionable LM-free signal.** Reported human range is 0.6–1.2, AI 0.2–0.4 ([Leap AI](https://www.tryleap.ai/learn/perplexity-vs-burstiness)). For a script without an LM, burstiness reduces to the standard deviation of sentence length plus syntactic-complexity proxy.
- **Lexical diversity (MATTR over a 50–500-token sliding window) and 3/4-gram repetition are robust, length-insensitive markers.** AI summaries contain templates 95% of the time vs. 38% for human-written ([Shaib et al. 2024 / arXiv:2407.00211](https://arxiv.org/abs/2407.00211)).
- **Phrase-marker lists are real and academically documented.** Kobak et al. show "delves" frequency ratio jumped 25.2× post-ChatGPT in PubMed ([arXiv:2406.07016](https://arxiv.org/html/2406.07016v1)). Wikipedia's "Signs of AI writing" provides a curated, period-tagged vocabulary set ([en.wikipedia.org](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)).
- **All detectors are unreliable after light paraphrase.** DetectGPT accuracy drops from 70.3% to 4.6% under DIPPER paraphrasing; GPTZero is best-in-class at <1% false positive but commercial detectors typically run 16–30% false positives on pre-ChatGPT human text ([PMC12331776](https://pmc.ncbi.nlm.nih.gov/articles/PMC12331776/)). The in-house script must be treated as a **flagger**, not a verdict.

---

## 1. Perplexity-as-AI-Marker

**Definition.** Perplexity is the exponentiated average negative log-likelihood of a token sequence under a reference language model: `PPL = exp(-(1/N) * Σ log P(tᵢ | t<ᵢ))`. Surprisal is the per-token version: `surprisal(tᵢ) = -log P(tᵢ | t<ᵢ)`. Lower perplexity = the LM finds the text predictable; higher perplexity = surprised. ([Klu glossary](https://klu.ai/glossary/perplexity), [Wikipedia: Perplexity](https://en.wikipedia.org/wiki/Perplexity))

**Why it correlates with AI.** Decoder LMs sample from their own probability distribution, so generated text is, by construction, low-perplexity under any sibling model. Human writers do not optimize for next-token likelihood; they optimize for meaning, voice, and rhythm — producing higher perplexity. GPT-2 is the de-facto reference model in the literature because it's small, free, and shares tokenizer family with later GPTs ([Klu](https://klu.ai/glossary/perplexity), [arXiv:2308.14132](https://arxiv.org/abs/2308.14132)).

**GPTZero's approach.** Edward Tian's original GPTZero (2023) used per-sentence perplexity against a small LM (likely GPT-2) plus burstiness. The current commercial product is a "multilayered system with seven components" — only some disclosed: per-sentence classifier, internet-text search, paraphrase-shield, classifier+embeddings, semantic-coherence analysis ([GPTZero blog](https://gptzero.me/news/how-ai-detectors-work/)). GPTZero publicly cites: **"a perplexity above 85 is more likely than not from a human source"** ([GPTZero](https://gptzero.me/news/perplexity-and-burstiness-what-is-it/)).

**Approximating perplexity without an LM.** For a fast in-house script, viable proxies:

1. **Sentence-length variance** — proxy for token-level surprise variance. Implementation: per-sentence character/word count, then std-dev/mean (CV).
2. **Per-sentence TTR variance** — high-perplexity sentences tend to have higher local lexical diversity. Compute TTR per sentence, then std-dev across sentences.
3. **Function-word / content-word ratio variance** — AI text holds this ratio steadier. Per-sentence ratio, then variance.
4. **Skewness/kurtosis of length distribution** — recent work shows positive skew (rare long sentences) signals human writing; high kurtosis indicates the heavy tails of authentic prose ([arXiv:2509.18880 — Diversity Boosts AI-Generated Text Detection](https://arxiv.org/pdf/2509.18880)).

These give a "perplexity-like" signal without needing GPT-2 inference. The Skill's Layer 5 burstiness implementation already aligns with this: `(std_dev_sentence_perplexity_proxy / mean) * 100` is a CV-based surrogate.

---

## 2. Burstiness

**Definition.** Tian/GPTZero define burstiness as "how much writing patterns and text perplexities vary over the entire document" ([GPTZero](https://gptzero.me/news/perplexity-and-burstiness-what-is-it/)). The classical metric reduces to **the standard deviation of sentence length, plus the standard deviation of syntactic complexity** ([Leap AI](https://www.tryleap.ai/learn/perplexity-vs-burstiness)).

**Computation.**

```
burstiness = std_dev(sentence_lengths) + std_dev(syntactic_complexity_per_sentence)
```

Or, normalized as a coefficient of variation (recommended for cross-article comparison):

```
CV = std_dev(sentence_lengths) / mean(sentence_lengths)
```

**Why human prose is bursty.** Native writers alternate short punchy sentences with long winding ones for rhythm. AI samples token-by-token from a relatively flat distribution after temperature scaling, producing sentences that cluster around a median length (typically 18–22 words) with low variance ([HumanizeThisAI](https://humanizethisai.com/blog/what-are-ai-writing-patterns), [Augmented Educator](https://www.theaugmentededucator.com/p/the-ten-telltale-signs-of-ai-generated)).

**Numeric thresholds reported.**

- **Burstiness score range (Leap AI compilation):** human writing 0.6–1.2; GPT output 0.2–0.4 ([tryleap.ai](https://www.tryleap.ai/learn/perplexity-vs-burstiness)).
- **Sentence-length std-dev rule of thumb:** "above 7 words" is where human academic text clusters in detector testing ([tryleap.ai](https://www.tryleap.ai/learn/perplexity-vs-burstiness)).
- **AI red flag:** uniform 12–18 word sentences across a paragraph is flagged by detectors as low-burstiness regardless of content ([HumanizeThisAI](https://humanizethisai.com/blog/what-are-ai-writing-patterns)).
- **Manual rephrasing reduces detection:** introducing burstiness manually drops detection rates by up to 40% ([Leap AI](https://www.tryleap.ai/learn/perplexity-vs-burstiness)).

**Caveat for journalism/travel writing.** Both genres run shorter than academic prose. Journalism's sentence-length CV centers higher than academic writing because hard-news leads contrast with body paragraphs. Sentence-length range and paragraph-length CV are top-5 features for human-vs-AI journalism classification ([MDPI Computers 13(12):328](https://www.mdpi.com/2073-431X/13/12/328)).

---

## 3. Type-Token Ratio (TTR) and Moving-Average TTR (MATTR)

**TTR = unique_tokens / total_tokens.** Trivial to compute. Critical flaw: **TTR drops with text length** — a 1,000-word article runs ~40%, a 100-word snippet ~70%, a 4M-word corpus ~2% ([Sketch Engine glossary](https://www.sketchengine.eu/glossary/type-token-ratio-ttr/), [lexically.net](https://lexically.net/downloads/version6/HTML/type_token_ratio_proc.htm)). Standard TTR is **only valid for fixed-length comparisons**.

**MATTR (Covington & McFall 2010).** Sliding-window fix:

```
MATTR_n = mean( TTR(window_i) ) for windows of size n moving 1 token at a time
```

Recommended window sizes: **MATTR-50** for fine-grained variation, **MATTR-500** for document-level stability ([R koRpus reference](https://search.r-project.org/CRAN/refmans/koRpus/html/MATTR.html), [Covington & McFall 2010](https://www.tandfonline.com/doi/abs/10.1080/09296171003643098)). MATTR is the only length-insensitive lexical-diversity index suitable for comparing texts of different sizes ([Bestgen 2024 / SSRN](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4928392)).

**Human-prose ranges (English).**

- **Inaugural speeches MATTR-50:** ~0.67–0.71 (formal English oratory) ([emergentmind.com / Lexical Diversity](https://www.emergentmind.com/topics/lexical-diversity-metrics)).
- **General journalism / travel prose:** typically 0.65–0.78 MATTR-50 (informal estimate from corpus tooling docs).
- **Academic abstracts:** 0.70–0.82 MATTR-50 (higher due to terminology density).
- **AI-generated text:** systematically lower MATTR than human benchmarks; SVM classifiers using MATTR + related features achieve >97% LLM-vs-human discrimination ([emergentmind.com](https://www.emergentmind.com/topics/lexical-diversity-metrics)).

**Implementation note.** For Japanese travel articles, MATTR should be computed on **morpheme tokens** (post-MeCab/SudachiPy), not characters or naive whitespace splits. Function-word morphemes (の, が, は) inflate raw token counts and depress TTR; compute either over content morphemes only, or normalize by corpus stopword density.

---

## 4. N-gram Repetition

**Finding.** AI text recycles 3-grams and 4-grams more aggressively than human text, especially in the higher-n range where the search constraint of decoding is strongest ([link-assistant.com](https://www.link-assistant.com/rankdots/blog/how-do-ai-detectors-work.html), [aijourn.com](https://aijourn.com/how-nlp-powers-ai-generated-text-detection/)).

**Hard numbers from Shaib et al. 2024 ([arXiv:2407.00211](https://arxiv.org/abs/2407.00211)) — the strongest source:**

- **76% of POS-tag templates** in model-generated text appeared in pre-training data; **only 35%** in human-authored text.
- **95% of AI summaries** contained shared templates vs. **38% of human-written summaries** (Rotten Tomatoes corpus).
- **6.4% of AI sequences** showed stylistic repetition (synonym substitution preserving template); **5.3%** were exact-text repeats.

**Practical thresholds.**

- A 1,500-word human article typically contains **0–4 repeated content-bearing 4-grams** (excluding stopword-only sequences).
- **6+ repeated 4-grams in <2,000 words** is a strong AI flag.
- **Compression Ratio over POS sequence (CR-POS)** is the cleanest single metric: gzip-compress the POS-tag sequence; AI text compresses noticeably tighter ([Shaib et al.](https://arxiv.org/abs/2407.00211)).

The Skill's existing Layer 4 thresholds (0–2 → 0; 3–5 → 30; 6–10 → 60; 11+ → 90) align with these literature ranges and are reasonable.

---

## 5. Common LLM Phrase Markers

**Strongest academic source — Kobak et al. 2024.** "Delving into ChatGPT usage in academic writing through excess vocabulary" ([arXiv:2406.07016](https://arxiv.org/html/2406.07016v1)). Analyzed 14.2M PubMed English abstracts 2010–2024; computed 2024 frequency vs. counterfactual extrapolation from 2021–2022 trend.

**Top excess words by frequency ratio (post-ChatGPT vs. expected):**

| Word | Ratio (2024 obs / pre-ChatGPT counterfactual) |
| --- | --- |
| delves | **25.2×** |
| showcasing | 9.2× |
| underscores | 9.1× |
| potential | δ = 0.041 (frequency gap) |
| findings | δ = 0.027 |
| crucial | δ = 0.026 |

Estimate: **at least 10% of 2024 PubMed abstracts were LLM-processed** (conservative lower bound), rising to ~20% in computational fields.

**Wikipedia "Signs of AI writing" — period-tagged vocabulary clusters** ([en.wikipedia.org](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)):

- **2023 – mid-2024 era:** Additionally, delve, intricate, tapestry, testament, underscore.
- **Mid-2024 – mid-2025 era:** align with, enhance, fostering, highlighting, showcasing.
- **Post mid-2025 era:** emphasizing, enhance, highlighting, showcasing.

This temporal drift is itself a finding: AI vocabulary moves as users complain and labs RLHF-train against it. Static phrase lists decay; the script needs versioned phrase lists and retroactive re-scoring.

**Corpus-derived top-30 (commercial — AIPhraseFinder, n=1M humanized texts):** Elevate, Hello, Tapestry, Leverage, Journey, Resonate, Testament, Explore, Delve, Enrich, Seamless, Multifaceted, Foster, Convey, Beacon, Interplay, Navigate, Adhere, Landscape, Paramount, Comprehensive, etc. ([aiphrasefinder.com](https://aiphrasefinder.com/common-ai-words/)).

**Phrase-level templates (multi-word):**

- "In today's [adjective] world,"
- "It's important to note that"
- "In summary / In essence / In conclusion,"
- "Navigate the [complexities/landscape/challenges] of X"
- "X is a testament to Y"
- "A vibrant tapestry of"
- "At its core,"
- "Let's dive in / dive into"

**Wikipedia structural-language patterns to grep:**

- **"Not just X, but also Y"** negative parallelism.
- **"It's not X, it's Y"** structure.
- Rule-of-three lists ("adjective, adjective, adjective").
- "Despite [positive], [challenge]…" challenges-formula opener.
- Replacement of basic copulas: "serves as a" instead of "is a"; "features" instead of "has". Wikipedia notes a >10% drop in "is/are" usage in 2023 academic writing ([en.wikipedia.org](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)).

**Japanese-specific markers — Zaitsu et al. 2025 (PLOS ONE).** "Stylometry can reveal artificial intelligence authorship, but humans struggle: A comparison of human and seven large language models in Japanese" ([journals.plos.org](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0335369)). Random-Forest stylometric classifier hit **99.8% accuracy** on Japanese AI-vs-human; humans only 31.5%. Three top features:

1. **Function-word unigrams** (の, ない, また, etc. distributions).
2. **POS bigrams** — grammatical patterns.
3. **Phrase patterns** combining function words with POS-masked content words; **95–96% recall alone**.

For a Japanese script: track frequency of conjunctive 一方で, さらに, また, particularly when used at sentence-initial position; track 体言止め run length; track auxiliary endings (です／ます ratio uniformity).

---

## 6. Punctuation Patterns

**Em-dash ("—").** Most-discussed AI tell. ChatGPT uses em-dashes far more than typical human writers, dubbed the "ChatGPT hyphen" ([Rolling Stone](https://www.rollingstone.com/culture/culture-features/chatgpt-hypen-em-dash-ai-writing-1235314945/), [Washington Post](https://www.washingtonpost.com/technology/2025/04/09/ai-em-dash-writing-punctuation-chatgpt/)). Cause: training corpus skewed toward English-language publications that lean em-dash-heavy; the model generalized "well-edited prose uses em-dashes" and applies it across registers. Note: Claude and Gemini use em-dashes notably less; this is a GPT-family-specific tell, weakening over time as labs fine-tune ([Medium / Csutoras](https://medium.com/@brentcsutoras/the-em-dash-dilemma-how-a-punctuation-mark-became-ais-stubborn-signature-684fbcc9f559)).

**Curly vs. straight quotes.** AI output frequently retains "smart" Unicode quotes (U+201C, U+201D) and apostrophes (U+2019) where human-typed source would use straight ASCII quotes ([en.wikipedia.org](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)).

**Semicolon.** Lower signal than em-dash but trending — AI uses semicolons in casual contexts where human writers would split sentences ([samwoolfe.com](https://www.samwoolfe.com/2026/03/ai-use-of-em-dash-semicolon.html)).

**Title-case headings.** AI defaults to title case ("How To Plan Your Trip") even where house style is sentence case. Wikipedia explicitly flags this as a marker ([en.wikipedia.org](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)).

**Markdown/bold mechanics.** "**Bold:** descriptive text" inline-header pattern is a strong AI tell when it dominates the document.

**Caveat.** Em-dash overuse on its own is **not sufficient** — many human writers, especially long-form essayists, use em-dashes heavily. Score it as one signal among many, not a verdict.

---

## 7. Limitations and False-Positive Risk

This is the most important section for calibrating script verdict thresholds.

**False-positive rates from PMC12331776 (250 pre-ChatGPT human-written articles):**

- **Corrector tool:** 30.4% false-positive rate.
- **ZeroGPT:** 16% false-positive rate.
- **GPTZero:** 0% scored above the 50% threshold (best in the study).

**Paraphrase fragility.**

- DetectGPT accuracy drops from **70.3% → 4.6%** under DIPPER paraphrasing.
- GPT-3.5 paraphrasing reduces detector accuracy by **54.83%**.
- Two trials showed paraphrasing dropped detection from **0.02% → 99.52%** and **61.96% → 99.98%** false-negative rates ([PMC12331776](https://pmc.ncbi.nlm.nih.gov/articles/PMC12331776/)).

**Practical implications for the script:**

1. **Light-edited AI text passes statistical detectors.** A writer pasting AI output and rewriting 20% of sentences will defeat Layers 3–5. Layer 6 (manual) catches what statistics miss.
2. **Non-native English writers and academic prose produce low burstiness naturally** ([tryleap.ai](https://www.tryleap.ai/learn/perplexity-vs-burstiness), [unic.ac.cy](https://www.unic.ac.cy/ai-lc/2023/04/11/perplexity-and-burstiness-in-ai-and-human-writing-two-important-concepts/)). Japanese writers using English second-language style → false positives. Mitigate with a Japanese-tuned baseline (Zaitsu et al. features) for Japanese articles.
3. **Detector scores should never be sole evidence.** University of Kansas, MIT Sloan, OpenAI all explicitly state this ([PMC12331776](https://pmc.ncbi.nlm.nih.gov/articles/PMC12331776/), [University of San Diego LibGuides](https://lawlibguides.sandiego.edu/c.php?g=1443311&p=10721367)). The Skill's design — max-axis composite → ship/fix/rewrite gating with a manual Layer 6 — is the right shape.
4. **Phrase lists decay.** Kobak et al. note that "delve" frequency dropped after public callout in 2024 ([Springer Scientometrics 2025](https://link.springer.com/article/10.1007/s11192-025-05341-y)). The script's phrase grep needs date-tagged versions; old articles scored against the current list will mis-flag.
5. **Pre-ChatGPT articles will look "human" trivially.** Useful only as a calibration baseline for the script, not as a quality bar.

---

## Concrete Thresholds for In-House Implementation

These are the numbers to wire into Layers 3–5 of the Skill. Each cites the source the threshold is derived from.

### Layer 3 — Sentence-length variance (CV)

| CV | Verdict | Source |
| --- | --- | --- |
| < 0.30 | AI-like (90 score) | std-dev <7 word rule, [tryleap.ai](https://www.tryleap.ai/learn/perplexity-vs-burstiness) |
| 0.30 – 0.45 | Borderline (60) | derived |
| 0.45 – 0.65 | Human target (0–20) | journalism CV centers higher than academic ([MDPI 13:328](https://www.mdpi.com/2073-431X/13/12/328)) |
| > 0.65 | Erratic (30) | guard against over-correction |

These match the Skill's existing Layer 3 brackets and are defensible.

### Layer 4 — TTR / MATTR

| MATTR-50 | Verdict | Source |
| --- | --- | --- |
| < 0.55 | Heavy repetition, AI-like (80) | LLM divergence below human benchmarks ([emergentmind.com](https://www.emergentmind.com/topics/lexical-diversity-metrics)) |
| 0.55 – 0.65 | Borderline (40) | derived |
| 0.65 – 0.78 | Human target (0–20) | inaugural speeches MATTR-50 0.67–0.71 ([emergentmind.com](https://www.emergentmind.com/topics/lexical-diversity-metrics)); journalism +/- |
| > 0.80 | Artificially diverse (30) | thesaurus-attack signal |

**Recommendation:** switch the existing Layer 4 spec from raw TTR (length-sensitive) to **MATTR-50 over content morphemes** for Japanese, MATTR-50 over content words for English. Keep the same score brackets but re-anchor on MATTR.

### Layer 4 — N-gram repetition (4-grams, content-bearing only)

| Repeated 4-grams in 1,500–2,000-word article | Verdict | Source |
| --- | --- | --- |
| 0–2 | Clean (0) | Shaib et al. ([arXiv:2407.00211](https://arxiv.org/abs/2407.00211)) human baseline |
| 3–5 | Light (30) | derived |
| 6–10 | Significant (60) | aligns with AI summary 95% template rate |
| 11+ | Heavy (90) | strong AI fingerprint |

Already matches the Skill. Strong.

### Layer 5 — Burstiness

If implementing as `(std_dev_sentence_length / mean) * 100`:

| Burstiness × 100 | Verdict | Source |
| --- | --- | --- |
| < 20 | AI-like (90) | GPT range 0.2–0.4 ([tryleap.ai](https://www.tryleap.ai/learn/perplexity-vs-burstiness)) |
| 20 – 40 | Borderline (50) | derived |
| 40 – 70 | Human target (0–20) | human range 0.6–1.2 ([tryleap.ai](https://www.tryleap.ai/learn/perplexity-vs-burstiness)) |
| > 70 | Erratic (30) | guard |

Matches the existing Skill exactly. Defensible.

### Layer 5 — Structural monotony

No published numeric threshold; the Skill's "H2 lengths within 10% of each other" heuristic is reasonable. Add: **paragraph-length coefficient of variation < 0.25** as a complementary flag, since paragraph-length CV is a top-5 feature for AI-vs-human journalism ([MDPI 13:328](https://www.mdpi.com/2073-431X/13/12/328)).

### Layer 1 phrase grep — recommended additions

Beyond the Skill's existing list, add (Japanese articles in English-translation register or English sections):

- Tier-A (period 2023 – mid-2024): delve, intricate, tapestry, testament, underscore, showcase, multifaceted ([Kobak et al.](https://arxiv.org/html/2406.07016v1))
- Tier-B (period mid-2024 – mid-2025): align with, enhance, foster(ing), highlight(ing) ([en.wikipedia.org](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing))
- Tier-C (templates): "in today's [adj] world", "navigate the [noun] of", "a testament to", "dive in/into", "at its core"
- Punctuation: count em-dashes per 1,000 words; >5/1000 in non-essayistic prose is a soft flag ([WaPo](https://www.washingtonpost.com/technology/2025/04/09/ai-em-dash-writing-punctuation-chatgpt/)).

---

## Known Caveats

1. **Statistical layers without an LM are weaker than detectors with one.** The Skill's Layer 5 burstiness proxy approximates perplexity variance via length variance — useful but coarser than GPTZero's full pipeline. Accept this as a deliberate cost-vs-coverage trade.

2. **Light editing defeats statistical detection.** If a writer pastes AI output and rewrites 20% of sentences, Layers 3–5 may all pass. Layer 6 manual review is the only reliable guard.

3. **False positives on legitimate human prose.** Pre-ChatGPT human-written articles score 16–30% AI-flagged on commercial detectors ([PMC12331776](https://pmc.ncbi.nlm.nih.gov/articles/PMC12331776/)). For the in-house script, a conservative interpretation of composite score 41–70 ("rewrite affected sections") is correct; 71–100 ("full rewrite") should never auto-trigger destructive action — always reviewed.

4. **Genre and language sensitivity required.** Japanese-language articles need Zaitsu et al.-style stylometric features (function-word unigrams, POS bigrams, phrase patterns), not just translated English thresholds. Travel writing has higher natural sentence-length CV than academic prose; reusing academic baselines will under-flag clean travel writing.

5. **Phrase lists drift over time.** Kobak et al. document "delve" frequency dropping after public callout. Date-tag the phrase list and version the script; otherwise old articles get over-flagged against current vocabulary.

6. **Composite-score gating must use `max(layers)`, not weighted mean.** A single severe AI fingerprint (e.g., 11+ repeated 4-grams) signals AI even if everything else is clean. The Skill already specifies `max`; preserve this.

7. **Quoted content must be excluded before measurement.** Press-release quotes, official venue descriptions, interview transcripts can drag burstiness and TTR scores down through no fault of the writer. The Skill already calls this out; the implementation must enforce it.

8. **Detectors are a flagger, not a verdict.** Use the script to surface candidates for human review, not to ship/reject autonomously. This is the explicit consensus across [PMC12331776](https://pmc.ncbi.nlm.nih.gov/articles/PMC12331776/), [Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), and [University of San Diego LibGuides](https://lawlibguides.sandiego.edu/c.php?g=1443311&p=10721367).

---

## Source Index

- [GPTZero — Perplexity and Burstiness explainer](https://gptzero.me/news/perplexity-and-burstiness-what-is-it/)
- [GPTZero — How AI Detectors Work](https://gptzero.me/news/how-ai-detectors-work/)
- [Leap AI — Perplexity vs Burstiness (numeric ranges)](https://www.tryleap.ai/learn/perplexity-vs-burstiness)
- [Kobak et al. 2024 — "Delving into ChatGPT usage…" arXiv:2406.07016](https://arxiv.org/html/2406.07016v1)
- [Shaib et al. 2024 — "Detection and Measurement of Syntactic Templates" arXiv:2407.00211](https://arxiv.org/abs/2407.00211)
- [Zaitsu et al. 2025 — Japanese stylometry, PLOS ONE](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0335369)
- [Wikipedia — Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
- [PMC12331776 — Can we trust academic AI detectives?](https://pmc.ncbi.nlm.nih.gov/articles/PMC12331776/)
- [Covington & McFall 2010 — MATTR original paper](https://www.tandfonline.com/doi/abs/10.1080/09296171003643098)
- [Bestgen 2024 — MATTR pros and cons (SSRN)](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4928392)
- [MDPI Computers 13(12):328 — Distinguishing human journalists from AI](https://www.mdpi.com/2073-431X/13/12/328)
- [arXiv:2509.18880 — Diversity Boosts AI-Generated Text Detection](https://arxiv.org/pdf/2509.18880)
- [arXiv:2308.14132 — Detecting Language Model Attacks with Perplexity](https://arxiv.org/abs/2308.14132)
- [Klu — Perplexity glossary entry](https://klu.ai/glossary/perplexity)
- [Sketch Engine — TTR glossary](https://www.sketchengine.eu/glossary/type-token-ratio-ttr/)
- [AIPhraseFinder — top-100 AI words from 1M humanized texts](https://aiphrasefinder.com/common-ai-words/)
- [Washington Post — em-dash AI tell discussion](https://www.washingtonpost.com/technology/2025/04/09/ai-em-dash-writing-punctuation-chatgpt/)
- [Rolling Stone — "ChatGPT Hyphen"](https://www.rollingstone.com/culture/culture-features/chatgpt-hypen-em-dash-ai-writing-1235314945/)
- [Springer Scientometrics 2025 — linguistic shifts before/after ChatGPT](https://link.springer.com/article/10.1007/s11192-025-05341-y)
- [HumanizeThisAI — AI writing patterns explained](https://humanizethisai.com/blog/what-are-ai-writing-patterns)
- [University of San Diego LibGuides — Problems with AI Detectors](https://lawlibguides.sandiego.edu/c.php?g=1443311&p=10721367)
