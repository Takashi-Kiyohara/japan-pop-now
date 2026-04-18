# Image Quality Gate — 3-Layer Defense

"画像入ってないエラーはもう一生起きない" を実現する仕組み。

## Layer 1: push.ps1 pre-push validation (local, immediate)

`pre_push_gate.ps1` を各 push script の直前で呼ぶ。

追加手順 (既存 push script に組み込む):

```powershell
# After: git add but BEFORE git commit
. (Join-Path $repoPath "scripts\pre_push_gate.ps1")
if (-not (Invoke-ImageGate -RepoPath $repoPath -ChangedOnly)) {
    Write-Host "Push blocked by image quality gate." -ForegroundColor Red
    exit 1
}
```

Python 3.11+ と Pillow が必要。missing なら skip (warning のみ)。

## Layer 2: GitHub Actions CI (remote, merge-blocking)

`.github/workflows/image-quality-gate.yml` を repo の `.github/workflows/` に配置。

- PR: 変更ファイルのみ scan
- push to main: 全 repo scan
- Fail 時 = merge block (branch protection rule で require)

Pillow インストール含めて 30 秒以内。

## Layer 3: morning-content workflow fail-fast

scheduled-task `jpn-morning-content` の prompt に以下を追加:

```
drafting完了後、push script生成の直前に必ず実行:
  python3 <repo>/scripts/image_quality_gate.py --article <slug>

exit code != 0 なら:
  - push script生成スキップ
  - STATUS_REPORT.md に "BLOCKED at image gate" + 詳細書き出し
  - SNS投稿スキップ
  - 翌日以降に再試行
```

これで Post-Publish Pipeline の Image Quality Gate まで辿り着かず、drafting段階で止まる。

## Deploy 手順 (Takashi 実行)

1. `scripts/image_quality_gate.py` を repo に配置
   ```powershell
   Copy-Item "<this folder>\image_quality_gate.py" "$repoPath\scripts\image_quality_gate.py"
   Copy-Item "<this folder>\pre_push_gate.ps1"     "$repoPath\scripts\pre_push_gate.ps1"
   ```

2. `.github/workflows/image-quality-gate.yml` を repo に配置
   ```powershell
   Copy-Item "<this folder>\.github\workflows\image-quality-gate.yml" `
             "$repoPath\.github\workflows\image-quality-gate.yml"
   ```

3. GitHub branch protection で "Image Quality Gate" を required check に追加

4. 全 push script に gate call を inject (既存 script 改修)

5. scheduled-task `jpn-morning-content` の prompt を更新 (Claude側で別途)

## 閾値 (環境変数でoverride可)

| 変数 | default | 意味 |
|---|---|---|
| MIN_BPP | 0.12 | 画質下限 (bits per pixel) |
| MIN_DENS | 2.5 | 密度下限 (images per 1000 words) |

## チェック項目

| ID | Type | 説明 | Layer |
|---|---|---|---|
| C1 | P0 | 画像 path が実ファイル存在 | all |
| C2 | P0 | placeholder/TODO/empty src なし | all |
| C3 | warn | bpp >= MIN_BPP | all |
| C4 | warn | 密度 >= MIN_DENS | all |
| C5 | warn | hero 重複なし (未実装、将来拡張) | CI |

P0 違反 = 必ず block。warn = `--strict` 指定時のみ block。
