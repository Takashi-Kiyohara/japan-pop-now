# Face descriptor database

Per-person face recognition databases used by the v4.3 video pipeline to
filter keyframes down to those that contain a specific person (e.g. Moe).

## Directory layout

```
data/face-db/
├── README.md              ← this file
├── .gitkeep
├── moe/                   ← reference photos (commit these)
│   ├── ref01.jpg
│   ├── ref02.jpg
│   └── ...
└── moe.json               ← generated descriptor DB (commit this)
```

## How it works

1. You commit 5–10 clear reference photos of Moe into `data/face-db/moe/`.
2. You run:
   ```bash
   npx tsx image-pipeline/v4/scripts__build-face-db.ts moe
   ```
   This produces `data/face-db/moe.json` — a JSON file containing one or more
   128-dimensional face descriptors, one per successfully detected reference.
3. Commit the `moe.json` file so GitHub Actions can use it.
4. From now on, whenever you upload a video with the `__moe` suffix in its
   filename (e.g. `IMG_20260411_153012__library__video__f10__moe.mp4`), the
   video-extraction step tags every extracted frame with a `.filter` sidecar
   pointing at `moe`. The main pipeline runs `filterFramesByPerson` against
   `moe.json` (euclidean distance < 0.5) and deletes frames where Moe is not
   detected **before** any cropping, variant generation, or library indexing
   happens.

## Reference photo guidelines

- **5–10 photos** is the sweet spot. Fewer than 3 is risky; more than 15
  hurts CI runtime and gives diminishing returns.
- Each photo should contain **exactly one clearly visible face** of the
  target person. Multiple faces per reference are allowed but only the
  highest-confidence face is used.
- Vary: angle (front, 3/4, slight profile), lighting (indoor, outdoor),
  expression (neutral, smiling), hair style (with/without bangs).
- Avoid: sunglasses, masks, heavy filters, blurry/out-of-focus, tiny faces.
- Resolution: 400×400 or larger recommended.

## Rebuild / update

Anytime you add, remove, or replace reference photos:

```bash
npx tsx image-pipeline/v4/scripts__build-face-db.ts moe
git add data/face-db/moe data/face-db/moe.json
git commit -m "[face-db] update moe references"
```

Or rebuild every person in `data/face-db/`:

```bash
npx tsx image-pipeline/v4/scripts__build-face-db.ts
```

## Adding a new person

1. Create a new directory: `data/face-db/<name>/`
2. Drop 5–10 reference photos
3. Run `npx tsx image-pipeline/v4/scripts__build-face-db.ts <name>`
4. Upload videos with `__<name>` suffix (e.g. `__takapon`, `__ryota`)

No code changes required — the video-extraction step passes the suffix
through as-is to `applyFaceFilters()` in
`scripts__process-image-inbox_v4_2.ts`.

## Threshold

Euclidean distance over 128-dimensional face embeddings. Defaults:

| Distance  | Meaning                                         |
| --------- | ----------------------------------------------- |
| `< 0.4`   | Very confident match                            |
| `0.4–0.5` | Likely match (we accept these)                  |
| `0.5–0.6` | Uncertain — face-api default but we reject      |
| `≥ 0.6`   | Almost certainly a different person             |

The stricter 0.5 threshold is used because failed frames just get dropped
(no harm done) while false positives pollute auto-published articles.

## Privacy

`data/face-db/` is part of the repo, so **do not put reference photos of
people who have not consented**. For JPN specifically:

- Moe (team member): consent given
- Takapon: self
- Third-party subjects: do **not** build a face DB — use the `__moe`
  flow manually only for known team members.

## Requirements

Models must already be downloaded to `data/face-models/`:

- `ssd_mobilenetv1_model-*`
- `face_landmark_68_model-*`
- `face_recognition_model-*`

See the main image-pipeline README for the one-time model download step.
