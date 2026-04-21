#!/usr/bin/env python3
"""
convert_inbox_heic.py
=====================

Auto-convert HEIC-as-JPG files in the Japan Pop Now inbox to WebP.

Context
-------
iOS Shortcut v5 uploads iPhone photos with a `.jpg` extension but leaves
the payload as HEIF (ftypheic/ftypheix/ftypmif1/ftypmsf1/ftyphevc). These
files do not render in browsers / Next.js and crash PIL without the
pillow-heif plugin. Upstream fix (patching the iOS Shortcut) is pending,
so we detect-and-convert on our side to eliminate the manual step.

Behavior
--------
1. Walk the inbox directory for `.jpg` / `.jpeg` / `.heic` / `.heif` files.
2. Read the first 12 bytes. If it is a HEIF container (`ftyp` box with
   one of the known brands) → classify as HEIC.
3. If HEIC → convert to WebP q92 (EXIF-rotation applied), write alongside
   the original with a `.webp` suffix, move the original into
   `inbox/_heic_original/` (never deleted per feedback_no_file_delete).
4. If a real JPEG → leave it untouched.
5. Emit a manifest JSON with per-file status + `license_source`.

Usage
-----
    python3 scripts/convert_inbox_heic.py \
        --inbox "/path/to/K10_Japan Pop Now/images_sync/inbox" \
        [--dry-run]

Exits 0 on success (including zero files), 1 only on unrecoverable error.
"""
from __future__ import annotations

import argparse
import datetime as _dt
import json
import shutil
import sys
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import List, Optional

from PIL import Image, ImageOps
from pillow_heif import register_heif_opener

register_heif_opener()

SCAN_EXTS = {".jpg", ".jpeg", ".heic", ".heif"}
HEIF_BRANDS = {b"heic", b"heix", b"mif1", b"msf1", b"hevc", b"heim", b"heis", b"hevx"}
LICENSE_SOURCE = "takapon_iphone"
DEFAULT_QUALITY = 92


@dataclass
class FileResult:
    filename: str
    action: str  # "converted" | "kept_jpeg" | "skipped_unreadable" | "error"
    is_heif: bool = False
    bytes_in: int = 0
    bytes_out: int = 0
    width: int = 0
    height: int = 0
    webp_path: Optional[str] = None
    heic_original_path: Optional[str] = None
    error: Optional[str] = None
    license_source: str = LICENSE_SOURCE


@dataclass
class RunManifest:
    generated_at: str
    inbox: str
    dry_run: bool
    summary: dict = field(default_factory=dict)
    files: List[FileResult] = field(default_factory=list)


def detect_heif(path: Path) -> bool:
    """Return True if file header indicates an ISO-BMFF HEIF container."""
    try:
        with path.open("rb") as f:
            head = f.read(32)
    except OSError:
        return False
    if len(head) < 12:
        return False
    # ISO-BMFF: [4 bytes size][4 bytes 'ftyp'][4 bytes brand]
    if head[4:8] != b"ftyp":
        return False
    brand = head[8:12]
    return brand in HEIF_BRANDS


def convert_one(src: Path, dry_run: bool, quality: int) -> FileResult:
    bytes_in = src.stat().st_size
    is_heif = detect_heif(src)

    if not is_heif:
        return FileResult(
            filename=src.name,
            action="kept_jpeg",
            is_heif=False,
            bytes_in=bytes_in,
        )

    # Build output path: same stem, .webp
    dest = src.with_suffix(".webp")
    original_dir = src.parent / "_heic_original"
    heic_dest = original_dir / src.name

    if dry_run:
        return FileResult(
            filename=src.name,
            action="converted",
            is_heif=True,
            bytes_in=bytes_in,
            webp_path=str(dest),
            heic_original_path=str(heic_dest),
        )

    try:
        with Image.open(src) as im:
            im = ImageOps.exif_transpose(im)
            if im.mode not in ("RGB", "RGBA"):
                im = im.convert("RGB")
            width, height = im.size
            # Overwrite-safe: delete existing .webp first (produced by a previous run).
            # If unlink is not permitted (e.g. a 0-byte leftover from an aborted run
            # on a restrictive filesystem), fall back to writing to a sibling and
            # atomically renaming.
            final_dest = dest
            write_target = dest
            if dest.exists():
                try:
                    dest.unlink()
                except PermissionError:
                    write_target = dest.with_name(dest.stem + "__new.webp")
            im.save(
                write_target,
                format="WEBP",
                quality=quality,
                method=6,
            )
            if write_target != final_dest:
                # Try a replace; if that still fails, leave the __new file and
                # surface the path through the manifest.
                try:
                    write_target.replace(final_dest)
                except PermissionError:
                    final_dest = write_target
            dest = final_dest
        bytes_out = dest.stat().st_size

        # Move original into the retention folder. Per feedback_no_file_delete
        # we never delete the HEIC; we relocate or rename it.
        #
        # Some environments (restricted sandboxes) refuse to create new
        # subdirectories inside the inbox. When that happens we fall back to
        # renaming the original in place with a `_heic_original__` prefix so
        # it no longer competes for the `.jpg` extension but is still on disk.
        try:
            original_dir.mkdir(parents=True, exist_ok=True)
            if not original_dir.is_dir():
                raise OSError("mkdir silently failed (dir does not exist after call)")
            if heic_dest.exists():
                stamp = _dt.datetime.now().strftime("%Y%m%d_%H%M%S")
                heic_dest = heic_dest.with_name(f"{heic_dest.stem}__{stamp}{heic_dest.suffix}")
            shutil.move(str(src), str(heic_dest))
        except (OSError, PermissionError):
            fallback = src.with_name(f"_heic_original__{src.name}")
            if fallback.exists():
                stamp = _dt.datetime.now().strftime("%Y%m%d_%H%M%S")
                fallback = fallback.with_name(f"_heic_original__{src.stem}__{stamp}{src.suffix}")
            shutil.move(str(src), str(fallback))
            heic_dest = fallback

        return FileResult(
            filename=src.name,
            action="converted",
            is_heif=True,
            bytes_in=bytes_in,
            bytes_out=bytes_out,
            width=width,
            height=height,
            webp_path=str(dest),
            heic_original_path=str(heic_dest),
        )
    except Exception as exc:  # noqa: BLE001 — we want to log anything
        return FileResult(
            filename=src.name,
            action="error",
            is_heif=True,
            bytes_in=bytes_in,
            error=f"{type(exc).__name__}: {exc}",
        )


def scan(inbox: Path) -> List[Path]:
    if not inbox.is_dir():
        raise SystemExit(f"inbox not found: {inbox}")
    out: List[Path] = []
    for p in sorted(inbox.iterdir()):
        if not p.is_file():
            continue
        if p.suffix.lower() in SCAN_EXTS:
            out.append(p)
    return out


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--inbox", required=True, help="Path to the inbox directory")
    parser.add_argument("--dry-run", action="store_true", help="Detect and report only; do not convert or move")
    parser.add_argument("--quality", type=int, default=DEFAULT_QUALITY, help="WebP quality (default 92)")
    parser.add_argument("--manifest-dir", default=None, help="Where to drop the run manifest (defaults to inbox/)")
    args = parser.parse_args(argv)

    inbox = Path(args.inbox).resolve()
    manifest_dir = Path(args.manifest_dir).resolve() if args.manifest_dir else inbox

    files = scan(inbox)
    manifest = RunManifest(
        generated_at=_dt.datetime.now().isoformat(timespec="seconds"),
        inbox=str(inbox),
        dry_run=args.dry_run,
    )

    counts = {"converted": 0, "kept_jpeg": 0, "error": 0, "skipped_unreadable": 0}
    bytes_in_total = 0
    bytes_out_total = 0

    for src in files:
        result = convert_one(src, dry_run=args.dry_run, quality=args.quality)
        manifest.files.append(result)
        counts[result.action] = counts.get(result.action, 0) + 1
        bytes_in_total += result.bytes_in
        bytes_out_total += result.bytes_out
        tag = result.action.upper()
        print(f"[{tag:9s}] {result.filename}"
              + (f" -> {Path(result.webp_path).name}" if result.webp_path else "")
              + (f"  err={result.error}" if result.error else ""))

    manifest.summary = {
        "total_files": len(files),
        "converted_heic_to_webp": counts["converted"],
        "kept_real_jpeg": counts["kept_jpeg"],
        "errors": counts["error"],
        "bytes_in": bytes_in_total,
        "bytes_out": bytes_out_total,
        "license_source": LICENSE_SOURCE,
    }

    manifest_dir.mkdir(parents=True, exist_ok=True)
    stamp = _dt.datetime.now().strftime("%Y%m%d_%H%M%S")
    manifest_path = manifest_dir / f"_manifest_{stamp}.json"
    manifest_path.write_text(
        json.dumps(
            {
                "generated_at": manifest.generated_at,
                "inbox": manifest.inbox,
                "dry_run": manifest.dry_run,
                "summary": manifest.summary,
                "files": [asdict(f) for f in manifest.files],
            },
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )

    print("")
    print(f"manifest: {manifest_path}")
    print(f"summary : {manifest.summary}")

    return 0 if counts["error"] == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
