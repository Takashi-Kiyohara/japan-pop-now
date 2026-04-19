import Link from 'next/link';
import { AUTHOR } from '@/lib/author';

const SITE_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/category/cafes', label: 'Collab Cafes' },
  { href: '/category/destinations', label: 'Destinations' },
  { href: '/category/experiences', label: 'Experiences' },
  { href: '/calendar', label: 'Events Calendar' },
  { href: '/features', label: 'Features' },
  { href: '/guides', label: 'All Guides' },
  { href: '/search', label: 'Search' },
];

const COMPANY_LINKS = [
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/support', label: 'Support Us' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/affiliate-disclosure', label: 'Affiliate Disclosure' },
];

const THREADS_SVG =
  'M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.781 3.631 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291.926-.052 2.01-.06 3.245.08-.13-.991-.494-1.778-1.084-2.348-.81-.781-2.005-1.179-3.554-1.184h-.027c-1.246 0-2.937.342-4.013 1.946L7.46 8.586c1.444-2.149 3.78-3.357 6.561-3.357h.041c4.682.029 7.471 2.948 7.749 8.027.159.066.32.135.474.207 2.221 1.042 3.853 2.62 4.69 4.55.952 2.224.997 5.851-2.18 9.071-2.471 2.476-5.504 3.583-9.014 3.616zm.583-13.094c-.27 0-.546.005-.83.018-1.836.105-2.978.945-2.916 2.082.064 1.183 1.358 1.715 2.604 1.65 1.35-.075 2.953-.46 3.226-3.435-.66-.155-1.371-.235-2.083-.235z';

const X_SVG =
  'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z';

const SOCIAL_LINKS = [
  { href: AUTHOR.socials.threads, label: 'Threads', svg: THREADS_SVG },
  { href: AUTHOR.socials.x, label: 'X', svg: X_SVG },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: '#14213d' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-0.5 mb-3">
              <span style={{
                fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                fontSize: '1.1rem', fontWeight: 800, color: '#fff',
              }}>JAPAN</span>
              <span style={{
                fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                fontSize: '1.1rem', fontWeight: 800, color: '#e63946', margin: '0 2px',
              }}>POP</span>
              <span style={{
                fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                fontSize: '1.1rem', fontWeight: 800, color: '#fff',
              }}>NOW</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Your guide to Japan&apos;s anime cafes, pilgrimage spots, and pop culture for international visitors.
            </p>
          </div>

          {/* Site Links */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#fb923c' }}>
              Explore
            </h4>
            <ul className="space-y-2">
              {SITE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#fb923c' }}>
              Company
            </h4>
            <ul className="space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#fb923c' }}>
              Follow Us
            </h4>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  <svg className="w-4 h-4" fill="rgba(255,255,255,0.75)" viewBox="0 0 24 24">
                    <path d={social.svg} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
            &copy; {currentYear} Japan Pop Now. All rights reserved.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
            Some links are affiliate links. We may earn a commission at no extra cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
}
