#!/usr/bin/env node

/**
 * Search Engine Ping & IndexNow Submitter
 * Notifies Google, Bing, and IndexNow of new/updated content
 */

async function pingGoogle(sitemapUrl: string): Promise<void> {
  const url = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`

  try {
    const response = await fetch(url, {
      method: 'GET',
    })

    if (response.ok) {
      console.log('✅ Google sitemap pinged successfully')
    } else {
      console.warn(`⚠️  Google ping returned status ${response.status}`)
    }
  } catch (err) {
    console.error('❌ Failed to ping Google:', err instanceof Error ? err.message : err)
  }
}

async function pingBing(sitemapUrl: string): Promise<void> {
  const url = `http://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`

  try {
    const response = await fetch(url, {
      method: 'GET',
    })

    if (response.ok) {
      console.log('✅ Bing sitemap pinged successfully')
    } else {
      console.warn(`⚠️  Bing ping returned status ${response.status}`)
    }
  } catch (err) {
    console.error('❌ Failed to ping Bing:', err instanceof Error ? err.message : err)
  }
}

async function submitIndexNow(
  key: string,
  hostUrl: string,
  urlsList: string[]
): Promise<void> {
  const payload = {
    host: new URL(hostUrl).hostname,
    key,
    urlList: urlsList,
  }

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (response.ok || response.status === 202) {
      console.log(`✅ IndexNow submitted ${urlsList.length} URL(s)`)
    } else {
      console.warn(`⚠️  IndexNow returned status ${response.status}`)
    }
  } catch (err) {
    console.error('❌ Failed to submit to IndexNow:', err instanceof Error ? err.message : err)
  }
}

async function main() {
  // Read environment variables
  const indexNowKey = process.env.INDEXNOW_KEY
  const hostUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://japan-pop-now.com'
  const sitemapUrl = `${hostUrl}/sitemap.xml`

  console.log('\n🔔 Search Engine & IndexNow Notification\n')

  // Ping Google
  console.log('📍 Pinging Google...')
  await pingGoogle(sitemapUrl)

  // Ping Bing
  console.log('📍 Pinging Bing...')
  await pingBing(sitemapUrl)

  // Submit to IndexNow if key is available
  if (indexNowKey) {
    console.log('📍 Submitting to IndexNow...')
    // Example: submit a few key URLs
    const urlsToSubmit = [
      `${hostUrl}/articles`,
      `${hostUrl}/articles/collab-cafes`,
      `${hostUrl}/articles/anime-pilgrimage`,
    ]
    await submitIndexNow(indexNowKey, hostUrl, urlsToSubmit)
  } else {
    console.log('⚠️  INDEXNOW_KEY not set. IndexNow submission skipped.')
    console.log('   Set INDEXNOW_KEY in .env to enable IndexNow.')
  }

  console.log('\n✨ Search engine notifications complete!\n')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
