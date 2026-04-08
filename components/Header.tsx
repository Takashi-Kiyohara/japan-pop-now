'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Search from './Search';

const NAV_LINKS = [
  { href: '/category/collab-cafes', label: 'Collab Cafes' },
  { href: '/category/anime-pilgrimage', label: 'Pilgrimage' },
  { href: '/category/area-guides', label: 'Area Guides' },
  { href: '/category/travel-tips', label: 'Travel Tips' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add subtle shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: '#fff',
        borderBottom: '1px solid #e7e5e4',
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.07)' : 'none',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {/* Top bar — ultra-thin brand stripe */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, #f97316 0%, #e63946 50%, #14213d 100%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15" style={{ height: '60px' }}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-0.5 select-none">
            <span
              style={{
                fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                fontSize: '1.3rem',
                fontWeight: 800,
                color: '#14213d',
                letterSpacing: '-0.02em',
              }}
            >
              JAPAN
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                fontSize: '1.3rem',
                fontWeight: 800,
                color: '#e63946',
                letterSpacing: '-0.02em',
                margin: '0 2px',
              }}
            >
              POP
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                fontSize: '1.3rem',
                fontWeight: 800,
                color: '#14213d',
                letterSpacing: '-0.02em',
              }}
            >
              NOW
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  color: isActive(link.href) ? '#ea580c' : '#44403c',
                  background: isActive(link.href) ? '#fff7ed' : 'transparent',
                  transition: 'all 0.15s ease',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.href)) {
                    (e.currentTarget as HTMLElement).style.background = '#f5f5f4';
                    (e.currentTarget as HTMLElement).style.color = '#1c1917';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.href)) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = '#44403c';
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Search />

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg"
              style={{ color: '#44403c' }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav
            className="md:hidden py-4"
            style={{ borderTop: '1px solid #e7e5e4' }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'block',
                  padding: '10px 8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: isActive(link.href) ? '#ea580c' : '#44403c',
                  borderBottom: '1px solid #f5f5f4',
                }}
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
