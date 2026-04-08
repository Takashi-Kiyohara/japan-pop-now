import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import AdUnit from './AdUnit';
import AffiliateCTA from './AffiliateCTA';
import { insertInternalLinks } from '@/lib/internal-links';
import { getAllArticles } from '@/lib/articles';

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
        <MDXRemote source={content} />
      </div>
    );
  }

  // Calculate insertion points
  // Ad after section 2 (~intro + first topic)
  // Affiliate CTA after section 3-4 (mid-article)
  // Ad after section 5-6 (deep in article)
  const adAfterSection = 2;
  const affiliateAfterSection = Math.min(4, Math.floor(sections.length * 0.5));
  const secondAdAfterSection = Math.min(6, sections.length - 2);

  return (
    <>
      {sections.map((section, i) => (
        <div key={i}>
          <div className="prose prose-lg" style={{ maxWidth: 'none' }}>
            <MDXRemote source={section} />
          </div>

          {/* Inline Ad #1 — after intro sections */}
          {i === adAfterSection && (
            <div className="my-6 not-prose">
              <AdUnit slot="3333333301" format="leaderboard" lazy />
            </div>
          )}

          {/* Affiliate CTA — mid-article, contextual */}
          {i === affiliateAfterSection && affiliateCTA && (
            <div className="my-6 not-prose">
              <AffiliateCTA {...affiliateCTA} />
            </div>
          )}

          {/* Inline Ad #2 — deeper in article */}
          {i === secondAdAfterSection && i !== adAfterSection && (
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
        icon: '🎫',
        title: 'Skip the Booking Hassle',
        description: 'Book anime collab cafe experiences and skip-the-line tickets through Klook — English support, free cancellation on most bookings.',
        buttonText: 'Browse Anime Experiences',
        href: 'https://www.klook.com/en-US/experiences?aff_id=' + (process.env.NEXT_PUBLIC_KLOOK_AFF_ID || ''),
        program: 'klook' as const,
      };
    case 'anime-pilgrimage':
      return {
        icon: '🚅',
        title: 'Get There by Rail',
        description: 'The Japan Rail Pass covers most pilgrimage routes. Compare 7, 14, and 21-day options — prices recently dropped.',
        buttonText: 'Compare JR Pass Prices',
        href: 'https://www.klook.com/en-US/activity/japan-rail-pass?aff_id=' + (process.env.NEXT_PUBLIC_KLOOK_AFF_ID || ''),
        program: 'klook' as const,
      };
    case 'area-guides':
      return {
        icon: '🏨',
        title: 'Stay Near the Action',
        description: 'Find hotels in the best anime districts — from ¥3,000/night capsule hotels to themed rooms. Free cancellation on most bookings.',
        buttonText: 'Search Hotels',
        href: 'https://www.booking.com/index.html?aid=' + (process.env.NEXT_PUBLIC_BOOKING_AFF_ID || ''),
        program: 'booking' as const,
      };
    case 'travel-tips':
      return {
        icon: '📱',
        title: 'Stay Connected in Japan',
        description: 'Get an eSIM before you land — instant activation, no physical SIM swap needed. Data plans from ¥1,000 for 7 days.',
        buttonText: 'Compare eSIM Plans',
        href: 'https://www.klook.com/en-US/activity/japan-esim?aff_id=' + (process.env.NEXT_PUBLIC_KLOOK_AFF_ID || ''),
        program: 'klook' as const,
      };
    default:
      return null;
  }
}
