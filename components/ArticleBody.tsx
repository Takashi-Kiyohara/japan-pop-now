import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { Ticket, Train, Hotel, Smartphone } from 'lucide-react';
import AdUnit from './AdUnit';
import AffiliateCTA from './AffiliateCTA';
import InlineNewsletter from './InlineNewsletter';
import { mdxComponents } from './mdx-components';
import { insertInternalLinks } from '@/lib/internal-links';
import { getAllArticles } from '@/lib/articles';
import { env } from '@/lib/env';

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

  // Determine affiliate CTA based on category
  const affiliateCTA = getAffiliateCTAForCategory(category);

  // If article is short (< 3 sections), render without inline ads
  if (sections.length <= 3) {
    return (
      <div className="prose prose-lg" style={{ maxWidth: 'none' }}>
        <MDXRemote source={content} components={mdxComponents} />
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
      {sections.map((section, i) => (
        <div key={i}>
          <div className="prose prose-lg" style={{ maxWidth: 'none' }}>
            <MDXRemote source={section} components={mdxComponents} />
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
                {relatedSuggestions.slice(0, 3).map((r) => (
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
    </>
  );
}

function getAffiliateCTAForCategory(category: string) {
  switch (category) {
    case 'collab-cafes':
      return {
        icon: <Ticket size={24} strokeWidth={1.8} />,
        title: 'Skip the Booking Hassle',
        description: 'Book anime collab cafe experiences and skip-the-line tickets through Klook — English support, free cancellation on most bookings.',
        buttonText: 'Browse Anime Experiences',
        href: `https://www.klook.com/en-US/experiences?aff_id=${env.NEXT_PUBLIC_KLOOK_AFFILIATE_ID}`,
        program: 'klook' as const,
        category: 'collab-cafes',
      };
    case 'anime-pilgrimage':
      return {
        icon: <Train size={24} strokeWidth={1.8} />,
        title: 'Get There by Rail',
        description: 'The Japan Rail Pass covers most pilgrimage routes. Compare 7, 14, and 21-day options — prices recently dropped.',
        buttonText: 'Compare JR Pass Prices',
        href: `https://www.klook.com/en-US/activity/japan-rail-pass?aff_id=${env.NEXT_PUBLIC_KLOOK_AFFILIATE_ID}`,
        program: 'klook' as const,
        category: 'anime-pilgrimage',
      };
    case 'area-guides':
      return {
        icon: <Hotel size={24} strokeWidth={1.8} />,
        title: 'Stay Near the Action',
        description: 'Find hotels in the best anime districts — from ¥3,000/night capsule hotels to themed rooms. Free cancellation on most bookings.',
        buttonText: 'Search Hotels',
        href: `https://www.booking.com/index.html?aid=${env.NEXT_PUBLIC_BOOKING_AFFILIATE_ID}`,
        program: 'booking' as const,
        category: 'area-guides',
      };
    case 'travel-tips':
      return {
        icon: <Smartphone size={24} strokeWidth={1.8} />,
        title: 'Stay Connected in Japan',
        description: 'Get an eSIM before you land — instant activation, no physical SIM swap needed. Data plans from ¥1,000 for 7 days.',
        buttonText: 'Compare eSIM Plans',
        href: `https://www.klook.com/en-US/activity/japan-esim?aff_id=${env.NEXT_PUBLIC_KLOOK_AFFILIATE_ID}`,
        program: 'klook' as const,
        category: 'travel-tips',
      };
    default:
      return null;
  }
}
