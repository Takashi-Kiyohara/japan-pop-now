#!/usr/bin/env python3
"""R11 Phase 0.4 — OpenCV Haar face detection on extracted frames.

Usage:
    python scripts/r11/face-detect.py <bucket-folder>
    python scripts/r11/face-detect.py --all

Reads tmp/r11-frames/{bucket}/*/raw-NNN.jpg, writes _faces.json sidecar
per video folder with detected face boxes (for face-aware crop in Phase 0.3).

Per spec fallback: no trained Moe classifier in repo, so OpenCV Haar is used
without Moe-confidence filtering. All detected faces are reported; downstream
crop logic uses largest detected face for centering.
"""
import sys
import json
from pathlib import Path
import cv2

REPO_ROOT = Path(r"C:\Users\user\OneDrive\ドキュメント\GitHub\japan-pop-now")
FRAMES_ROOT = REPO_ROOT / "tmp" / "r11-frames"
HAAR_FRONTAL = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
HAAR_PROFILE = cv2.data.haarcascades + "haarcascade_profileface.xml"

ALL_BUCKETS = [
    "akiba-arcade", "akiba-night", "animate-shinjuku", "dbz-marugame",
    "harry-potter", "jaag", "jojo-stone-ocean", "kiddyland",
    "parco-6f-hub", "peanuts-cafe", "tamagotchi-harakado",
]


def detect_frame(img_path: Path, frontal_cascade, profile_cascade) -> list:
    img = cv2.imread(str(img_path))
    if img is None:
        return []
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    h, w = gray.shape
    faces = []
    for cascade, kind in ((frontal_cascade, "frontal"), (profile_cascade, "profile")):
        rects = cascade.detectMultiScale(gray, scaleFactor=1.15, minNeighbors=5, minSize=(int(min(w, h) * 0.05),) * 2)
        for x, y, fw, fh in rects:
            faces.append({"x": int(x), "y": int(y), "w": int(fw), "h": int(fh), "kind": kind})
    largest = max(faces, key=lambda f: f["w"] * f["h"]) if faces else None
    return {"frame_w": w, "frame_h": h, "faces": faces, "largest": largest, "face_count": len(faces)}


def process_bucket(bucket: str, frontal_cascade, profile_cascade) -> dict:
    bucket_dir = FRAMES_ROOT / bucket
    if not bucket_dir.exists():
        return {"bucket": bucket, "error": f"no frames at {bucket_dir}"}
    video_dirs = [p for p in bucket_dir.iterdir() if p.is_dir()]
    print(f"[{bucket}] {len(video_dirs)} video folders")
    summary = {"bucket": bucket, "videos": []}
    grand_face_total = 0
    for vd in video_dirs:
        frames = sorted(vd.glob("raw-*.jpg"))
        per_video = {"video": vd.name, "frames": []}
        face_total = 0
        for f in frames:
            result = detect_frame(f, frontal_cascade, profile_cascade)
            if not result:
                continue
            per_video["frames"].append({
                "frame": f.name,
                "face_count": result["face_count"],
                "largest": result["largest"],
            })
            face_total += result["face_count"]
        per_video["face_total"] = face_total
        summary["videos"].append(per_video)
        grand_face_total += face_total
        sidecar = vd / "_faces.json"
        sidecar.write_text(json.dumps(per_video, indent=2))
        print(f"  {vd.name}: {len(frames)} frames, {face_total} faces")
    summary["grand_face_total"] = grand_face_total
    out = FRAMES_ROOT / bucket / "_faces_summary.json"
    out.write_text(json.dumps(summary, indent=2))
    return summary


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    target = sys.argv[1]
    frontal_cascade = cv2.CascadeClassifier(HAAR_FRONTAL)
    profile_cascade = cv2.CascadeClassifier(HAAR_PROFILE)
    if frontal_cascade.empty() or profile_cascade.empty():
        sys.stderr.write("Failed to load Haar cascades\n")
        sys.exit(1)
    if target == "--all":
        results = [process_bucket(b, frontal_cascade, profile_cascade) for b in ALL_BUCKETS]
    else:
        results = [process_bucket(target, frontal_cascade, profile_cascade)]
    print(json.dumps({"summary": [{"bucket": r["bucket"], "faces": r.get("grand_face_total", 0)} for r in results]}, indent=2))


if __name__ == "__main__":
    main()
