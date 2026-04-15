import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { parseStringPromise } from 'xml2js';
import fetch from 'node-fetch';

const DEPLOY_URL = process.env.DEPLOY_URL || 'http://localhost:3000';
const OUTPUT_DIR = 'qa-screenshots';
const MOBILE_WIDTH = 375;
const DESKTOP_WIDTH = 1440;
const MOBILE_HEIGHT = 812;
const DESKTOP_HEIGHT = 1080;

async function getSitemapPages() {
  try {
    const sitemapUrl = `${DEPLOY_URL}/sitemap.xml`;
    const response = await fetch(sitemapUrl);
    const sitemapXml = await response.text();
    const parsed = await parseStringPromise(sitemapXml);

    const urls = parsed.urlset.url.map(entry => entry.loc[0]);

    // Filter to just article pages (not homepage, not cafes)
    const articlePages = urls.filter(url =>
      !url.endsWith('/') &&
      !url.includes('/cafes') &&
      url.includes(DEPLOY_URL)
    );

    // Return up to 3 most recent (which are typically listed first in sitemap)
    return articlePages.slice(0, 3).map(url =>
      url.replace(DEPLOY_URL, '').replace(/\/$/, '') || '/'
    );
  } catch (error) {
    console.warn('Could not fetch sitemap, using defaults:', error.message);
    return [];
  }
}

async function takeScreenshot(page, path, width, height, suffix) {
  const filename = `${path.replace(/\//g, '-').replace(/^-/, '') || 'homepage'}-${suffix}.png`;
  const filepath = join(OUTPUT_DIR, filename);

  await page.setViewportSize({ width, height });
  await page.goto(`${DEPLOY_URL}${path}`, { waitUntil: 'networkidle' });
  await page.waitForLoadState('domcontentloaded');

  await page.screenshot({ path: filepath, fullPage: suffix === 'mobile-full' });
  console.log(`✓ ${filename}`);

  return filename;
}

async function main() {
  // Create output directory
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const screenshots = [];

  console.log(`\nVisual QA: Taking screenshots of ${DEPLOY_URL}\n`);

  // Screenshot homepage (mobile and desktop, plus full-page mobile)
  console.log('Homepage:');
  screenshots.push(await takeScreenshot(page, '/', MOBILE_WIDTH, MOBILE_HEIGHT, 'mobile'));
  screenshots.push(await takeScreenshot(page, '/', DESKTOP_WIDTH, DESKTOP_HEIGHT, 'desktop'));
  screenshots.push(await takeScreenshot(page, '/', MOBILE_WIDTH, MOBILE_HEIGHT, 'mobile-full'));

  // Screenshot /cafes/
  console.log('\nCafes page:');
  screenshots.push(await takeScreenshot(page, '/cafes/', MOBILE_WIDTH, MOBILE_HEIGHT, 'mobile'));
  screenshots.push(await takeScreenshot(page, '/cafes/', DESKTOP_WIDTH, DESKTOP_HEIGHT, 'desktop'));

  // Screenshot recent articles from sitemap
  const articlePaths = await getSitemapPages();
  if (articlePaths.length > 0) {
    console.log(`\nArticle pages (${articlePaths.length}):`);
    for (const path of articlePaths) {
      screenshots.push(await takeScreenshot(page, path, MOBILE_WIDTH, MOBILE_HEIGHT, 'mobile'));
      screenshots.push(await takeScreenshot(page, path, DESKTOP_WIDTH, DESKTOP_HEIGHT, 'desktop'));
    }
  }

  await browser.close();

  console.log(`\n✓ Visual QA complete: ${screenshots.length} screenshots captured`);
}

main().catch(error => {
  console.error('Visual QA failed:', error);
  process.exit(1);
});
