import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ScrollProgress from "@/components/ScrollProgress";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://japan-pop-now.com"),
  title: {
    template: "%s | Japan Pop Now",
    default: "Japan Pop Now",
  },
  description:
    "Your ultimate guide to Japan's anime and pop culture scene — collab cafes, pilgrimage spots, area guides, and travel tips for international visitors.",
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://japan-pop-now.com",
    siteName: "Japan Pop Now",
    images: [
      {
        url: "https://japan-pop-now.com/og-image.png",
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
    canonical: "https://japan-pop-now.com",
    types: {
      "application/rss+xml": "https://japan-pop-now.com/feed.xml",
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
        {/* Structured Data - WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Japan Pop Now",
              url: "https://japan-pop-now.com",
              description:
                "Your ultimate guide to Japan's anime and pop culture scene",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://japan-pop-now.com/search?q={search_term_string}",
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
              url: "https://japan-pop-now.com",
              logo: "https://japan-pop-now.com/logo.png",
              sameAs: ["https://twitter.com/japanpopnow"],
            }),
          }}
        />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#fafaf9]">
        <GoogleAnalytics />
        <ScrollProgress />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
