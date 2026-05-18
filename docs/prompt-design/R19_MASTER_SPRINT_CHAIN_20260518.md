# R19 Master Sprint Chain (2026-05-18 起草)

**目的**: GSC indexed 1/170 → 50/88 達成までの 7 連続 stage を 1 chain として設計、user check-in 最小化、Cowork+Code 自走で 4-6 週間 sprint。

**baseline**: HEAD=`6e8c919` (R18 closure 後)
**target**: GSC indexed 50+/88 + AdSense 3rd reapply 通過

---

## ★ Status Board (live update、各 stage 進捗トラッキング)

| Stage | sprint | status | Code SHA | Cowork verify | KPI |
|---|---|---|---|---|---|
| S1 | W6-quick technical cleanup | 🚢 prompt ready | - | - | indexed +5-12 / redirect err 20→3 |
| S2 | W5 Draft 1 起草 (Cowork) | ⏳ pending | n/a | n/a | docs 完成 |
| S3 | W5 audit framework Code 投入 | ⏳ pending | - | - | 88 article score json 出力 |
| S4 | W5 削除 bucket 実行 | ⏳ pending | - | - | 40-55 article noindex/410/301 |
| S5 | W5 修正 bucket sprint 1-4 | ⏳ pending | - | - | 30-40 article IG block ≥3 retrofit |
| S6 | W2 R11 動画 frame + 記事化 | ⏳ pending | - | - | 9 新記事 + 2 upgrade + B-roll |
| S7 | W3 identity flip ship | ⏳ pending | - | - | Person+sameAs+LinkedIn live |

★ 各 stage 完了後 Cowork が status 更新、未達なら R+1 round critic 起動。

---

## ★ User check-in points (8 回、各 5-10 分)

1. **本書承認** (今、stage 着手前)
2. S1 完了後 = W6-quick push 後 (5/22-24 想定、5/25 GSC export 確認)
3. S2 完了後 = W5 Draft 1 起草完了 (Cowork single-handed 1-2 turn)
4. S3 完了後 = audit 結果 buckets 確定 (削除/修正/維持 list user 承認)
5. S4 完了後 = 削除 bucket 実行確認 (5/28-30、5/29 GSC export 観測)
6. S5 sprint 4 完了後 = 修正 bucket 全 retrofit 終了 (6/8-15 想定)
7. S6 完了後 = R11 動画 → 記事化 (6/15-22)
8. S7 完了後 = W3 ship、AdSense reapply 判定 (6/22-29、indexed 50+ 達成判定)

★ user 物理タスク (LinkedIn 写真 file + reciprocal link + 必要時 写真撮影追加) は stage と並行、緊急 block なし。

---

## ★ Stage 詳細

### S1: W6-quick technical cleanup (1-2h Code、5 分 Cowork verify)

**Prompt**: `docs/prompt-design/w6q-r2-draft2-SHIP-20260518.md` (ship 版完成済)

**Cowork prep** (S1 着手前、5 分):
1. user 承認 `本書 + W6-quick prompt` → Code 投入
2. HEAD baseline `6e8c919` 確認
3. `docs/intentional-redirects.json` 手動 review (user 物理 task、optional、Code が prompt 内で生成提案あり)

**Code 実行内容**:
- Phase 0: existing redirects whitelist diff
- Phase 1: GSC URL audit (Googlebot UA + production only)
- Phase 2: 4 group fix (chain / 404 / canonical / 自己 redirect) + 410 route.ts + sitemap-removed.xml
- Phase 3: 1 commit + push
- Phase 4: live verify 6 step
- Phase 5: 3 段階 GSC export 観測 plan

**Cowork verify (Code 完了報告後、5 分)**:
- production HTTP fetch 6 step を Cowork 側で独立再実行
- 結果が Code 報告と一致 confirmation
- 未一致なら R3 round 起動

**Cowork user check-in #2** (S1 完了報告):
> S1 W6-quick 完走、HEAD=<SHA>。redirect chain 20→<N>、404 →<N>、canonical mismatch →<N>。5/25 GSC export pull 後 indexed 数 update 予定。S2 着手判定 → user "OK" で進める。

---

### S2: W5 Draft 1 起草 (Cowork single-handed、1-2 turn、user check-in 1 回)

**Cowork 実行内容**:
- R1 research findings (`w5-r1-research-20260518.md`) を 7 軸 framework に展開
- R2 external Critic 起動 (6 項目 review)
- Draft 2 起草、R3 軽 critic、Draft 3 = ship 版

**docs 出力**:
- `docs/prompt-design/w5-r1-draft1-20260518.md` (Draft 1)
- `docs/prompt-design/w5-r2-critic-20260518.md`
- `docs/prompt-design/w5-r2-draft2-20260518.md`
- `docs/prompt-design/w5-r3-critic-20260518.md`
- `docs/prompt-design/w5-r3-draft3-SHIP-20260518.md`

**user check-in #3** (S2 完了):
> W5 framework Draft 3 ship 版完成。88 article × 7 軸 (A 実訪問/B プレス言換/C Wikimedia/D firsthand 可能性/E AI fp/F Helpfulness/G Author binding) で 修正/削除/維持 振分け script 完成。S3 着手判定 → user "OK" で進める。

---

### S3: W5 audit framework Code 投入 (2-4h Code、10 分 Cowork verify)

**Prompt**: S2 完成版 (W5 r3 SHIP)

**Code 実行内容**:
- `scripts/audit/w5-content-triage.mjs` 新規 (7 軸 score script)
- `@xenova/transformers` 導入 + local MiniLM embedding
- 88 article × 7 軸 score → `docs/audit/w5-bucket-result-<date>.json`
- 3 bucket 振分け: 維持 (≥5 軸 PASS) / 修正 (3-4 軸) / 削除 (≤2 軸 or A+B+C+G 全 FAIL)
- 各 article 削除 sub-routing (301/410/noindex) 提案

**Cowork verify**:
- bucket 内訳 confirmation
- user 承認待ち list (特に削除 bucket、誤判定 risk)

**user check-in #4** (S3 完了):
> 88 article audit 完走、bucket: 維持 N1 / 修正 N2 / 削除 N3。削除 list 個別承認 → user "全部 OK" or "<slug> は維持に戻す" 個別判断。S4 着手判定。

---

### S4: W5 削除 bucket 実行 (1-2h Code、5 分 verify)

**Prompt**: S3 audit 結果 + user 承認 list を input、削除 bucket を 301/410/noindex に振分け実行

**Code 実行内容**:
- 削除 bucket 各 article に対し:
  - **301**: 替え記事への redirect (next.config.ts)
  - **410**: app/(legacy)/[...slug]/route.ts (W6-quick で実装済の枠を流用)
  - **noindex**: frontmatter `robots: 'noindex, follow'` 追加
- sitemap.xml から除外
- 内部リンク (related-articles.ts + MDX `[]()` ) から削除 article 全消し
- 1 commit + push

**Cowork verify**:
- live で削除 bucket 全 article の status code 確認
- sitemap から消えてること
- /articles index から消えてること (R18 P4 既実装)

**user check-in #5** (S4 完了、5/29 GSC export 観測):
> 削除 bucket N3 article 実行完了。HEAD=<SHA>。5/29 GSC export pull → redirect err / 404 / canonical 全項目数値 update。S5 着手判定。

---

### S5: W5 修正 bucket sprint 1-4 (4-8h × 4 Code sessions、各 10 分 verify)

**戦略**: 修正 bucket N2 article (推定 30-40) を 10 article ずつ 3-4 sprint に分割、各 sprint = 1 Code session。

**各 sprint Code 実行内容**:
- 担当 10 article ごと:
  - IG block ≥3 個追加 (実体験 / 独自比較 / 価格表 / 1 時間プラン / before-after / 言語 menu / 失敗談 / dated log / 海外比較 / アクセシビリティ / 完売報告 / mini-poll の 12 種から選択)
  - word count ≥1200 (secondary)
  - AI fingerprint reduction (em-dash density < 0.6/100w、boilerplate ≤ 2)
  - 修正後 W5 audit script 再 run → 5 軸 PASS 確認
- 1 commit / sprint + push

**Cowork verify (各 sprint 後)**:
- live で 10 article の audit re-score 確認
- AdSense「有用性の低いコンテンツ」分類軸での改善 estimation

**user check-in #6** (S5 sprint 4 完了 = 修正 bucket 全完了):
> 修正 bucket 全 N2 article retrofit 完了。HEAD=<SHA>。残 R11 動画 sprint → S6 着手判定。

---

### S6: W2 R11 動画 → 記事化 (約 15-22h、分割 sprint で 3 Code session)

**Sub-sprints**:
- **S6a**: R11 11 動画 frame extraction (4-6h)
  - GDrive download 済 11 動画 → scene-by-scene frame catalog (face-aware crop、8 variant 画像/動画)
  - moe-detect Skill 連携
- **S6b**: 9 新記事 draft (6-8h)
  - Animate新宿 / JAAG 原宿 / DBZ 丸亀 / マリオ Krispy upgrade / HP 原宿 / KiddyLand ちいかわ / Snoopy 原宿 / akiba arcade / akiba 夜景 B-roll
  - 9 articles × jpn-translation-style v3 template
- **S6c**: 既存 2 article upgrade (2-3h)
  - krispy-kreme-mario-galaxy-shibuya-2026 (video frame 投入)
  - parco-jojo / parco-6f (動画 evidence 強化)

**Cowork verify (各 sub-sprint 後)**:
- frame 出力 visual 確認 (Read で sample 5 frame)
- 新記事 9 本の live URL HTTP 200 + AuthorBox + IG block
- Wikipedia 比率: 旧 80%+ → 新 50% 以下達成確認

**user check-in #7** (S6 完了):
> R11 動画 → 9 新記事 + 2 upgrade + B-roll 完了。Wikipedia derivative 比率改善: 旧 80+/88 → 新 N/88。S7 着手判定。

---

### S7: W3 identity flip ship (1h Code、5 分 verify)

**Prompt**: `docs/prompt-design/w3-r3-draft3-SHIP-20260518.md` (ship 版完成済)

**Code 実行内容**:
- Commit A SSoT flip: lib/author.ts + AuthorBox + structured-data + about + llms.txt
- Commit B 3 新 routes: /about/takashi-kiyohara/ + /editorial-policy/ + /corrections/
- avatar 画像 path: A (rename 既存 AI avatar) or B (user 配置 LinkedIn 実画像、後追い差し替え)
- LinkedIn URL CI gate (verify-linkedin-url.mjs)
- Single PR squash merge、Vercel 1 atomic deploy

**Cowork verify**:
- Phase 4 verify 4 step を Cowork 側で独立再実行
- schema.org validator で Person+Org JSON-LD GREEN
- Takapon hit 0、Takashi Kiyohara hit + LinkedIn URL present

**user check-in #8** (S7 完了 = 全 chain 完走):
> S7 W3 完走、全 chain 完了。HEAD=<最終 SHA>。indexed 50+/88 達成判定 → AdSense 3rd reapply 解禁判定。reapply 実行 user 物理 task (dashboard で "審査をリクエスト" click)。

---

## ★ KPI matrix (各 stage 累積、6 週間目標)

| metric | baseline (5/18) | S1 後 (5/25) | S4 後 (5/29) | S5 後 (6/8) | S6 後 (6/22) | S7 後 (6/29) | target |
|---|---|---|---|---|---|---|---|
| indexed | 1/170 | 5-12 | 10-20 | 25-35 | 35-50 | 45-60 | **50+/88** |
| Crawled-not-indexed | 64 | 60-64 | 30-45 | 15-25 | 5-15 | 0-10 | <10 |
| redirect エラー | 20 | 3-7 | 0-2 | 0 | 0 | 0 | 0 |
| 404 / canonical / redirect | 9 | 0-2 | 0 | 0 | 0 | 0 | 0 |
| Wikipedia 比率 (88 中) | 80+ | 80+ | 50-60 | 50-60 | 30-40 | 30-40 | <40 |
| AI template fingerprint | high | high | high | low | low | low | low |
| impressions/日 | 1 | 1-3 | 3-8 | 8-15 | 15-30 | 20-40 | ≥5 |
| AdSense reapply 解禁 | × | × | × | × | maybe | ★ judge | ✓ |

---

## ★ Decision tree (各 stage 未達時の branch)

```
S1 未達 (5/25 indexed < 5):
  → R3 round critic 起動、redirect 50% 未解消なら scope 再 audit
  → 1-2 日後 5/27 export 再 pull、効果遅延 case study と比較

S3 audit bucket 異常 (削除 N3 > 60 or < 20):
  → 7 軸 threshold (40%/0.60/50%/0.6 等) を Critic 再 query
  → user 個別判断比率↑、自動振分け↓

S4 GSC reflect 未達 (5/29 redirect エラー > 5):
  → 削除 article の 410 vs noindex 比率再評価
  → sitemap-removed.xml の URL list audit

S5 修正 bucket 効果薄 (IG block 追加後も Crawled-not-indexed 50+):
  → IG block 種類の見直し (12 種から最も効く 3-5 種を A/B test)
  → 修正 → 削除に降格する記事を user 判断

S6 動画素材不足 (frame extraction で素材 < 9 articles 分):
  → 既存 article upgrade に振替、新記事数を 9 → 5-7 に縮小
  → user 撮影追加依頼 (top 5 article hero 実写)

S7 W3 後 schema validator 不 PASS:
  → R4 round critic 起動、JSON-LD 構造再設計
  → rel="me" reciprocal link user 設定確認
```

---

## ★ user 物理 task (chain と並行、緊急 block なし)

| # | task | timing | block stage |
|---|---|---|---|
| ④' | LinkedIn 実画像 K10 folder 配置 | 任意 (S7 直前推奨) | S7 (代替 A で進めれば block なし) |
| ⑤ | LinkedIn Contact info に reciprocal link | S7 後 1 週間以内 | なし |
| ⑥ | GSC URL removal tool で legacy top 20 submit | S1 push 後 24h | block なし (optional speedup) |
| ⑦ | S6 動画素材不足時の追加撮影 | S6 着手前 確認 | S6 (代替 plan あり) |
| ⑧ | AdSense 3rd reapply 実行 (dashboard click) | S7 後、indexed 50+ 達成判定 | chain 完了後 |

---

## ★ Rollback 設計 (各 stage 単位)

- S1 W6-quick: atomic revert (single commit)、Google cache 4-12 週は GSC URL Inspection 5 URL 手動 re-index
- S4 削除 bucket: atomic revert、削除 article の noindex frontmatter 全 revert
- S5 修正 bucket: 各 sprint atomic revert (10 article ずつ)、IG block 追加分のみ revert
- S6 R11 記事化: 新規記事は noindex 化 or 削除、upgrade は revert
- S7 W3 identity: atomic PR revert、entity 4-12 週は GSC URL Inspection で /about + /about/takashi-kiyohara/ + 5 URL 手動 re-index

---

## ★ Total estimated work

| 項目 | 累計 |
|---|---|
| Code session 数 | 8-10 (S1/S3/S4/S5×4/S6×3/S7) |
| Code 累計時間 | 30-50h |
| Cowork (Draft 起草 + verify) | 10-15h (累計 turn 数 20-30) |
| user check-in 回数 | 8 (各 5-10 分) |
| 期間目安 | **4-6 週間** (2026-05-18 → 2026-06-22 〜 06-29) |

---

★ **本書承認 = R19 Master Sprint Chain start signal**。承認後 S1 W6-quick prompt を Code に投入する。
