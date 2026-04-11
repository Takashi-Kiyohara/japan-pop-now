# SCHEMA v4.2 — Image Pipeline Data Contracts

This document describes every data structure used by the v4.2 image pipeline so future Claude sessions (and human developers) can extend it without re-reading the full 900-line script.

Version: **4.2**  
Last updated: **2026-04-11**  
Script: `image-pipeline/v4/scripts__process-image-inbox_v4_2.ts`  
Sub-modules: `scripts__semantic-placement.ts`, `scripts__face-aware-crop.ts`

---

## 1. Filename Contract

All files arriving in `public/images/inbox/` MUST follow one of these patterns. The regex is enforced by `parseFilenameV4()`.

### 1.1 Library mode — unassigned photo

```
IMG_<YYYYMMDD>_<HHMMSS>__library[__<caption_b64url>].{jpg,png,webp}
```

Examples:
- `IMG_20260411_143022__library.jpg`
- `IMG_20260411_143022__library__5r-c5qOSIOODmeODvOOCq-ODvA.jpg` (caption = "浅草 ベーカリー")

### 1.2 Existing mode — assigned to a specific article

```
IMG_<YYYYMMDD>_<HHMMSS>__existing__<slug>__<position>[--<size>][__<caption_b64url>].{jpg,png,webp}
```

Where `<position>` is one of:

| Value | Meaning |
|---|---|
| `featured` | Featured image (generates 3 variants: hero/list/og) |
| `body-top` | First body image |
| `body-bottom` | Last body image |
| `body-tall` | Body image, portrait aspect (legacy — use `--tall` suffix instead) |
| `after-h2-<N>` | Immediately after the Nth H2 heading (1-indexed) |
| `replace-worst` | Replace the lowest-quality existing body image |

And `<size>` (optional, added in v4.2 — `--[size]` suffix):

| Value | Meaning | Effective aspect |
|---|---|---|
| (absent / `auto`) | Let pipeline decide | ~16:9 or 4:3 based on source |
| `wide` | Explicit 16:9 crop | 1600×900 |
| `tall` | Explicit 4:3 (portrait-tolerant) | 1200×900 or 900×1200 |

Examples:
- `IMG_20260411_143022__existing__chiikawa-bakery__featured.jpg`
- `IMG_20260411_143022__existing__chiikawa-bakery__body-top--wide.jpg`
- `IMG_20260411_143022__existing__chiikawa-bakery__after-h2-3--tall.jpg`

**Caption encoding**: `captionEncoded` is base64url (RFC 4648 §5) of UTF-8 text. Decoded by `decodeCaption()`.

### 1.3 Video-extracted frames

Videos in the inbox (`.mp4`, `.mov`, `.avi`, `.m4v`) are NOT processed by the TypeScript pipeline directly. The GitHub Actions workflow (`.github/workflows/process-image-inbox.yml`) runs an `ffmpeg` extraction step BEFORE the pipeline, producing:

```
<original_basename>__library_<NN>.jpg
```

Where `<NN>` is a 2-digit frame index (01..10). The extracted JPGs are then processed as library mode images in the same run. Original video files are removed after extraction.

---

## 2. ParsedFilename (internal)

```ts
type Mode = 'library' | 'existing';
type PositionHint =
  | 'auto'
  | 'body-top'
  | 'body-bottom'
  | 'body-tall'
  | 'featured'
  | 'replace-worst'
  | `after-h2-${number}`;
type SizeHint = 'auto' | 'wide' | 'tall';

interface ParsedFilename {
  timestamp: string;          // "20260411_143022"
  mode: Mode;
  slug: string | null;        // null in library mode
  positionHint: PositionHint; // always 'auto' in library mode
  sizeHint: SizeHint;         // v4.2 addition
  captionEncoded: string;     // base64url, may be ""
  ext: string;                // "jpg" | "jpeg" | "png" | "webp"
}
```

---

## 3. QualityMeta

Computed by `computeQuality()` using `sharp` and `face-api`.

```ts
interface QualityMeta {
  width: number;               // px
  height: number;              // px
  sharpness_score: number;     // 0-100, higher = sharper (avg channel stdev × 1.5)
  brightness_score: number;    // 0-100, distance from mid-grey (50) inverted
  file_size_kb: number;
  face_count?: number;         // v4.2: number of detected faces (Moe et al.)
  variants?: {                 // v4.2: multiple crops for featured images
    name: string;              // e.g. "featured-hero.jpg"
    path: string;              // web-absolute path
    strategy: string;          // "face-anchored" | "center" | "smart-crop"
  }[];
}
```

---

## 4. SemanticMeta

Computed by `classifyImage()` (tesseract.js OCR + heuristic rules).

```ts
type ImageType =
  | 'food' | 'drink' | 'menu' | 'price' | 'exterior' | 'interior'
  | 'merch' | 'people' | 'signage' | 'other';

interface SemanticMeta {
  image_type: ImageType;
  ocr_text_preview: string;    // first 200 chars of recognised text
  ocr_confidence: number;      // 0-1
  has_price: boolean;          // OCR detected ¥ symbol or price-like pattern
  has_japanese: boolean;       // OCR detected Japanese characters
  matched_section: {           // H2 this image was placed after
    h2_title: string;
    h2_index: number;          // 1-indexed
    score: number;             // cosine similarity 0-1
    reason: string;            // "ocr-keyword-match" | "explicit-hint" | etc.
  } | null;
}
```

---

## 5. LibraryEntryV42

One record per image in `data/image-library.json`. This is the canonical library index.

```ts
interface LibraryEntryV42 {
  id: string;                  // "img_<timestamp>_<shorthash>"
  path: string;                // web-absolute, e.g. "/images/library/20260411_143022.jpg"
  source: 'ios-shortcut' | 'video-extract' | 'cowork' | 'manual';
  source_detail: {
    original_filename: string;
    video_id: string | null;   // populated for video-extracted frames
    frame_time_sec: number | null;
  };
  uploaded_at: string;         // ISO 8601 UTC
  mode: Mode;
  quality: QualityMeta;
  semantic: SemanticMeta | null;
  user_meta: {
    caption: string;           // decoded UTF-8
    slug_hint: string | null;
    position_hint: string;     // serialised PositionHint + SizeHint
  };
  usage: {
    articles: string[];        // slugs where this image appears
    inserted_at: string | null;
    position_applied: string | null;
    replaced_image: string | null;
  };
  status: 'indexed' | 'failed' | 'staging';
}
```

### 5.1 Top-level file structure

```ts
interface LibraryIndex {
  schema_version: string;      // "4.2"
  description: string;
  entries: LibraryEntryV42[];
}
```

### 5.2 Backwards compatibility

Old v4.0/v4.1 entries without `face_count` or `variants` are forward-compatible — the fields are optional. When the v4.2 script re-processes an old entry, it adds the missing fields in place.

---

## 6. Frontmatter additions (v4.2)

Articles can now specify two additional image fields in frontmatter. Both are optional and fall back to `featuredImage` when absent.

```yaml
featuredImage: /images/articles/slug/hero.jpg
imageList: /images/articles/slug/featured-list.jpg   # 800×450 for card thumbnails
imageOg: /images/articles/slug/featured-og.jpg       # 1200×630 for OG/Twitter meta
```

Read by `lib/articles.ts` and used by:
- `components/ArticleCard.tsx` (`article.imageList || article.featuredImage`)
- `app/articles/[slug]/page.tsx` `generateMetadata` (`article.imageOg || article.featuredImage`)

The v4.2 pipeline auto-populates these fields when processing `__featured` images by generating the 3 face-aware variants.

---

## 7. Decision precedence

When the pipeline processes an inbox image, it decides placement in this order:

1. **Explicit position hint** (`body-top`, `featured`, etc.) → skip semantic, use hint directly
2. **Caption tag hint** (`#price`, `#food`, `#merch` in the caption) → use as `image_type`
3. **OCR-derived `image_type`** → match to article sections via `matchSection()`
4. **Quality fallback** → replace-worst if new image scores higher than existing worst

---

## 8. Cost model

| Stage | Tool | Per image |
|---|---|---|
| Sharp metadata + stats | sharp | ~50ms, $0 |
| OCR | tesseract.js (WASM) | ~1.5s, $0 |
| Face detection | face-api.js | ~2s, $0 |
| Sharp variant generation (featured×3) | sharp | ~3s, $0 |
| Frontmatter read/write | gray-matter | ~10ms, $0 |
| **Total per image** | — | **~7s, ¥0** |

For videos: add ~0.5s per second of video duration for ffmpeg keyframe extraction.

---

## 9. Failure modes

| Error | Cause | Recovery |
|---|---|---|
| `MODULE_NOT_FOUND scripts__semantic-placement` | Old import path | Use `./scripts__semantic-placement` (already fixed 2026-04-11) |
| `Model files not found` | `data/face-models/` missing | Commit the models directory (excluded from ESLint/tsc) |
| `gray-matter parse error` | Article frontmatter corrupted | Skip the article, continue processing other images |
| `sharp.toBuffer() rejected` | Corrupt JPEG header | Move to `_failed/`, mark entry `status: 'failed'` |
| `face-api TinyFaceDetector not loaded` | Network issue at CI startup | Retry step once; face_count falls back to 0 |

---

## 10. Extension points

To add a new image source (e.g. Drive webhook):

1. Add to `LibraryEntryV42['source']` union type
2. Populate `source_detail` (define sub-fields as needed)
3. Ensure files land in `public/images/inbox/` with a v4.2-compliant filename
4. The main pipeline handles everything else

To add a new position hint (e.g. `sidebar`):

1. Add to `PositionHint` union type
2. Extend `parseFilenameV4` regex
3. Add a handler branch in the main placement loop
4. Update this SCHEMA doc

To add a new caption tag (e.g. `#seasonal`):

1. Extend `classifyImage()` to detect the tag
2. Map to an `ImageType` (or add a new one)
3. Update §7 decision precedence if behaviour changes
