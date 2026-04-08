#!/usr/bin/env node

/**
 * Vercel Deploy Trigger
 * Triggers a Vercel deployment via webhook
 */

async function triggerDeploy(): Promise<void> {
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL

  if (!hookUrl) {
    console.error('❌ VERCEL_DEPLOY_HOOK_URL not set in environment')
    console.error('   Add it to .env: VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/...')
    process.exit(1)
  }

  console.log('\n🚀 Triggering Vercel deployment...\n')

  try {
    const response = await fetch(hookUrl, {
      method: 'POST',
    })

    if (response.ok || response.status === 202) {
      console.log('✅ Deployment triggered successfully!')
      console.log('   Check your Vercel dashboard for progress.')
    } else {
      console.error(`❌ Deployment failed with status ${response.status}`)
      const text = await response.text()
      if (text) {
        console.error('Response:', text)
      }
      process.exit(1)
    }
  } catch (err) {
    console.error('❌ Failed to trigger deployment:', err instanceof Error ? err.message : err)
    process.exit(1)
  }

  console.log('')
}

triggerDeploy()
