import Link from 'next/link';
import {
  BookOpen,
  Compass,
  Coffee,
  HelpCircle,
  Info,
  Mail,
  Map,
  Search as SearchIcon,
  Shield,
  Sparkles,
  Tag,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu',
  description:
    'Every section of Japan Pop Now — browse articles, categories, guides, features, and about pages in one place.',
  alternates: { canonical: 'https://www.japan-pop-now.com/menu' },
  // R15 fix E (2026-05-14): /menu is intentionally excluded from sitemap.ts
  // (navigation aid with thin content). Add noindex to align meta tag with
  // sitemap absence — prevents Google from indexing it via internal-link
  // discovery and earning the sitemap-vs-meta-tag contradiction signal.
  robots: { index: false, follow: true },
};

type Section = {
  title: string;
  items: { href: string; Icon: LucideIcon; label: string; desc?: string }[];
};

const SECTIONS: Section[] = [
  {
    title: 'Browse',
    items: [
      { href: '/articles', Icon: BookOpen, label: 'All articles', desc: 'Latest pop culture stories' },
      { href: '/search', Icon: SearchIcon, label: 'Search', desc: 'Find anything on the site' },
      { href: '/tags', Icon: Tag, label: 'Tags', desc: 'Browse by topic' },
    ],
  },
  {
    title: 'Categories',
    items: [
      { href: '/category/cafes', Icon: Coffee, label: 'Collab Cafes' },
      { href: '/category/destinations', Icon: Map, label: 'Destinations' },
      { href: '/category/experiences', Icon: Sparkles, label: 'Experiences' },
    ],
  },
  {
    title: 'Editorial',
    items: [
      { href: '/features', Icon: Sparkles, label: 'Features', desc: 'In-depth series' },
      { href: '/guides', Icon: BookOpen, label: 'Guides', desc: 'How-tos and itineraries' },
    ],
  },
  {
    title: 'About',
    items: [
      { href: '/about', Icon: Info, label: 'About Takashi Kiyohara' },
      { href: '/contact', Icon: Mail, label: 'Contact' },
      { href: '/support', Icon: HelpCircle, label: 'Support' },
      { href: '/privacy', Icon: Shield, label: 'Privacy policy' },
    ],
  },
];

export default function MenuPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-brand-navy mb-2">Explore</h1>
      <p className="text-sm text-neutral-500 mb-8">
        Every section of Japan Pop Now.
      </p>
      <div className="space-y-8">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500 mb-3 px-1">
              {section.title}
            </h2>
            <ul className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white overflow-hidden">
              {section.items.map(({ href, Icon, label, desc }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-4 py-4 px-4 min-h-[56px]
                               transition-colors active:bg-accent-50 hover:bg-neutral-50"
                  >
                    <Icon aria-hidden className="w-5 h-5 shrink-0 text-accent-600" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-neutral-900 text-sm">{label}</div>
                      {desc && <div className="text-xs text-neutral-500 mt-0.5">{desc}</div>}
                    </div>
                    <span className="text-neutral-400 text-lg" aria-hidden>›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
