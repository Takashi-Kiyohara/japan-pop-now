import Link from 'next/link';

const FOOTER_LINKS = [
  { href: '/', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '/category/collab-cafes', label: 'Collab Cafes' },
  { href: '/category/area-guides', label: 'Area Guides' },
  { href: '/category/anime-pilgrimage', label: 'Pilgrimage' },
  { href: '/category/travel-tips', label: 'Travel Tips' },
  { href: '#contact', label: 'Contact' },
  { href: '#privacy', label: 'Privacy Policy' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1f36] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo and Tagline */}
        <div className="mb-8">
          <div className="flex items-center gap-2 font-bold text-lg mb-2">
            <span className="text-2xl" style={{ color: '#c2185b' }}>●</span>
            <span>JAPAN POP NOW</span>
          </div>
          <p className="text-gray-300 text-sm">Tokyo Pop Culture Guide for International Visitors</p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-300 hover:text-white text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex gap-4 mb-8">
          <a
            href="https://twitter.com/japanpopnow"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition-colors"
            aria-label="Twitter"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8">
          <p className="text-gray-400 text-sm text-center">
            Copyright {currentYear} Japan Pop Now. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
