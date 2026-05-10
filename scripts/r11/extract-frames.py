#!/usr/bin/env python3
"""R11 Phase 0.2 — scene-detect frame extraction via ffmpeg.

Usage:
    python scripts/r11/extract-frames.py <bucket-folder>
    python scripts/r11/extract-frames.py jojo-stone-ocean
    python scripts/r11/extract-frames.py --all

Per video: ffmpeg -i {video} -vf "select='gt(scene,0.3)',scale=1920:-1" -vsync vfr -q:v 2 raw-NNN.jpg
Output: tmp/r11-frames/{bucket}/{video-stem}/raw-NNN.jpg
"""
import os
import sys
import subprocess
import json
from pathlib import Path

FFMPEG = r"C:\Users\user\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffmpeg.exe"
FFPROBE = r"C:\Users\user\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffprobe.exe"
VIDEO_ROOT = Path(r"C:\Users\user\AppData\Roaming\Claude\local-agent-mode-sessions\81a6584f-f9f9-4cd5-8165-0219103249ff\1743c627-79a8-41c7-b358-bf3fa1724bdc\local_aeb02443-9532-40c2-9cd0-aec0b435df27\uploads\r11-videos")
REPO_ROOT = Path(r"C:\Users\user\OneDrive\ドキュメント\GitHub\japan-pop-now")
OUT_ROOT = REPO_ROOT / "tmp" / "r11-frames"

ALL_BUCKETS = [
    "akiba-arcade", "akiba-night", "animate-shinjuku", "dbz-marugame",
    "harry-potter", "jaag", "jojo-stone-ocean", "kiddyland",
    "parco-6f-hub", "peanuts-cafe", "tamagotchi-harakado",
]


def probe(video: Path) -> dict:
    cmd = [FFPROBE, "-v", "error", "-print_format", "json", "-show_format", "-show_streams", str(video)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        return {"error": r.stderr.strip()}
    d = json.loads(r.stdout)
    fmt = d.get("format", {})
    streams = d.get("streams", [])
    v_stream = next((s for s in streams if s.get("codec_type") == "video"), {})
    return {
        "duration": float(fmt.get("duration", 0)),
        "size_mb": int(fmt.get("size", 0)) // (1024 * 1024),
        "codec": v_stream.get("codec_name", ""),
        "width": v_stream.get("width", 0),
        "height": v_stream.get("height", 0),
        "bit_rate": int(fmt.get("bit_rate", 0)),
    }


def extract_video(video: Path, out_dir: Path, duration: float = 0.0) -> int:
    """Extract frames at adaptive fps. Targets ~10-30 frames per video.
    For short clips (<15s): higher fps to get a few frames; for long: lower fps."""
    out_dir.mkdir(parents=True, exist_ok=True)
    pattern = str(out_dir / "raw-%03d.jpg")
    if duration <= 0:
        target_fps = 0.5  # 1 frame per 2s default
    else:
        # target 10-30 frames per video
        target_frames = min(30, max(5, int(duration / 5)))
        target_fps = target_frames / max(duration, 1.0)
    cmd = [
        FFMPEG, "-y", "-i", str(video),
        "-vf", f"fps={target_fps:.4f},scale=1920:-1",
        "-q:v", "2",
        pattern,
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.stderr.write(f"  FAIL: {video.name}: {r.stderr[-300:]}\n")
        return 0
    frames = sorted(out_dir.glob("raw-*.jpg"))
    return len(frames)


def process_bucket(bucket: str) -> dict:
    bucket_in = VIDEO_ROOT / bucket
    bucket_out = OUT_ROOT / bucket
    if not bucket_in.exists():
        return {"bucket": bucket, "error": f"no folder at {bucket_in}"}
    videos = sorted([p for p in bucket_in.iterdir() if p.suffix.lower() in (".mp4", ".mov")])
    print(f"[{bucket}] {len(videos)} videos")
    summary = {"bucket": bucket, "videos": []}
    total_frames = 0
    for v in videos:
        meta = probe(v)
        out_dir = bucket_out / v.stem
        n = extract_video(v, out_dir, duration=meta.get("duration", 0))
        total_frames += n
        summary["videos"].append({
            "name": v.name,
            "duration": meta.get("duration", 0),
            "resolution": f"{meta.get('width', 0)}x{meta.get('height', 0)}",
            "codec": meta.get("codec", ""),
            "size_mb": meta.get("size_mb", 0),
            "frames_extracted": n,
        })
        print(f"  {v.name}: {meta.get('duration',0):.1f}s {meta.get('width',0)}x{meta.get('height',0)} -> {n} frames")
    summary["total_frames"] = total_frames
    summary_file = bucket_out / "_metadata.json"
    bucket_out.mkdir(parents=True, exist_ok=True)
    summary_file.write_text(json.dumps(summary, indent=2))
    return summary


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    target = sys.argv[1]
    OUT_ROOT.mkdir(parents=True, exist_ok=True)
    if target == "--all":
        results = [process_bucket(b) for b in ALL_BUCKETS]
    else:
        results = [process_bucket(target)]
    print(json.dumps({"summary": [{"bucket": r["bucket"], "frames": r.get("total_frames", 0), "videos": len(r.get("videos", []))} for r in results]}, indent=2))


if __name__ == "__main__":
    main()
