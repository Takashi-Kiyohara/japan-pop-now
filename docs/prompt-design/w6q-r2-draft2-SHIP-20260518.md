# W6-quick — Technical Cleanup Code Prompt **Draft 2 = SHIP 版** (2026-05-18)

**Status**: 🚢 SHIP 版、Code 投入準備完了
**Round 2 input**: `w6q-r2-critic-20260518.md`
**Changes from Draft 1**:
- 410 method 明示 (route.ts、middleware 不使用)
- sitemap exclusion + sitemap-removed.xml 60 日 temporary publish 追加
- 全 redirect next.config.ts 集約、middleware 配置禁止 (R18 P5 Cache-Control conflict 回避)
- Phase 1 curl production + Googlebot UA、preview exclusion
- 既存 permanent redirect whitelist diff 工程追加
- intentional-redirects.json commit + CI 参照
- KPI 「indexed 5-12 件 / 5/25・5/29・6/5 三段観測」
- GSC URL removal tool optional 工程追加

---

## Advisor Strategy
読む → 判断 → 必要分のみ実行。**technical fix only**、content quality / identity 系一切触らない。1 commit 集約、1-2h Code session。最終 verify 全 PASS 確認後 push、GSC reflect 待ち。

---

## 必読 memory
- ★★★ `project_jpn_gsc_export_20260515` (35 件内訳)
- ★★★ `project_jpn_current_state_20260518` (SoT)
- ★★★ `feedback_in_session_critic_not_external`
- ★★★ `feedback_critic_finding_no_deferral`
- ★★ `feedback_wildcard_redirect_ban`
- ★★ `feedback_curl_ua_bot_defense` (Googlebot UA 固定)
- ★★ `feedback_url_http_verify_before_handoff`
- ★ `feedback_push_before_sprint_closure`

## HEAD baseline
`6e8c919` (R18 closure 後、未変動確認必須)

---

## Phase 0: Whitelist 確立 (10 分、Phase 1 開始前必須)

### 0-1 既存 redirects dump
```bash
# next.config.ts の redirects() 全件 dump
node -e "const c = require('./next.config.ts'); console.log(JSON.stringify(c.redirects ? c.redirects() : c.default.redirects(), null, 2))" 2>/dev/null || grep -A 200 "redirects" next.config.ts > /tmp/existing_redirects.txt
cat /tmp/existing_redirects.txt
```

### 0-2 intentional redirects file commit
`docs/intentional-redirects.json` を新規 create:
```json
{
  "permanent": [
    { "source": "/old-slug-A", "destination": "/new-slug-A", "reason": "article migration 2026-04" },
    { "source": "/old-slug-B", "destination": "/new-slug-B", "reason": "article migration 2026-05" }
  ],
  "gone_410": [
    { "pattern": "/?p=*", "reason": "WordPress legacy query param" },
    { "pattern": "/?page_id=*", "reason": "WordPress legacy query param" },
    { "pattern": "/wp-content/*", "reason": "WordPress asset paths" }
  ],
  "exclude_from_sitemap": []
}
```
user 承認後 commit。Phase 1-4 全 step で参照。

---

## Phase 1: GSC URL status audit (15 分)

### 1-1 sitemap 全 URL の production status check (Googlebot UA 固定)
```bash
GBOT="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
curl -sA "$GBOT" "https://www.japan-pop-now.com/sitemap.xml" | grep -oE "<loc>[^<]+</loc>" | sed -E 's|</?loc>||g' > /tmp/all_urls.txt
echo "total sitemap URLs: $(wc -l < /tmp/all_urls.txt)"

# 各 URL status + redirect chain
while IFS= read -r url; do
  rcode=$(curl -sA "$GBOT" -o /dev/null -w "%{http_code}\t%{redirect_url}\t%{num_redirects}" "$url")
  echo -e "$url\t$rcode"
done < /tmp/all_urls.txt > /tmp/url_status.tsv

# 異常 URL 抽出 (200 直接ではないもの)
awk -F'\t' '$2 != 200' /tmp/url_status.tsv > /tmp/issues.tsv
echo "anomaly URLs: $(wc -l < /tmp/issues.tsv)"

# 内訳カウント
awk -F'\t' '{print $2}' /tmp/url_status.tsv | sort | uniq -c | sort -rn
```

★ preview deploy URL (`*.vercel.app`) は **対象外**、本 URL のみ。

### 1-2 canonical mismatch audit
```bash
while IFS= read -r url; do
  body=$(curl -sA "$GBOT" "$url")
  cano=$(echo "$body" | grep -oE '<link[^>]+rel="canonical"[^>]+href="[^"]+"' | grep -oE 'href="[^"]+"' | sed 's/href="//;s/"//')
  # normalize: trailing slash 揺れ吸収
  cano_norm="${cano%/}"
  url_norm="${url%/}"
  if [ -n "$cano" ] && [ "$cano_norm" != "$url_norm" ]; then
    echo -e "MISMATCH\t$url\t$cano"
  fi
done < /tmp/all_urls.txt > /tmp/canonical_mismatch.tsv
wc -l /tmp/canonical_mismatch.tsv
```

### 1-3 legacy WP URL pattern check (sample)
```bash
for u in "https://www.japan-pop-now.com/?p=100" "https://www.japan-pop-now.com/?page_id=1" "https://www.japan-pop-now.com/wp-content/uploads/test.jpg" "https://www.japan-pop-now.com/category/anime/"; do
  curl -sA "$GBOT" -o /dev/null -w "$u -> %{http_code}\n" "$u"
done
```

期待: WP pattern が現状 200 や 308 self-loop を返してたら 410 化対象、`/category/*` は default 404 OK。

---

## Phase 2: 5 group fix (60-90 分)

### Group A: redirect chain depth >1 (20 件想定)

**fix logic**:
- `/tmp/issues.tsv` から `num_redirects >= 2` の URL 抽出
- 最終 destination が `intentional-redirects.json.permanent` に登録済 → next.config.ts redirects 配列を最適化 (中間 hop 省略、1-hop 化)
- 未登録 → user 承認待ち (defer to Phase 0)、本 sprint では touch しない
- 全 redirect は **next.config.ts に集約**、middleware に書かない (R18 P5 Cache-Control conflict 回避)

**実装**:
```ts
// next.config.ts
redirects() {
  return [
    { source: '/old-slug-A', destination: '/new-slug-A', permanent: true },
    { source: '/old-slug-B', destination: '/new-slug-B', permanent: true },
    // ...1-hop 化済 list
  ];
}
```

### Group B: 404 (2 件)

**fix logic**:
- `/tmp/issues.tsv` から status=404 抽出
- ① 期間限定 collab post-event → Group E (410 化) に flow
- ② article 削除済で sitemap 残存 → sitemap source filter 修正 (`lib/sitemap.ts` or `app/sitemap.ts`)

### Group C: 代替ページ canonical mismatch (4 件)

**fix logic**:
- `/tmp/canonical_mismatch.tsv` から対象 URL
- `app/articles/[slug]/page.tsx` の `generateMetadata` で `metadata.alternates.canonical = canonical_url` を明示
- normalize: 全 sitemap URL の trailing slash 統一 + www 固定 + https 固定

### Group D: ページにリダイレクト (3 件 sitemap 自己 redirect)

**fix logic**:
- sitemap 内の URL が 301 で別 URL を指してる = sitemap source が legacy URL を listing してる
- `lib/sitemap.ts` の article list 生成 logic で redirect 後の final URL のみを listing

### Group E: legacy WP URL 410 化

**fix logic**:
- `intentional-redirects.json.gone_410.pattern` から match パターン
- `app/(legacy)/[...slug]/route.ts` を新規 create:
```ts
// app/(legacy)/[...slug]/route.ts
export const dynamic = 'force-static';

export async function GET(request: Request) {
  const url = new URL(request.url);
  // WP legacy pattern match
  if (url.search.match(/[?&](p|page_id)=/) || url.pathname.startsWith('/wp-content/')) {
    return new Response('Gone', {
      status: 410,
      headers: { 'Cache-Control': 'public, max-age=31536000', 'Content-Type': 'text/plain' }
    });
  }
  // それ以外は通常 404
  return new Response('Not Found', { status: 404 });
}
```

★ middleware rewrite で 410 workaround **禁止** (edge cache が 200 誤キャッシュ報告)。

### Group F (新規): sitemap-removed.xml 60 日 temporary publish

**目的**: Mueller 推奨の deindex speedup。

**実装**:
- `app/sitemap-removed.xml/route.ts` を新規:
```ts
export async function GET() {
  const removedUrls = [
    'https://www.japan-pop-now.com/?p=100',
    // legacy WP URL top 20、intentional-redirects.json.gone_410 + 削除済 article
  ];
  const lastmod = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${removedUrls.map(u => `  <url><loc>${u}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
```
- `public/robots.txt` に追記: `Sitemap: https://www.japan-pop-now.com/sitemap-removed.xml`
- 60 日後撤去予定を `docs/sitemap-removed-expiry.md` に記録 (2026-07-17 撤去 target)

### (Optional) Phase 2-末尾: GSC URL removal tool 一括 submit
- user 手動 task: GSC > インデックス > 削除 から intentional-redirects.json.gone_410 の top 20 URL を temporary removal (6 ヶ月 hide)
- Code は実行できない、Cowork が user に依頼

---

## Phase 3: 1 commit 集約

```
fix(seo): W6-quick technical cleanup — 29 issues from GSC 5/15 export

Resolves 4 issue categories surfaced by GSC indexing report:
- redirect chain depth >1: 20 URLs → next.config.ts redirects に 1-hop 化集約
- 404: 2 URLs → 410 化 (route.ts) or sitemap 除外
- 代替ページ canonical mismatch: 4 URLs → metadata.alternates.canonical 明示
- 自己 redirect chain: 3 URLs → lib/sitemap.ts filter 修正
- legacy WP URL: app/(legacy)/[...slug]/route.ts 新設、410 + Cache-Control 1y
- sitemap-removed.xml: 60 日 temporary publish、deindex speedup

noindex reflect lag (6 URLs) は次 GSC export 待ち、本 sprint 対象外。

Baseline: 6e8c919 (R18 closure 後)
Critic verdict: GREEN (R2 完走、R1 RED 2 + YELLOW 4 全 close)
intentional-redirects.json: 同 commit 同梱、CI 参照
Removed-sitemap expiry: 2026-07-17 (60 days、docs/sitemap-removed-expiry.md)
```

---

## Phase 4: live verify (push 後 30 秒待ち)

### 4-1 sitemap.xml all 200 gate (intentional 410 exclusion list 参照)
```bash
GBOT="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
INTENTIONAL=$(jq -r '.gone_410[].pattern' docs/intentional-redirects.json | sed 's|*||g')

curl -sA "$GBOT" "https://www.japan-pop-now.com/sitemap.xml" | grep -oE "<loc>[^<]+</loc>" | sed -E 's|</?loc>||g' > /tmp/sm.txt
fail=0; ok=0
while IFS= read -r url; do
  # intentional 410 exclusion
  excluded=0
  for pat in $INTENTIONAL; do
    [[ "$url" == *"$pat"* ]] && excluded=1
  done
  [ "$excluded" = "1" ] && continue
  rcode=$(curl -sA "$GBOT" -o /dev/null -w "%{http_code}" "$url")
  if [ "$rcode" = "200" ]; then ok=$((ok+1)); else fail=$((fail+1)); echo "FAIL: $url -> $rcode"; fi
done < /tmp/sm.txt
echo "Sitemap URLs (exc intentional 410): ok=$ok fail=$fail"
# expected: fail=0
```

### 4-2 legacy WP 410 + Cache-Control 1y verify
```bash
GBOT="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
for u in "https://www.japan-pop-now.com/?p=100" "https://www.japan-pop-now.com/?page_id=1" "https://www.japan-pop-now.com/wp-content/test.jpg"; do
  hdr=$(curl -sIA "$GBOT" "$u")
  echo "=== $u ==="
  echo "$hdr" | grep -iE "(HTTP|cache-control)"
done
# expected: HTTP 410 + Cache-Control: public, max-age=31536000
```

### 4-3 canonical self-reference check
```bash
GBOT="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
while IFS= read -r url; do
  body=$(curl -sA "$GBOT" "$url")
  cano=$(echo "$body" | grep -oE '<link[^>]+rel="canonical"[^>]+href="[^"]+"' | grep -oE 'href="[^"]+"' | sed 's/href="//;s/"//')
  cano_norm="${cano%/}"
  url_norm="${url%/}"
  if [ "$cano_norm" != "$url_norm" ]; then
    echo "MISMATCH: $url -> $cano"
  fi
done < /tmp/sm.txt
# expected: 0 MISMATCH
```

### 4-4 redirect chain depth check
```bash
GBOT="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
for u in <former chain origin URLs>; do
  depth=$(curl -sLA "$GBOT" -o /dev/null -w "%{num_redirects}" "$u")
  final=$(curl -sLA "$GBOT" -o /dev/null -w "%{http_code}" "$u")
  echo "$u -> redirects=$depth final=$final"
done
# expected: depth ≤ 1, final = 200 (or intentional 410)
```

### 4-5 1-hop destination noindex check
```bash
GBOT="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
for u in <1-hop destinations>; do
  body=$(curl -sA "$GBOT" "$u")
  robots=$(echo "$body" | grep -oE 'name="robots" content="[^"]+"' | head -1)
  xrobots=$(curl -sIA "$GBOT" "$u" | grep -i ^x-robots-tag)
  echo "$u | meta=$robots | header=$xrobots"
done
# expected: robots != noindex (ranking pass 確保)
```

### 4-6 sitemap-removed.xml 200 + temporary publish 確認
```bash
GBOT="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
curl -sIA "$GBOT" "https://www.japan-pop-now.com/sitemap-removed.xml" | head -3
curl -sA "$GBOT" "https://www.japan-pop-now.com/robots.txt" | grep -i "sitemap-removed"
# expected: 200 + robots.txt 列挙
```

---

## Phase 5: 3 段階 GSC export 観測 (5/25 + 5/29 + 6/5)

### KPI 目標
| 区分 | 5/15 baseline | 5/25 (4 日後) | 5/29 (11 日後) | 6/5 (18 日後) |
|---|---|---|---|---|
| indexed | 1 | 3-7 | 5-12 | 8-15 |
| redirect エラー | 20 | 8-12 | 3-7 | 0-3 |
| 404 | 2 | 1 | 0 | 0 |
| canonical | 4 | 3-4 | 1-3 | 0-1 |
| ページにリダイレクト | 3 | 1 | 0 | 0 |
| noindex 反映 | 6 | 12-14 (R17/R18 全件) | 14 | 14 |
| Crawled-not-indexed | 64 | 60-64 | 50-60 | 45-55 (HCU 別 channel、本 sprint 範囲外) |

**未達なら**: Phase 1 audit script で対象 URL 再 verify、R3 critic round 起動。
**達成なら**: W5 / W3 並行 sprint に着手 OK signal。

---

## ★ Code 投入直前 Cowork checklist

1. `next.config.ts` の `redirects()` 全件 dump → user 承認済 whitelist と diff → 未承認 0 件確認
2. middleware.ts の Cache-Control path filter が `/api/*` 等限定で redirect path を除外 grep verify
3. `docs/intentional-redirects.json` Phase 1 開始前に commit、Phase 4 verify 参照
4. production URL の Googlebot UA curl smoke test (sitemap 全 URL の 5 sample) 先行実施
5. GSC URL removal tool への submit list (max 20) user 承認後 user 手動実行
6. HEAD = `6e8c919` 未変動確認

---

## ★ 報告 format (Code → Cowork)

```
W6-quick 完了:
- HEAD: <new SHA>  (origin/main 一致)
- single commit: <sha>
- 変更 files: next.config.ts, app/(legacy)/[...slug]/route.ts (new), lib/sitemap.ts, app/sitemap-removed.xml/route.ts (new), public/robots.txt, docs/intentional-redirects.json (new), docs/sitemap-removed-expiry.md (new)
- Critic in-session: <agentId> + verdict
- Phase 4 verify (6 step 結果 verbatim):
  - 4-1 sitemap fail=0
  - 4-2 legacy WP 410 + Cache-Control 1y all PASS
  - 4-3 canonical MISMATCH 0
  - 4-4 redirect chain depth ≤ 1 all PASS
  - 4-5 1-hop destination noindex 0
  - 4-6 sitemap-removed.xml 200 + robots.txt 列挙
- Cowork external verify queue: 5/25 + 5/29 + 6/5 GSC export 再 pull (user に依頼)
```

---

## Rollback 設計
- atomic single commit revert で済む
- Google cache 残存期間 4-12 週は GSC URL Inspection で 3 routes + /about + homepage の 5 URL のみ手動 re-index、article 群は IndexNow に委譲
- sitemap-removed.xml 60 日 expiry を `docs/sitemap-removed-expiry.md` で記録、2026-07-17 撤去 plan

---

★ **本 Draft 2 = ship 版**、Code 投入準備完了
