import type { Metadata, Viewport } from "next";
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
  alternates: {
    canonical: "https://www.japan-pop-now.com",
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
        {/* hreflang — English primary, x-default */}
        <link rel="alternate" hrefLang="en" href="https://www.japan-pop-now.com" />
        <link rel="alternate" hrefLang="x-default" href="https://www.japan-pop-now.com" />

        {/* Preconnect to origins that serve critical render-blocking or high-priority resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />

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
                { "@type": "WebPage", name: "Collab Cafes", url: "https://www.japan-pop-now.com/category/collab-cafes" },
                { "@type": "WebPage", name: "Anime Pilgrimage", url: "https://www.japan-pop-now.com/category/anime-pilgrimage" },
                { "@type": "WebPage", name: "Area Guides", url: "https://www.japan-pop-now.com/category/area-guides" },
                { "@type": "WebPage", name: "Travel Tips", url: "https://www.japan-pop-now.com/category/travel-tips" },
                { "@type": "WebPage", name: "Guides", url: "https://www.japan-pop-now.com/guides" },
              ],
            }),
          }}
        />

        {/* Google AdSense — loaded dynamically via env var */}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
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
      </body>
    </html>
  );
}
