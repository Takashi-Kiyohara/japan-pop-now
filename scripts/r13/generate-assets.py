#!/usr/bin/env python3
"""R13 Bucket A — generate logo.png + favicon variants + manifest icons + screenshots.

Brand colors (per .claude/rules/design-system.md):
  Navy   #14213d  primary surface
  Red    #e63946  accent
  Cream  #fafaf9  text on navy
  Orange #f97316  secondary accent

Outputs (all written to public/):
  logo.png                                        (1024x1024 master)
  favicon.ico                                     (multi-size 16/24/32/48)
  favicon-16x16.png / favicon-32x32.png
  apple-touch-icon.png                            (180x180)
  android-chrome-192x192.png / -512x512.png
  icon-192.png / icon-512.png                     (manifest any)
  icon-192-maskable.png / icon-512-maskable.png   (manifest maskable, 10% safe-zone)
  screenshot-540.png                              (540x720 portrait mockup)
  screenshot-1280.png                             (1280x720 landscape mockup)
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path

NAVY = (20, 33, 61)
RED = (230, 57, 70)
CREAM = (250, 250, 249)
ORANGE = (249, 115, 22)

OUT = Path(r"C:\Users\user\OneDrive\ドキュメント\GitHub\japan-pop-now\public")


def load_font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    candidates = [
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\Arial.ttf",
        r"C:\Windows\Fonts\seguibl.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()


def draw_logo(size: int, maskable_safe_zone: bool = False) -> Image.Image:
    """Master logo: navy square with cream JPN text + red bottom stripe."""
    img = Image.new("RGB", (size, size), NAVY)
    draw = ImageDraw.Draw(img)

    pad = int(size * 0.10) if maskable_safe_zone else int(size * 0.04)
    inner = size - pad * 2

    text = "JPN"
    font_size = int(inner * 0.50)
    font = load_font(font_size, bold=True)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx = (size - tw) // 2 - bbox[0]
    ty = (size - th) // 2 - bbox[1] - int(size * 0.04)
    draw.text((tx, ty), text, fill=CREAM, font=font)

    stripe_h = max(2, int(size * 0.04))
    stripe_y = int(size * 0.72)
    stripe_x0 = int(size * (0.28 if maskable_safe_zone else 0.20))
    stripe_x1 = size - stripe_x0
    draw.rectangle((stripe_x0, stripe_y, stripe_x1, stripe_y + stripe_h), fill=RED)

    sub = "POP NOW"
    sub_size = max(8, int(inner * 0.10))
    sub_font = load_font(sub_size, bold=False)
    sbbox = draw.textbbox((0, 0), sub, font=sub_font)
    sw, sh_ = sbbox[2] - sbbox[0], sbbox[3] - sbbox[1]
    sx = (size - sw) // 2 - sbbox[0]
    sy = stripe_y + stripe_h + max(4, int(size * 0.02))
    draw.text((sx, sy), sub, fill=ORANGE, font=sub_font)

    return img


def save_png(img: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG", optimize=True)


def save_ico(master: Image.Image, path: Path) -> None:
    sizes = [(16, 16), (24, 24), (32, 32), (48, 48), (64, 64)]
    master.save(path, format="ICO", sizes=sizes)


def draw_screenshot(width: int, height: int) -> Image.Image:
    """Brand-card screenshot showing what the homepage looks like at a high level."""
    img = Image.new("RGB", (width, height), CREAM)
    draw = ImageDraw.Draw(img)

    header_h = int(height * 0.10)
    draw.rectangle((0, 0, width, header_h), fill=NAVY)

    logo_size = int(header_h * 0.72)
    logo = draw_logo(logo_size).resize((logo_size, logo_size), Image.LANCZOS)
    img.paste(logo, (int(header_h * 0.30), (header_h - logo_size) // 2))

    nav_font = load_font(max(10, int(header_h * 0.32)), bold=False)
    nav_y = (header_h - nav_font.size) // 2
    nav_x = int(header_h * 0.30) + logo_size + int(header_h * 0.40)
    for label in ("Cafes", "Destinations", "Experiences"):
        draw.text((nav_x, nav_y), label, fill=CREAM, font=nav_font)
        nav_x += int(nav_font.size * len(label) * 0.65) + int(header_h * 0.30)

    hero_y0 = header_h + int(height * 0.04)
    hero_y1 = hero_y0 + int(height * 0.32)
    hero_x0 = int(width * 0.06)
    hero_x1 = width - hero_x0
    draw.rectangle((hero_x0, hero_y0, hero_x1, hero_y1), fill=(231, 229, 228))

    title_font = load_font(max(14, int(height * 0.045)), bold=True)
    draw.text(
        (hero_x0 + int(width * 0.03), hero_y0 + int(height * 0.04)),
        "Japan Pop Now",
        fill=NAVY,
        font=title_font,
    )

    body_font = load_font(max(10, int(height * 0.022)), bold=False)
    draw.text(
        (hero_x0 + int(width * 0.03), hero_y0 + int(height * 0.12)),
        "Anime collab cafes, pilgrimage spots,",
        fill=(68, 64, 60),
        font=body_font,
    )
    draw.text(
        (hero_x0 + int(width * 0.03), hero_y0 + int(height * 0.16)),
        "and travel tips for international visitors.",
        fill=(68, 64, 60),
        font=body_font,
    )

    cta_h = int(height * 0.06)
    cta_w = int(width * 0.30)
    cta_x = hero_x0 + int(width * 0.03)
    cta_y = hero_y0 + int(height * 0.22)
    draw.rectangle((cta_x, cta_y, cta_x + cta_w, cta_y + cta_h), fill=ORANGE)
    cta_font = load_font(max(10, int(height * 0.022)), bold=True)
    cta_bbox = draw.textbbox((0, 0), "Explore Articles", font=cta_font)
    cta_tw = cta_bbox[2] - cta_bbox[0]
    draw.text(
        (cta_x + (cta_w - cta_tw) // 2 - cta_bbox[0], cta_y + (cta_h - cta_font.size) // 2),
        "Explore Articles",
        fill=CREAM,
        font=cta_font,
    )

    grid_y0 = hero_y1 + int(height * 0.06)
    grid_cols = 2 if width < 800 else 3
    grid_h = int(height * 0.32)
    gap = int(width * 0.02)
    card_w = (width - hero_x0 * 2 - gap * (grid_cols - 1)) // grid_cols
    for i in range(grid_cols):
        cx = hero_x0 + i * (card_w + gap)
        draw.rectangle((cx, grid_y0, cx + card_w, grid_y0 + grid_h), fill=(255, 255, 255))
        draw.rectangle((cx, grid_y0, cx + card_w, grid_y0 + int(grid_h * 0.55)), fill=(231, 229, 228))
        card_title_font = load_font(max(10, int(height * 0.022)), bold=True)
        draw.text(
            (cx + int(card_w * 0.06), grid_y0 + int(grid_h * 0.60)),
            f"Featured article {i + 1}",
            fill=NAVY,
            font=card_title_font,
        )

    return img


def main():
    OUT.mkdir(parents=True, exist_ok=True)

    master = draw_logo(1024)
    save_png(master, OUT / "logo.png")

    for sz in (16, 32):
        save_png(master.resize((sz, sz), Image.LANCZOS), OUT / f"favicon-{sz}x{sz}.png")

    save_ico(master, OUT / "favicon.ico")

    save_png(master.resize((180, 180), Image.LANCZOS), OUT / "apple-touch-icon.png")

    for sz in (192, 512):
        resized = master.resize((sz, sz), Image.LANCZOS)
        save_png(resized, OUT / f"android-chrome-{sz}x{sz}.png")
        save_png(resized, OUT / f"icon-{sz}.png")

    for sz in (192, 512):
        maskable = draw_logo(sz, maskable_safe_zone=True)
        save_png(maskable, OUT / f"icon-{sz}-maskable.png")

    save_png(draw_screenshot(540, 720), OUT / "screenshot-540.png")
    save_png(draw_screenshot(1280, 720), OUT / "screenshot-1280.png")

    print("OK: generated")
    for p in sorted(OUT.glob("logo.png")):
        print(f"  {p.relative_to(OUT.parent)}")
    for pat in ("favicon*", "icon-*", "android-chrome-*", "apple-touch-icon*", "screenshot-*"):
        for p in sorted(OUT.glob(pat)):
            print(f"  {p.relative_to(OUT.parent)}")


if __name__ == "__main__":
    main()
