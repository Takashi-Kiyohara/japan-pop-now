import { getAllArticles } from '@/lib/articles';
import { NextResponse } from 'next/server';

export async function GET() {
  const articles = getAllArticles();
  const siteUrl = 'https://japan-pop-now.com';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Japan Pop Now</title>
    <link>${siteUrl}</link>
    <description>Your ultimate guide to Japan's anime and pop culture scene — collab cafes, pilgrimage spots, area guides, and travel tips for international visitors.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${articles
      .map(
        (article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${siteUrl}/articles/${article.slug}</link>
      <guid isPermaLink="true">${siteUrl}/articles/${article.slug}</guid>
      <description>${escapeXml(article.description)}</description>
      ${article.featuredImage ? `<image>
        <url>${escapeXml(article.featuredImage)}</url>
        <title>${escapeXml(article.title)}</title>
        <link>${siteUrl}/articles/${article.slug}</link>
      </image>` : ''}
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <author>${escapeXml(article.author)}</author>
      <category>${escapeXml(article.category)}</category>
      ${article.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('')}
      <content:encoded><![CDATA[
        ${article.excerpt}
      ]]></content:encoded>
    </item>
    `
      )
      .join('')}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}
