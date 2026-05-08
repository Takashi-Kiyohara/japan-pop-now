#!/usr/bin/env node
/**
 * Wikimedia Commons API search helper.
 * Lists candidate file titles with license + author + URL for a given query.
 *
 * Usage:
 *   node scripts/image-procurement/wikimedia-search.mjs "Sunshine 60 Ikebukuro" 8
 */

const [, , query, limitArg] = process.argv
const limit = parseInt(limitArg || '6', 10)

if (!query) {
  console.error('Usage: wikimedia-search.mjs "<query>" [limit]')
  process.exit(1)
}

const UA = 'jpn-pop-now-image-procure/1.0 (https://japan-pop-now.com)'
const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srnamespace=6&srlimit=${limit}&srsearch=${encodeURIComponent(query)}`

const sr = await fetch(searchUrl, { headers: { 'User-Agent': UA } })
const sj = await sr.json()
const titles = (sj?.query?.search || []).map(s => s.title)
if (titles.length === 0) {
  console.log('NO_RESULTS')
  process.exit(0)
}

const titleParam = titles.map(t => encodeURIComponent(t)).join('|')
const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${titleParam}&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1200`
const ir = await fetch(infoUrl, { headers: { 'User-Agent': UA } })
const ij = await ir.json()
const pages = Object.values(ij?.query?.pages || {})

for (const page of pages) {
  const info = page.imageinfo?.[0]
  if (!info) continue
  const ext = info.extmetadata || {}
  const license = ext.LicenseShortName?.value || ext.UsageTerms?.value || 'UNKNOWN'
  const artistRaw = ext.Artist?.value || 'unknown'
  const artist = artistRaw.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  const url = info.url?.split('?')[0] || ''
  const desc = info.descriptionurl?.split('?')[0] || ''
  const sizeKB = Math.round((info.size || 0) / 1024)
  console.log(JSON.stringify({
    title: page.title,
    license,
    artist,
    url,
    descriptionurl: desc,
    width: info.width,
    height: info.height,
    sizeKB,
  }))
}
