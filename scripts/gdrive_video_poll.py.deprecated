#!/usr/bin/env python3
"""
Google Drive video poller (Option B of the JPN image pipeline).

Polls a shared GDrive folder for .mp4/.mov/.m4v/.avi files, downloads them to
public/images/inbox/ using the v4.3 filename contract, and optionally moves
the original file into a processed folder so it isn't re-downloaded next run.

Filename contract on GDrive:
    Upload videos named like:
      IMG_<yyyyMMdd_HHmmss>__library__video[__f<N>|__fauto][__moe].mp4
      IMG_<yyyyMMdd_HHmmss>__existing__<slug>__<position>__video[__f<N>|__fauto][__moe].mp4

    If the filename does not match this contract (e.g. plain IMG_1234.mp4 from
    iPhone), the poller prepends `IMG_<now>__library__video__fauto__` with the
    original basename preserved for traceability:
      IMG_20260411_153012__library__video__fauto__IMG_1234.mp4

Environment variables (set in workflow):
    GDRIVE_FOLDER_ID            — source folder id
    GDRIVE_PROCESSED_FOLDER_ID  — (optional) move-to folder id
    GDRIVE_SA_KEY_PATH          — path to service account JSON
    GDRIVE_INBOX_PATH           — local inbox dir (default public/images/inbox)

Outputs to GITHUB_OUTPUT:
    downloaded=true|false
    count=<N>
"""
from __future__ import annotations

import io
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

SCOPES = ["https://www.googleapis.com/auth/drive"]
VIDEO_MIMES = {
    "video/mp4",
    "video/quicktime",
    "video/x-m4v",
    "video/x-msvideo",
}
VIDEO_EXTS = {".mp4", ".mov", ".m4v", ".avi"}

CONTRACT_RE = re.compile(
    r"^IMG_\d{8}_\d{6}__(?:library|existing__[^_]+__[a-z0-9-]+(?:--[a-z]+)?)__video(?:__f(?:\d+|auto))?(?:__moe)?\.(?:mp4|mov|m4v|avi)$",
    re.IGNORECASE,
)


def log(msg: str) -> None:
    print(msg, flush=True)


def normalize_name(original: str) -> str:
    """Return a v4.3-compliant filename.

    If the original already matches the contract, return it untouched.
    Otherwise wrap it into IMG_<now>__library__video__fauto__<original>.
    """
    if CONTRACT_RE.match(original):
        return original
    ts = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    # Strip unsafe chars but keep the readable part of the original
    safe = re.sub(r"[^A-Za-z0-9._-]+", "_", original)
    stem, _, ext = safe.rpartition(".")
    if not stem:
        stem, ext = safe, "mp4"
    return f"IMG_{ts}__library__video__fauto__{stem}.{ext.lower()}"


def main() -> int:
    folder_id = os.environ.get("GDRIVE_FOLDER_ID")
    processed_id = os.environ.get("GDRIVE_PROCESSED_FOLDER_ID") or None
    key_path = os.environ.get("GDRIVE_SA_KEY_PATH", ".secrets/gdrive-sa.json")
    inbox_path = Path(os.environ.get("GDRIVE_INBOX_PATH", "public/images/inbox"))
    github_output = os.environ.get("GITHUB_OUTPUT")

    if not folder_id:
        log("ERROR: GDRIVE_FOLDER_ID not set")
        return 1
    if not Path(key_path).is_file():
        log(f"ERROR: service account key not found at {key_path}")
        return 1

    inbox_path.mkdir(parents=True, exist_ok=True)

    creds = service_account.Credentials.from_service_account_file(
        key_path, scopes=SCOPES
    )
    service = build("drive", "v3", credentials=creds, cache_discovery=False)

    # List non-trashed video files directly in the folder
    query = (
        f"'{folder_id}' in parents and trashed = false and ("
        + " or ".join(f"mimeType = '{m}'" for m in VIDEO_MIMES)
        + ")"
    )
    resp = (
        service.files()
        .list(
            q=query,
            fields="files(id, name, mimeType, size, createdTime)",
            pageSize=100,
            orderBy="createdTime",
        )
        .execute()
    )
    files = resp.get("files", [])

    if not files:
        log("No new videos.")
        if github_output:
            with open(github_output, "a", encoding="utf-8") as f:
                f.write("downloaded=false\ncount=0\n")
        return 0

    log(f"Found {len(files)} video(s) in folder {folder_id}")
    downloaded = 0

    for f in files:
        name = f["name"]
        file_id = f["id"]
        ext = Path(name).suffix.lower()
        if ext not in VIDEO_EXTS:
            log(f"  skip (ext): {name}")
            continue

        target_name = normalize_name(name)
        target_path = inbox_path / target_name

        if target_path.exists():
            log(f"  skip (already in inbox): {target_name}")
            continue

        log(f"  ↓ downloading {name} → {target_name}")
        try:
            request = service.files().get_media(fileId=file_id)
            buf = io.FileIO(target_path, "wb")
            downloader = MediaIoBaseDownload(buf, request)
            done = False
            while not done:
                _, done = downloader.next_chunk()
            buf.close()
            downloaded += 1
        except Exception as e:  # noqa: BLE001
            log(f"  ✗ download failed: {e}")
            if target_path.exists():
                target_path.unlink()
            continue

        # Move the source file into the processed folder if configured,
        # otherwise trash it so we don't re-download next run.
        try:
            if processed_id:
                service.files().update(
                    fileId=file_id,
                    addParents=processed_id,
                    removeParents=folder_id,
                    fields="id, parents",
                ).execute()
            else:
                service.files().update(
                    fileId=file_id, body={"trashed": True}
                ).execute()
        except Exception as e:  # noqa: BLE001
            log(f"  ⚠ source move/trash failed (kept downloaded copy): {e}")

    log(f"Downloaded {downloaded}/{len(files)}")

    if github_output:
        with open(github_output, "a", encoding="utf-8") as f:
            f.write(f"downloaded={'true' if downloaded > 0 else 'false'}\n")
            f.write(f"count={downloaded}\n")

    return 0


if __name__ == "__main__":
    sys.exit(main())
