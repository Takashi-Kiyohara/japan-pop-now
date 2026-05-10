#!/usr/bin/env python3
"""R11 Phase 0.3 — generate 8 WebP variants from a curated frame.

Usage:
    python scripts/r11/generate-variants.py <input-frame> <slug> <out-name>
    python scripts/r11/generate-variants.py tmp/r11-frames/jojo-stone-ocean/IMG_1234/raw-005.jpg \\
        jojo-stone-ocean-cafe-jojo-world-2026 hero

Reads input JPG, generates 8 WebP variants at spec resolutions with
face-aware crop (uses _faces.json sidecar in same dir as input if present).

Variants:
  hero        1200x720   16:9.6
  body        1200x720   16:9.6
  portrait    1200x1500  4:5
  og          1200x630   1.91:1
  twitter     1200x675   16:9
  card         800x450   16:9
  schema-1x1  1200x1200  1:1
  schema-4x3  1200x900   4:3

Output path: public/images/articles/{slug}/{out-name}.webp
For body/portrait: public/images/articles/{slug}/{out-name}-N.webp pattern.
"""
import sys
import json
from pathlib import Path
from PIL import Image, ImageFilter

REPO_ROOT = Path(r"C:\Users\user\OneDrive\ドキュメント\GitHub\japan-pop-now")
PUBLIC_IMG = REPO_ROOT / "public" / "images" / "articles"

VARIANTS = {
    "hero":       (1200, 720),
    "body":       (1200, 720),
    "portrait":   (1200, 1500),
    "og":         (1200, 630),
    "twitter":    (1200, 675),
    "card":       (800, 450),
    "schema-1x1": (1200, 1200),
    "schema-4x3": (1200, 900),
}


def get_face_box(input_path: Path) -> dict | None:
    sidecar = input_path.parent / "_faces.json"
    if not sidecar.exists():
        return None
    try:
        data = json.loads(sidecar.read_text())
    except Exception:
        return None
    for fr in data.get("frames", []):
        if fr.get("frame") == input_path.name and fr.get("largest"):
            return fr["largest"]
    return None


def face_aware_crop(img: Image.Image, target_w: int, target_h: int, face_box: dict | None) -> Image.Image:
    """Crop image to target aspect, centering on face if face_box present, else center crop."""
    src_w, src_h = img.size
    target_ratio = target_w / target_h
    src_ratio = src_w / src_h

    if face_box:
        cx = face_box["x"] + face_box["w"] // 2
        cy = face_box["y"] + face_box["h"] // 2
    else:
        cx = src_w // 2
        cy = src_h // 2

    if src_ratio > target_ratio:
        # source is wider -> crop horizontally
        crop_w = int(src_h * target_ratio)
        crop_h = src_h
    else:
        # source is taller -> crop vertically
        crop_w = src_w
        crop_h = int(src_w / target_ratio)

    # clamp center so crop stays inside image
    cx = max(crop_w // 2, min(cx, src_w - crop_w // 2))
    cy = max(crop_h // 2, min(cy, src_h - crop_h // 2))

    left = cx - crop_w // 2
    top = cy - crop_h // 2
    right = left + crop_w
    bottom = top + crop_h

    cropped = img.crop((left, top, right, bottom))
    resized = cropped.resize((target_w, target_h), Image.LANCZOS)
    return resized.filter(ImageFilter.UnsharpMask(radius=1.0, percent=80, threshold=2))


def generate_variants(input_path: Path, slug: str, base_name: str, only: str | None = None) -> dict:
    img = Image.open(input_path).convert("RGB")
    face_box = get_face_box(input_path)
    out_dir = PUBLIC_IMG / slug
    out_dir.mkdir(parents=True, exist_ok=True)
    written = {}

    for variant_name, (w, h) in VARIANTS.items():
        if only and only != variant_name:
            continue
        cropped = face_aware_crop(img, w, h, face_box)
        if variant_name in ("hero", "og", "twitter", "card"):
            out_name = variant_name
        elif variant_name == "schema-1x1":
            out_name = "schema-1x1"
        elif variant_name == "schema-4x3":
            out_name = "schema-4x3"
        elif variant_name == "portrait":
            out_name = f"{base_name}-portrait"
        else:  # body
            out_name = base_name
        out_file = out_dir / f"{out_name}.webp"
        cropped.save(out_file, "WEBP", quality=92, method=6)
        written[variant_name] = str(out_file.relative_to(REPO_ROOT))
    return {"slug": slug, "input": str(input_path), "face_box": face_box, "written": written}


def main():
    if len(sys.argv) < 4:
        print(__doc__)
        sys.exit(1)
    input_path = Path(sys.argv[1])
    slug = sys.argv[2]
    base_name = sys.argv[3]
    only = sys.argv[4] if len(sys.argv) > 4 else None
    if not input_path.exists():
        sys.stderr.write(f"Input not found: {input_path}\n")
        sys.exit(1)
    result = generate_variants(input_path, slug, base_name, only=only)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
