'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/category/collab-cafes', label: 'Collab Cafes' },
  { href: '/category/anime-pilgrimage', label: 'Anime Pilgrimage' },
  { href: '/category/area-guides', label: 'Area Guides' },
  { href: '/category/travel-tips', label: 'Travel Tips' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e8e6e3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-2xl" style={{ color: '#c2185b' }}>●</span>
            <span>JAPAN</span>
            <span style={{ color: '#c2185b' }}>POP</span>
            <span>NOW</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-[#c2185b] border-b-2 border-[#c2185b] pb-1'
                    : 'text-[#1a1f36] hover:text-[#c2185b]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-[#e8e6e3]">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 text-sm font-medium ${
                  isActive(link.href)
                    ? 'text-[#c2185b]'
                    : 'text-[#1a1f36]'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
