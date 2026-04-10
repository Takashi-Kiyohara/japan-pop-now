import { Metadata } from 'next';
import Link from 'next/link';
import { Ticket, MapPin, Hotel, Smartphone } from 'lucide-react';
import { CATEGORIES, getArticlesByCategory } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';
import Breadcrumb from '@/components/Breadcrumb';
import AdUnit from '@/components/AdUnit';
import AffiliateCTA from '@/components/AffiliateCTA';
import { env } from '@/lib/env';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    slug: category.slug,
  }));
}

function getCategoryIntro(slug: string) {
  const introStyle = {
    maxWidth: '760px',
    color: '#44403c',
    fontSize: '1.02rem',
    lineHeight: 1.75,
  } as const;
  const pStyle = { marginBottom: '1.1rem' } as const;

  switch (slug) {
    case 'anime-pilgrimage':
      return (
        <div style={introStyle}>
          <p style={pStyle}>
            Anime pilgrimage — <em>seichi junrei</em> (聖地巡礼) — is the practice of visiting the
            real-world locations that appear in your favourite anime, manga, and games. For fans
            it is one of the most emotionally specific things you can do in Japan. Standing in
            front of the railway crossing from <em>Slam Dunk</em> in Kamakura, or on the bridge
            from <em>Anohana</em> in Chichibu, or at a Hakone funicular stop that appears in
            <em> Evangelion</em>, has a different texture than seeing it in a frame. The location
            is the same, the light is different, and you become the new variable in the shot.
          </p>
          <p style={pStyle}>
            The destinations span the country. Kamakura&apos;s Enoshima Electric Railway crossing,
            instantly recognisable from the <em>Slam Dunk</em> opening, is the most photographed
            pilgrimage site in Japan and has a steady rotation of fans every weekend. Chichibu —
            two hours northwest of Tokyo on the Seibu line — is the spiritual home of <em>Anohana</em>,
            with the bridge, the old elementary school, and the festival the show built its
            emotional climax around. Hakone is <em>Evangelion</em> territory: the Tozan Railway,
            the lake, the Owakudani sulphur vents, and Tokyo-3 itself in the show&apos;s geography.
            Other major routes include Numazu (<em>Love Live! Sunshine!!</em>), Washinomiya
            (<em>Lucky Star</em>), and the Saitama countryside grounding dozens of slice-of-life series.
          </p>
          <p style={pStyle}>
            Planning a pilgrimage trip is mostly about transit and timing. A JR Pass makes the
            longer-distance routes affordable when you are pairing two or three sites in different
            regions. Early-morning visits photograph better and let you avoid weekend crowds at
            the popular spots. Bring the screenshots you want to recreate — most fans frame their
            phone against the location for the side-by-side, and it is much easier with the
            reference image already cued up. Locals are welcoming and many smaller pilgrimage
            towns now lean into the visitor traffic with character notebooks at shrines and
            pilgrimage maps at the station tourism counter. Be quiet, do not block residents, and
            you will be welcome back.
          </p>
        </div>
      );

    case 'collab-cafes':
      return (
        <div style={introStyle}>
          <p style={pStyle}>
            Anime collaboration cafes are the most distinctly Japanese way to spend a meal. A
            studio licenses out a property — a hit anime, a long-running franchise, a brand-new
            release with a cinema tie-in — and a cafe takes the entire space over for four to
            eight weeks. The walls become character art, the menu is rebuilt around themed dishes
            that match the show&apos;s colour palette and recurring motifs, and every order comes
            with a randomly drawn coaster, postcard, or trading card from a limited series. When
            the run ends, the whole setup is dismantled and the next collab moves in. The result
            is a kind of pop-up theatre crossed with a restaurant, and once you have done one you
            understand why fans plan trips around them.
          </p>
          <p style={pStyle}>
            The mechanics surprise first-timers. Reservations almost always open about a month in
            advance and the popular slots — opening day, weekends, evenings — disappear within
            minutes of the booking window opening. Most cafes use a Japanese-language system like
            Lawson Ticket or a dedicated cafe site, which makes it easier to book through a friend
            in Japan or a proxy reservation service. Once you arrive, the order minimum is one
            drink or food item per person, the limited merchandise sold inside is usually capped
            at one or two pieces per order, and staff will quietly ask you to wrap up at the time
            slot&apos;s end so the next group can sit down. Photos of your own table are fine.
          </p>
          <p style={pStyle}>
            There are two flavours of collab cafe and the distinction matters when planning.
            <strong> Pop-up collabs</strong> are the limited-time runs above — they rotate every
            few weeks at chains like Animate Cafe, Tower Records Cafe, the Princess Cafe network,
            and various department-store basement spaces. <strong>Permanent themed cafes</strong>
            like Pokemon Cafe Tokyo, the Capcom Cafe network, and Square Enix Cafe Akihabara stay
            open year-round with a stable menu but rotate seasonal events on top. If you are
            visiting for a specific anime collab, check our{' '}
            <Link href="/cafes" style={{ color: '#f97316', fontWeight: 600 }}>live cafe tracker</Link>{' '}
            to see what is running during your trip dates and book the moment the window opens.
          </p>
        </div>
      );

    case 'travel-tips':
      return (
        <div style={introStyle}>
          <p style={pStyle}>
            Anime fans visiting Japan have a different itinerary than the average tourist, and
            the practical decisions reflect that. A standard Tokyo trip might prioritise Asakusa,
            Shibuya Crossing, and a day in Hakone. A fan trip adds Akihabara, Ikebukuro, Nakano
            Broadway, two or three pilgrimage sites in different regions, four collab cafe
            reservations, and a luggage strategy that accounts for the box of figures you are
            going to ship home. The travel tips here are written for that itinerary specifically.
          </p>
          <p style={pStyle}>
            The single biggest decision is the <strong>JR Pass</strong>. For a Tokyo-only trip
            you do not need one — local IC cards (Suica, PASMO) are cheaper. The pass starts
            paying off the moment you add a bullet-train route: Kamakura for <em>Slam Dunk</em>,
            Hakone for <em>Evangelion</em>, Kyoto and Osaka for the western pilgrimage sites, or
            Numazu for <em>Love Live!</em>. Sketch your route first, add up the individual fares,
            then compare against the 7, 14, or 21-day pass prices. Our{' '}
            <Link href="/articles/jr-pass-anime-pilgrimage-routes-2026" style={{ color: '#f97316', fontWeight: 600 }}>
              JR Pass guide for anime fans
            </Link>{' '}
            breaks down the math by trip length.
          </p>
          <p style={pStyle}>
            <strong>Timing the trip</strong> matters more than people expect. Spring (late March
            to early May) has cherry blossoms and the highest crowds — pilgrimage spots get busy
            and collab cafe reservations vanish faster. Late autumn (October to early December)
            is the underrated peak: cool weather, the winter event cycle starts, and cafes line
            up several major collabs around the holiday gifting season. Summer is comiket and
            convention season, but it is also brutally hot and humid, so plan early-morning
            Akihabara visits and evening district walks rather than midday outdoor pilgrimage.
          </p>
          <p style={pStyle}>
            A few practical things every anime fan trip needs: a rolling carry-on with empty
            space for souvenirs, a separate small bag for cafe merch (cafes often hand you bulky
            posters and tote bags), 100-yen coins for{' '}
            <Link href="/articles/gachapon-guide-japan" style={{ color: '#f97316', fontWeight: 600 }}>
              gachapon
            </Link>
            , an eSIM activated before you land so you can pull up Google Maps and reservation
            confirmations the moment you clear customs, and a luggage-forwarding plan — Yamato
            Takkyubin will move your suitcase from hotel to airport overnight for under 3,000 yen,
            which beats hauling it on the train. Shipping merch home through the post office or a
            service like Tenso is cheaper than overweight baggage fees and faster than you would
            expect.
          </p>
        </div>
      );

    case 'area-guides':
      return (
        <div style={introStyle}>
          <p style={pStyle}>
            Tokyo&apos;s pop culture districts each have a specific personality, and figuring out
            which one matches your fandom is the difference between a great day and a confused
            tourist day. The four big ones — <strong>Akihabara, Ikebukuro, Harajuku, and
            Shimokitazawa</strong> — sit roughly fifteen to thirty minutes apart on the Yamanote
            and Chuo lines, and most fans will visit at least two of them on a single trip. They
            cover almost the entire spectrum of what people mean when they say &quot;Tokyo pop
            culture&quot;.
          </p>
          <p style={pStyle}>
            <strong>Akihabara</strong> is the loudest. Electronics on the lower floors, anime and
            gaming on the upper ones, and a maid cafe on every other corner. This is where you go
            for figures, retro games, model kits, doujinshi from comiket leftovers, and the dense
            clusters of gachapon machines that fill entire floors of stores like Gachapon no Mori
            and Yodobashi Camera. Akihabara is the obvious choice for shounen and seinen-leaning
            fans, mecha enthusiasts, retro gaming hunters, and anyone whose collection is built
            around physical merchandise.
          </p>
          <p style={pStyle}>
            <strong>Ikebukuro</strong> is the counterweight. Otome Road on the east side of the
            station is the cultural home of fujoshi, BL, and otome game culture, with Animate&apos;s
            flagship store at one end and a long string of doujinshi shops, butler cafes, and
            character-goods stores along the route. It is also home to the Gashapon Department
            Store inside Sunshine City — at roughly 3,000 machines, the largest in Japan. If the
            words <em>otome</em>, <em>josei</em>, <em>Hetalia</em>, <em>Touken Ranbu</em>, or{' '}
            <em>Hypnosis Mic</em> mean something to you, Ikebukuro is your district.
          </p>
          <p style={pStyle}>
            <strong>Harajuku</strong> is the kawaii and street-fashion side of pop culture.
            Takeshita-dori is the famous teen-fashion strip with crepes, 100-yen accessories, and
            loud street-style brands. The deeper streets behind it — Cat Street and the
            Ura-Harajuku back alleys — have the more serious vintage and designer shops. This is
            where you go for lolita brands, decora accessories, kawaii character goods (Sanrio,
            Chiikawa), and the side of Japanese pop culture that lives in fashion magazines
            rather than figure shelves. <strong>Shimokitazawa</strong>, finally, is the slow one:
            vintage clothing, second-hand bookshops, indie music venues, and small theatres. Less
            anime-specific shopping than Akihabara, but where you find vintage anime tees from
            the 90s, used art books, rare OVAs on disc, and the weird small shops that close
            before lunch and reopen at 5 p.m. on a different street.
          </p>
        </div>
      );

    default:
      return null;
  }
}

function getCategoryAffiliateCTA(category: { slug: string; label: string }) {
  switch (category.slug) {
    case 'collab-cafes':
      return (
        <AffiliateCTA
          icon={<Ticket size={24} strokeWidth={1.8} />}
          title="Book Anime Cafes with Klook"
          description="Reserve your spot at anime collaboration cafes across Japan with English support and free cancellation on most bookings."
          buttonText="Browse Cafe Experiences"
          href={`https://www.klook.com/en-US/experiences?aff_id=${env.NEXT_PUBLIC_KLOOK_AFFILIATE_ID}`}
          program="klook"
          category="collab-cafes"
        />
      );
    case 'anime-pilgrimage':
      return (
        <AffiliateCTA
          icon={<MapPin size={24} strokeWidth={1.8} />}
          title="Get Your JR Pass"
          description="Visit pilgrimage sites across Japan efficiently with Japan Rail Pass. 7, 14, and 21-day options for all holy lands."
          buttonText="Compare JR Pass"
          href={`https://www.klook.com/en-US/activity/japan-rail-pass?aff_id=${env.NEXT_PUBLIC_KLOOK_AFFILIATE_ID}`}
          program="klook"
          category="anime-pilgrimage"
        />
      );
    case 'area-guides':
      return (
        <AffiliateCTA
          icon={<Hotel size={24} strokeWidth={1.8} />}
          title="Find Hotels in Anime Districts"
          description="Stay in the heart of Tokyo's anime neighborhoods — Akihabara, Ikebukuro, Shibuya. Free cancellation on most bookings."
          buttonText="Search Hotels"
          href={`https://www.booking.com/index.html?aid=${env.NEXT_PUBLIC_BOOKING_AFFILIATE_ID}`}
          program="booking"
          category="area-guides"
        />
      );
    case 'travel-tips':
      return (
        <AffiliateCTA
          icon={<Smartphone size={24} strokeWidth={1.8} />}
          title="Get eSIM & Travel Essentials"
          description="Instant eSIM activation, no physical SIM needed. Plus JR Pass, luggage forwarding, IC cards, and budgeting guides."
          buttonText="Shop Travel Essentials"
          href={`https://www.klook.com/en-US/activity/japan-esim?aff_id=${env.NEXT_PUBLIC_KLOOK_AFFILIATE_ID}`}
          program="klook"
          category="travel-tips"
        />
      );
    default:
      return null;
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  const categoryUrl = `https://japan-pop-now.com/category/${slug}`;

  const articles = getArticlesByCategory(slug);
  const firstWithImage = articles.find((a) => a.featuredImage);

  return {
    title: `${category.label} — Japan Pop Now`,
    description: category.description || `Explore all articles about ${category.label.toLowerCase()} on Japan Pop Now.`,
    alternates: {
      canonical: categoryUrl,
    },
    // Hub page: noindex while content depth is being built up.
    // Revisit after adding unique editorial content per category.
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: `${category.label} — Japan Pop Now`,
      description: category.description || `Explore all articles about ${category.label.toLowerCase()} on Japan Pop Now.`,
      type: 'website',
      url: categoryUrl,
      images: firstWithImage
        ? [{ url: firstWithImage.featuredImage, width: 1200, height: 630, alt: `${category.label} articles` }]
        : [{ url: 'https://japan-pop-now.com/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.label} — Japan Pop Now`,
      site: '@pop_now_jp',
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const articles = getArticlesByCategory(category.slug);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category.label, href: `/category/${category.slug}` },
  ];

  return (
    <>
      {/* Structured Data — CollectionPage + ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: category.label,
            description: category.description || `Explore all articles about ${category.label.toLowerCase()} on Japan Pop Now.`,
            url: `https://japan-pop-now.com/category/${slug}`,
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: articles.length,
              itemListElement: articles.map((a, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `https://japan-pop-now.com/articles/${a.slug}`,
                name: a.title,
              })),
            },
          }),
        }}
      />
    <div style={{ background: '#fafaf9' }}>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-3">
        <Breadcrumb items={breadcrumbs} />
      </div>

      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <h1
          style={{
            fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: 700,
            color: '#14213d',
            lineHeight: 1.2,
            marginBottom: '1rem',
          }}
        >
          {category.label}
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#44403c', maxWidth: '720px', lineHeight: 1.7 }}>
          {category.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: '#a8a29e' }}>
            {articles.length} articles
          </span>
          {category.hubSlug && (
            <Link
              href={`/guides/${category.hubSlug}`}
              style={{ fontSize: '0.85rem', color: '#f97316', fontWeight: 600, textDecoration: 'none' }}
            >
              View Complete Guide →
            </Link>
          )}
        </div>
      </section>

      {/* Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <AdUnit slot="6666666601" format="leaderboard" lazy />
      </div>

      {/* Contextual Affiliate CTA */}
      {category && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          {getCategoryAffiliateCTA(category)}
        </div>
      )}

      {/* Editorial intro (per-category prose) */}
      {getCategoryIntro(category.slug) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          {getCategoryIntro(category.slug)}
        </section>
      )}

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                size="md"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p style={{ color: '#78716c', fontSize: '1rem' }}>
              Articles coming soon — we&apos;re working on comprehensive coverage.
            </p>
          </div>
        )}
      </section>

      {/* Cross-category links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div style={{ borderTop: '1px solid #e7e5e4', paddingTop: '2rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: '#14213d',
              marginBottom: '1rem',
            }}
          >
            Explore Other Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="category-strip-link"
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e7e5e4',
                  background: '#fff',
                  color: '#44403c',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {c.label}
              </Link>
            ))}
            <Link
              href="/guides"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#fff7ed',
                border: '1px solid #f97316',
                color: '#f97316',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              All Guides →
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
