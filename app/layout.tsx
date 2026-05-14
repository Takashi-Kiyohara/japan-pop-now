import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Playfair_Display, DM_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ScrollProgress from "@/components/ScrollProgress";
import CookieConsent from "@/components/CookieConsent";
import BackToTop from "@/components/BackToTop";
import WebVitals from '@/components/WebVitals';
import { AUTHOR } from '@/lib/author';
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  colorScheme: "light",
  // R9-L6 (2026-05-10): theme-color signals to mobile browsers (Safari, Chrome
  // Android) what color to paint the URL bar / system chrome. Brand navy keeps
  // the app shell visually consistent on PWA installs and AdSense reviewer
  // mobile previews.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#14213d" },
    { media: "(prefers-color-scheme: dark)", color: "#14213d" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.japan-pop-now.com"),
  title: {
    template: "%s | Japan Pop Now",
    default: "Japan Pop Now — Anime Collab Cafes, Pilgrimage Spots & Pop Culture Travel Guide",
  },
  description:
    "Your ultimate guide to Japan's anime and pop culture scene — collab cafes, pilgrimage spots, area guides, and travel tips for international visitors.",
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.japan-pop-now.com",
    siteName: "Japan Pop Now",
    images: [
      {
        url: "https://www.japan-pop-now.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Japan Pop Now - Your guide to Japan's anime and pop culture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@japanpopnow",
    creator: "@japanpopnow",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  // R13-B3 (2026-05-14): belt-and-suspenders google site verification meta
  // alongside the existing file-method (/google5364a8f3197d1e76.html). Either
  // can satisfy GSC ownership; both means a single missed deploy doesn't
  // cause GSC verification regression.
  verification: {
    google: "5364a8f3197d1e76",
  },
  alternates: {
    canonical: "https://www.japan-pop-now.com",
    languages: {
      en: "https://www.japan-pop-now.com",
      "x-default": "https://www.japan-pop-now.com",
    },
    types: {
      "application/rss+xml": "https://www.japan-pop-now.com/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${dmSans.variable}`}>
      <head>
        {/* hreflang is emitted by Next.js from metadata.alternates.languages per-route.
            Static <link rel="alternate"> here would duplicate per-page entries on
            article/category pages, which Google reads as conflicting hreflang signals. */}

        {/* Preconnect to origins that serve critical render-blocking or high-priority resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        {/* AdSense preconnect only when explicitly enabled — keeps the "we plan to use ads" signal off the page until approval lands */}
        {process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true' && process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        )}

        {/* Structured Data - WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Japan Pop Now",
              url: "https://www.japan-pop-now.com",
              description:
                "Your ultimate guide to Japan's anime and pop culture scene",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://www.japan-pop-now.com/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* Structured Data - Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Japan Pop Now",
              url: "https://www.japan-pop-now.com",
              logo: "https://www.japan-pop-now.com/logo.png",
              sameAs: [AUTHOR.socials.threads, AUTHOR.socials.x],
            }),
          }}
        />

        {/* Structured Data - SiteNavigationElement */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SiteNavigationElement",
              name: "Main Navigation",
              hasPart: [
                { "@type": "WebPage", name: "Collab Cafes", url: "https://www.japan-pop-now.com/category/cafes" },
                { "@type": "WebPage", name: "Destinations", url: "https://www.japan-pop-now.com/category/destinations" },
                { "@type": "WebPage", name: "Experiences", url: "https://www.japan-pop-now.com/category/experiences" },
                { "@type": "WebPage", name: "Calendar", url: "https://www.japan-pop-now.com/calendar" },
                { "@type": "WebPage", name: "Guides", url: "https://www.japan-pop-now.com/guides" },
              ],
            }),
          }}
        />

      </head>
      <body className="min-h-screen flex flex-col bg-[#fafaf9]">
        <WebVitals />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:rounded focus:shadow-lg">
          Skip to content
        </a>
        <GoogleAnalytics />
        <ScrollProgress />
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <div aria-hidden className="h-16 md:hidden" />
        <BackToTop />
        <CookieConsent />
        <BottomNav />

        {/* Google AdSense — gated behind BOTH NEXT_PUBLIC_ADSENSE_ENABLED=true AND
            NEXT_PUBLIC_ADSENSE_ID. Belt-and-suspenders: until approval lands, the
            ENABLED flag stays false in Vercel env so the script never reaches a
            reviewer's HTML. Flip ENABLED=true post-approval. */}
        {process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true' && process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            id="adsense-loader"
            strategy="lazyOnload"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
          />
        )}
      </body>
    </html>
  );
}
