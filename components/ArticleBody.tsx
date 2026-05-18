import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeExternalLinks from 'rehype-external-links';
import Link from 'next/link';
import AdUnit from './AdUnit';
import AffiliateCTA from './AffiliateCTA';
import InlineNewsletter from './InlineNewsletter';
import { insertInternalLinks } from '@/lib/internal-links';
import { getAllArticles } from '@/lib/articles';
import { getAffiliateProductForCategory } from '@/lib/affiliate-map';
import remarkAffiliate from '@/lib/remark-affiliate';
import rehypeAffiliateRel from '@/lib/rehype-affiliate-rel';
import { mdxComponents } from './mdx-components';

/**
 * MDX compiler options
 * - remark-gfm: GFM tables, strikethrough, autolinks
 * - remark-affiliate: swap REPLACE_WITH_*_AFF_ID placeholders for env values
 * - rehype-external-links (R13-F1, 2026-05-14): every external <a> emits
 *   rel="nofollow noopener noreferrer" + target="_blank".
 * - rehype-affiliate-rel (R18-P3, 2026-05-18): runs AFTER external-links and
 *   Set-merges rel="sponsored" onto affiliate-network anchors. NOTE: the
 *   prior assumption that "Klook links already carry sponsored via inline
 *   HTML (R12-tail)" was FALSE for raw markdown links — a live scan found
 *   31/91 klook anchors missing sponsored. <AffiliateCTA>/inline-HTML links
 *   keep their own rel; this plugin backfills the raw markdown-link case.
 *   Ordering matters: external-links *replaces* rel, so affiliate-rel must
 *   come second to layer sponsored on top without being clobbered.
 */
const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkAffiliate],
    rehypePlugins: [
      [rehypeExternalLinks, { rel: ['nofollow', 'noopener', 'noreferrer'], target: '_blank' }] as [
        typeof rehypeExternalLinks,
        { rel: string[]; target: string },
      ],
      rehypeAffiliateRel,
    ],
  },
};

interface ArticleBodyProps {
  content: string;
  category: string;
  slug?: string;
  /** Pre-computed related article suggestions for "See also" blocks */
  relatedSuggestions?: { slug: string; title: string }[];
}

// Split article content and insert ads + affiliate CTAs at strategic points
// Pattern: after intro (~400 words) → every ~700 words → affiliate CTA mid-article
export default function ArticleBody({ content, category, slug, relatedSuggestions }: ArticleBodyProps) {
  // Auto-insert internal links into content
  let processedContent = content;
  if (slug) {
    const allArticles = getAllArticles();
    processedContent = insertInternalLinks(content, allArticles, slug, 8);
  }

  // Split on h2 headings to insert between sections
  const sections = processedContent.split(/(?=^## )/m);

  // Determine affiliate CTA based on category (centralized in lib/affiliate-map)
  const affiliateProduct = getAffiliateProductForCategory(category);
  const affiliateCTA = affiliateProduct
    ? { ...affiliateProduct, category }
    : null;

  // If article is short (< 3 sections), render without inline ads
  if (sections.length <= 3) {
    return (
      <div className="prose prose-lg" style={{ maxWidth: 'none' }}>
        <MDXRemote source={content} components={mdxComponents} options={mdxOptions} />
      </div>
    );
  }

  // Calculate insertion points
  // Newsletter after section 1-2 (~40% scroll, high engagement)
  // Ad after section 2 (~intro + first topic)
  // Affiliate CTA after section 3-4 (mid-article)
  // Mid-content Rectangle Ad after section 3 (~3rd H2 heading)
  // Ad after section 5-6 (deep in article)
  const newsletterAfterSection: number = Math.min(2, Math.floor(sections.length * 0.4));
  const adAfterSection: number = 2;
  const midContentAdAfterSection: number = 3;
  const affiliateAfterSection: number = Math.min(4, Math.floor(sections.length * 0.5));
  const secondAdAfterSection: number = Math.min(6, sections.length - 2);

  return (
    <>
      {affiliateCTA && (
        <p
          className="not-prose"
          style={{
            fontSize: '0.78rem',
            color: '#6b7280',
            fontStyle: 'italic',
            marginBottom: '1rem',
          }}
        >
          This guide includes affiliate links. We earn a small commission at no extra cost to you.
        </p>
      )}
      {sections.map((section, i) => (
        <div key={i}>
          <div className="prose prose-lg" style={{ maxWidth: 'none' }}>
            <MDXRemote source={section} components={mdxComponents} options={mdxOptions} />
          </div>

          {/* Inline Newsletter — after 2nd H2 (~40% scroll point) */}
          {i === newsletterAfterSection && (
            <div className="my-8 not-prose">
              <InlineNewsletter />
            </div>
          )}

          {/* Inline Ad #1 — after intro sections */}
          {i === adAfterSection && (
            <div className="my-6 not-prose">
              <AdUnit slot="3333333301" format="leaderboard" lazy />
            </div>
          )}

          {/* Mid-Content Rectangle Ad — after 3rd H2 heading */}
          {i === midContentAdAfterSection && i !== adAfterSection && (
            <div className="my-6 not-prose flex justify-center">
              <AdUnit slot="7777777701" format="rectangle" lazy />
            </div>
          )}

          {/* Affiliate CTA — mid-article, contextual */}
          {i === affiliateAfterSection && affiliateCTA && (
            <div className="my-6 not-prose">
              <AffiliateCTA {...affiliateCTA} />
            </div>
          )}

          {/* Inline Ad #2 — deeper in article */}
          {i === secondAdAfterSection && i !== adAfterSection && i !== midContentAdAfterSection && (
            <div className="my-6 not-prose">
              <AdUnit slot="3333333302" format="rectangle" lazy />
            </div>
          )}

          {/* See Also — contextual internal links at ~70% of article */}
          {i === Math.floor(sections.length * 0.7) && relatedSuggestions && relatedSuggestions.length > 0 && (
            <div
              className="my-6 not-prose rounded-lg p-4"
              style={{ background: '#f5f5f4', border: '1px solid #e7e5e4' }}
            >
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#14213d', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Related Reads
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {relatedSuggestions.slice(0, 5).map((r) => (
                  <li key={r.slug} style={{ marginBottom: '4px' }}>
                    <Link
                      href={`/articles/${r.slug}`}
                      style={{ color: '#ea580c', fontSize: '0.88rem', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid rgba(234,88,12,0.3)' }}
                    >
                      {r.title} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
      {affiliateCTA && (
        <div className="not-prose">
          <AffiliateCTA {...affiliateCTA} variant="end" />
        </div>
      )}
    </>
  );
}
