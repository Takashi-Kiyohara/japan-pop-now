import { Metadata } from 'next';
import { getAllArticles } from '@/lib/articles';
import { AUTHOR } from '@/lib/author';
import { getAuthorSchema } from '@/lib/structured-data';
import ArticleCard from '@/components/ArticleCard';

export const metadata: Metadata = {
  title: { absolute: 'About Japan Pop Now — Editorial Mission, Sourcing, and Author' },
  description:
    'Mission, editorial principles, image policy, and affiliate disclosures for japan-pop-now.com — written by Takapon, Tokyo-based editor covering anime collab cafes, pilgrimage spots, and pop-culture travel.',
  alternates: {
    canonical: 'https://www.japan-pop-now.com/about',
  },
  openGraph: {
    title: 'About Japan Pop Now — Editorial Mission, Sourcing, and Author',
    description:
      'Mission, editorial principles, image policy, and affiliate disclosures for japan-pop-now.com.',
    url: 'https://www.japan-pop-now.com/about',
    type: 'website',
  },
};

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: 'Our mission',
    body: [
      `Japan Pop Now is a one-person editorial operation written and maintained by ${AUTHOR.name}, a Tokyo-based editor covering anime collab cafes, pilgrimage spots, and pop-culture travel for international visitors. The site exists because the most useful information about Japan's anime scene — opening dates for limited cafes, reservation rules in Japanese, who actually accepts an overseas credit card, which station exit puts you a 3-minute walk from the venue — is fragmented across operator pages, Japanese press wires, and visitor reports on X and 5ch. Most of it never reaches an English-speaking traveler in time to be useful.`,
      `The goal is to bridge that gap. Each article aggregates what operator press releases, official venue pages, and Japanese trade media have announced in writing, then translates and structures it for the international visitor — with explicit hedging where time-sensitive details may shift before you travel. We do not republish operator copy verbatim, and we do not invent facts that the operator has not announced.`,
      `The audience is people planning a trip to Japan around a specific cafe, exhibition, or pilgrimage route. The site is most useful 4–12 weeks before travel, when reservation lotteries open and ticket allocations matter; the cafe-calendar tracker on the homepage covers shorter lead times.`,
    ],
  },
  {
    heading: 'Editorial principles',
    body: [
      `Every article is written to one rule: a careful reader should be able to verify any operator-specific claim against the operator's official site within two minutes. That means we cite the operator's URL when we quote a price, a reservation deadline, or an event end date. Where the operator's site is Japanese-only, we link the Japanese page and translate the relevant fields in-line. Where two operator sources disagree (a press kit says one date, the venue page another), we say so explicitly and state which source we are following.`,
      `We do not invent personal experience. Articles are written in advisory third-person voice — "Visitor reports note", "Trip post-mortems describe", "The operator's announcement says" — rather than first-person travel-writer claims. If the article involves on-site verification (a Tokyo venue we have walked into, a reservation flow we have completed end-to-end), the article body says so explicitly and the byline is dated to the visit. We do not pretend to have multi-year personal histories at venues that opened weeks ago.`,
      `Time-sensitive facts (price, hours, address, reservation deadline, event end date) are verified against the operator's site before publication and again on every monthly content sweep. Older articles carry an "Updated [month] [year]" badge in the header when content has been re-verified inside the last 30 days. Stale articles either get the refresh or get noindex'd until the refresh lands.`,
      `Mistakes happen. When a reader flags an inaccuracy via the contact page or a comment, we correct the article within 24 hours and add a short correction note at the bottom of the article body if the change is material to a reader who already booked or planned around the original.`,
    ],
  },
  {
    heading: 'How we research and visit',
    body: [
      `Research is split between in-person visits and remote review. Tokyo-area collab cafes, area guides, and pilgrimage spots are typically walked or visited before publication when the timing allows; venue access detail (which station exit, how the queue lines form, where the merch counter sits) reflects on-site observation in those cases. Articles for venues we have not yet visited carry a "pre-launch" or "based on operator press materials" note in the lede so readers can calibrate.`,
      `Remote review covers Osaka, Kyoto, and out-of-region venues we have not yet reached, plus events whose press deck lands faster than our visit schedule. For those, the article uses operator press kits, official venue pages, Japanese trade press (Animate Times, Comic Natalie, Travel Watch, MyNavi), and visitor-report aggregation on X. Operator-only claims are cited in-line; we do not present press-deck copy as on-site observation.`,
      `Reservation walkthroughs (Lawson Loppi flows, BOX cafe LivePocket reservations, Klook checkout) reflect actual end-to-end completion of the booking flow. When an operator changes the flow (BOX cafe added e-seitai-ken in 2026, Lawson Ticket switched the international-card behavior), we re-run the walkthrough and update the article inside the same week.`,
    ],
  },
  {
    heading: 'Image policy',
    body: [
      `Every image on the site falls into one of three buckets, each with explicit credit and license shown beside the image:`,
      `(1) Original photography by ${AUTHOR.name}, credited "Photo: Japan Pop Now" or "Photo: ${AUTHOR.name}". These are venue photos, merchandise displays, and street-context shots taken on visits inside Tokyo, occasionally Kyoto and Osaka. Original photos default to all-rights-reserved.`,
      `(2) Wikimedia Commons or other openly licensed images, credited to the original photographer with the applicable license (CC BY 2.0, CC BY-SA 3.0, CC BY-SA 4.0, CC0, public domain). The credit lists the photographer's name as it appears on the source page and links the source file URL. We respect the license terms and do not strip attribution.`,
      `(3) Operator-supplied press kit assets (key visuals, food plating photos, character art releases) used under the operator's standard editorial-use grant. These are sourced directly from the operator's press page or Wire and credited "Press kit: [operator name]".`,
      `We do not generate AI images and do not present generated content as photography. We do not use Unsplash or generic stock photography for anime/cafe articles, since the editorial signal of a real venue photograph (even a Wikimedia-Commons one of the building exterior) is much stronger than a stock-room shot from another country.`,
      `Image captions are article-specific. We do not reuse boilerplate captions across articles. If a hero photo is a venue exterior rather than the actual cafe interior (because no licensed interior photo exists), the caption says so explicitly with the date the venue context was captured.`,
    ],
  },
  {
    heading: 'Affiliate disclosure',
    body: [
      `Some links on the site point to commercial partners — primarily Klook (activities and transit passes), Agoda and Booking.com (hotels), GetYourGuide and Viator (tours and experiences), and Amazon Japan (merchandise). When you click an affiliate link and complete a qualifying purchase, the site may earn a commission at no extra cost to you.`,
      `Affiliate links are marked with rel="sponsored" and appear within editorial recommendations chosen on merit, not on commission rate. We do not run paid product placements disguised as editorial. Klook, Agoda, and Booking.com pay roughly 3–7% on qualifying bookings; GetYourGuide and Viator pay broadly comparable rates; Amazon Japan pays single-digit percent on most categories. None of these economics differ enough that they could shift a recommendation we would not otherwise make.`,
      `The full disclosure with current partner programs and how to spot a sponsored link is at /affiliate-disclosure.`,
      `We are independent of every operator we cover. No operator pays for editorial placement, and no operator receives review-copy approval before publication. If an operator-product relationship influenced an article (for example, a complimentary tour seat or a press preview), the article will say so explicitly in the body text or a disclosure block at the top.`,
    ],
  },
  {
    heading: 'Business inquiries',
    body: [
      `For partnership pitches, press kit submissions, sponsored-coverage proposals, or PR outreach, please use snsganbaro@gmail.com with subject prefix "JPN BIZ —" so it routes correctly. We respond to most inquiries within 5 business days.`,
      `We accept editorial pitches for cafes, exhibitions, theme-park collabs, and pop-up events that fit the site's coverage areas (Tokyo-Osaka-Kyoto with occasional Kumamoto/Sapporo coverage). We do not accept paid editorial placement; coverage is offered when the event is genuinely interesting to the audience and we have capacity to verify the operator's claims.`,
      `We do accept review opportunities (complimentary tour seats, pre-launch venue walkthroughs, press previews). All such relationships are disclosed in the article body, per the affiliate-disclosure section above.`,
    ],
  },
  {
    heading: 'Privacy commitment',
    body: [
      `The site uses Google Analytics 4 with anonymized IP addresses for aggregate traffic measurement. We do not collect personally identifiable information through the site itself; we have no user accounts, no profile pages, no comment-attribution beyond what GitHub Discussions displays for Giscus comments (which are governed by GitHub's own terms).`,
      `Cookies are governed by the consent banner shown on first visit. Declining sets a cookie that disables Google Analytics for that browser. We do not sell, rent, or share user data with third parties beyond the operational analytics relationship with Google.`,
      `If we add advertising in the future (Google AdSense or a comparable network), the consent banner will be updated to cover the additional categories of data those networks collect, and the change will be announced on the homepage. Detailed practices, cookie list, and how to request deletion are at /privacy.`,
    ],
  },
  {
    heading: 'Editorial team',
    body: [
      `Japan Pop Now is currently a one-person editorial operation. ${AUTHOR.name} writes, photographs, fact-checks, designs, and codes the site. There is no editorial team beyond Takapon, no contributor network, and no ghostwriter pool.`,
      `Editorial review is handled by external review passes — Japanese trade press articles, operator official pages, and visitor reports on X — which we cross-check against the article body before publication. We do not use AI-generated articles. Articles are written by Takapon, then run through a fact-check pass against the cited sources before publication.`,
      `Should the site grow to a multi-author operation in the future, every contributing author will get a public byline and an entry on this page; we will not anonymize or substitute author identity.`,
    ],
  },
  {
    heading: 'Coverage scope',
    body: [
      `The site covers five editorial silos: collab cafes (currently the largest body of work), destinations (area guides for Akihabara, Ikebukuro, Shibuya, Den Den Town and similar otaku districts), experiences (theme-park collabs, exhibitions, walk-in pop-ups), anime pilgrimage spots (real-world locations from anime series), and travel tips (logistics articles like JR Pass routing, IC card setup, luggage forwarding, eSIM choice).`,
      `Tokyo coverage is densest. Osaka and Kyoto get steady coverage, with deeper attention when Universal Cool Japan, KyoAni-related pilgrimage routes, or major pop-up cycles run. Kumamoto, Sapporo, Fukuoka, and Nagoya appear when an IP-specific tourism initiative justifies the trip (the One Piece statue tour, the Pokemon Karaoke Manekineko campaign, the Frieren USJ takeover).`,
      `We deliberately do not cover: hentai cafes, host clubs, anything requiring the Kabukicho-style adult-entertainment context, gambling parlors, and regular Japanese restaurant reviews not connected to a pop-culture IP. The site is built around the international visitor who is in Japan for an anime IP-specific reason; coverage follows that brief.`,
      `New articles publish at a deliberate cadence — typically two to four per week during cafe-collab high-season (April–June, October–December for the major Tokyo cycles), one or two per week during quieter windows. Articles get dated badges on the homepage so readers can see what is fresh and what was last verified.`,
    ],
  },
  {
    heading: 'Reader feedback and updates',
    body: [
      `If you spot a price that has moved, an event date that has been extended, a venue that has closed, or any factual error: please tell us. The contact page above routes to ${AUTHOR.name} directly. We aim for a 24-hour turnaround on factual corrections and a 72-hour turnaround on substantive content updates.`,
      `Material corrections (price errors that affect a booking decision, dates that affect a travel plan, address corrections that prevent a wrong-venue trip) are noted at the bottom of the affected article body with the date of the correction. Cosmetic corrections (typos, minor grammar) ship silently.`,
      `For requests to cover a specific venue or event we have not yet written about: send the operator's URL and the rough event window via the contact page. We prioritize requests for events with a clear English-visitor angle (English signage, international card acceptance, accessible booking flow).`,
    ],
  },
];

const TEAM = [
  {
    name: AUTHOR.name,
    role: AUTHOR.jobTitle,
    bio: AUTHOR.bio,
    expertise: AUTHOR.expertise,
    socials: AUTHOR.socials,
  },
];

export default function AboutPage() {
  const allArticles = getAllArticles();
  const recentArticles = allArticles.slice(0, 6);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getAuthorSchema()),
        }}
      />

      <div style={{ background: '#fafaf9' }}>
        {/* Hero */}
        <section
          style={{
            background: 'linear-gradient(135deg, #14213d 0%, #1a2a4a 100%)',
            padding: '80px 0 60px',
          }}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p
              className="text-sm font-bold tracking-widest uppercase mb-4"
              style={{ color: '#fb923c' }}
            >
              About
            </p>
            <h1
              className="text-white mb-6"
              style={{
                fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              About Japan Pop Now
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.7 }}>
              Editorial mission, sourcing standards, image policy, and the person behind the byline.
            </p>
          </div>
        </section>

        <div style={{ height: '3px', background: 'linear-gradient(90deg, #f97316, #e63946, #14213d)' }} />

        {/* Sections */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div
            className="rounded-xl p-6 md:p-10"
            style={{ background: '#fff', border: '1px solid #e7e5e4', lineHeight: 1.7, color: '#44403c' }}
          >
            {SECTIONS.map((section) => (
              <section key={section.heading} className="mb-8">
                <h2
                  style={{
                    fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: '#14213d',
                    marginBottom: '14px',
                  }}
                >
                  {section.heading}
                </h2>
                {section.body.map((paragraph, idx) => (
                  <p key={idx} style={{ marginBottom: '12px' }}>
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </article>

        {/* Team */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center gap-4 mb-8">
            <div style={{ width: '4px', height: '28px', background: '#f97316', borderRadius: '2px' }} />
            <h2
              style={{
                fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                fontSize: '1.6rem',
                fontWeight: 700,
                color: '#14213d',
              }}
            >
              The byline
            </h2>
          </div>

          {TEAM.map((member) => (
            <div
              key={member.name}
              className="rounded-xl p-6 md:p-8"
              style={{ background: '#fff', border: '1px solid #e7e5e4' }}
            >
              <div className="flex flex-col sm:flex-row gap-6">
                <div
                  className="flex-shrink-0 rounded-full flex items-center justify-center"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #f97316, #e63946)',
                    fontSize: '2rem',
                    color: '#fff',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                  }}
                >
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      color: '#14213d',
                      marginBottom: '4px',
                    }}
                  >
                    {member.name}
                  </h3>
                  <p style={{ color: '#f97316', fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px' }}>
                    {member.role}
                  </p>
                  <p style={{ color: '#57534e', lineHeight: 1.7, marginBottom: '12px' }}>
                    {member.bio}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {member.expertise.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          fontSize: '0.75rem',
                          padding: '3px 10px',
                          borderRadius: '99px',
                          background: '#fef3c7',
                          color: '#92400e',
                          fontWeight: 500,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: '12px', display: 'flex', gap: '12px', fontSize: '0.85rem' }}>
                    <a href={member.socials.threads} target="_blank" rel="noopener noreferrer" style={{ color: '#0d9488' }}>Threads</a>
                    <a href={member.socials.x} target="_blank" rel="noopener noreferrer" style={{ color: '#0d9488' }}>X</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Recent Articles */}
        <section style={{ background: '#fff', borderTop: '1px solid #e7e5e4' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center gap-4 mb-8">
              <div style={{ width: '4px', height: '28px', background: '#f97316', borderRadius: '2px' }} />
              <h2
                style={{
                  fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  color: '#14213d',
                }}
              >
                Recent articles
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recentArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} size="sm" />
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section
          style={{
            background: '#14213d',
            padding: '60px 0',
            textAlign: 'center',
          }}
        >
          <div className="max-w-2xl mx-auto px-4">
            <h2
              className="text-white mb-4"
              style={{
                fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                fontSize: '1.8rem',
                fontWeight: 700,
              }}
            >
              Get in touch
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px', lineHeight: 1.7 }}>
              Tip, correction, or partnership inquiry — Takapon reads everything that lands.
            </p>
            <a
              href="mailto:snsganbaro@gmail.com"
              className="inline-block px-8 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ background: '#f97316', color: '#fff' }}
            >
              Contact
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
