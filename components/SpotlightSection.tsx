'use client';

import Image from 'next/image';
import Link from 'next/link';

export interface SpotlightItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  articleSlug: string;
  image: string;
  imageAlt: string;
  badge?: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

function isSpotlightActive(item: SpotlightItem): boolean {
  if (!item.active) return false;
  const now = new Date();
  const start = new Date(item.startDate);
  const end = new Date(item.endDate + 'T23:59:59');
  return now >= start && now <= end;
}

export default function SpotlightSection({ items }: { items: SpotlightItem[] }) {
  const activeItems = items.filter(isSpotlightActive);
  if (activeItems.length === 0) return null;

  const spot = activeItems[0];

  return (
    <section style={{ background: '#fff', borderBottom: '1px solid #e7e5e4' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div
              style={{
                width: '4px',
                height: '28px',
                background: 'linear-gradient(180deg, #f59e0b, #d97706)',
                borderRadius: '2px',
                flexShrink: 0,
              }}
            />
            <div className="flex items-center gap-3">
              <h2
                style={{
                  fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  color: '#14213d',
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                Spotlight
              </h2>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#92400e',
                  background: '#fef3c7',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  lineHeight: 1.4,
                }}
              >
                Featured
              </span>
            </div>
          </div>
        </div>

        {/* Spotlight card */}
        <Link
          href={`/articles/${spot.articleSlug}`}
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
        >
          <div
            className="grid grid-cols-1 lg:grid-cols-5 gap-0 overflow-hidden"
            style={{
              borderRadius: '12px',
              border: '1px solid #e7e5e4',
              background: '#fff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            }}
          >
            {/* Image */}
            <div className="lg:col-span-3" style={{ position: 'relative', minHeight: '280px' }}>
              <Image
                src={spot.image}
                alt={spot.imageAlt}
                fill
                style={{ objectFit: 'cover', objectPosition: 'center 33%' }}
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              {spot.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: '#f59e0b',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: '4px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {spot.badge}
                </span>
              )}
            </div>

            {/* Text */}
            <div
              className="lg:col-span-2 flex flex-col justify-start"
              style={{ padding: '32px', wordBreak: 'break-word', overflowWrap: 'anywhere' }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#d97706',
                  marginBottom: '8px',
                }}
              >
                Spotlight
              </p>
              <h3
                style={{
                  fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#14213d',
                  lineHeight: 1.25,
                  marginBottom: '6px',
                }}
              >
                {spot.title}
              </h3>
              <p
                style={{
                  fontSize: '1rem',
                  color: '#57534e',
                  fontWeight: 500,
                  marginBottom: '12px',
                  lineHeight: 1.4,
                }}
              >
                {spot.tagline}
              </p>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: '#78716c',
                  lineHeight: 1.6,
                  marginBottom: '20px',
                }}
              >
                {spot.description}
              </p>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#d97706',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                Read full guide
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
