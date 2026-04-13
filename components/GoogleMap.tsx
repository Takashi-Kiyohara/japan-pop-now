'use client';

import { useState } from 'react';

interface GoogleMapProps {
  /** Google Maps Place ID or search query (e.g. "Chiikawa Bakery Harajuku") */
  query: string;
  /** Optional height in px (default: 300) */
  height?: number;
  /** Optional title for accessibility */
  title?: string;
  /** Optional: show a "Get Directions" link below the map */
  directionsFrom?: string;
}

/**
 * Lazy-loaded Google Maps embed for article pages.
 * Uses the free Google Maps Embed API (no API key needed for basic embeds).
 * Renders a placeholder until the user clicks to load (saves bandwidth + CLS).
 *
 * Usage in MDX (via ArticleBody injection):
 *   <GoogleMap query="Chiikawa Bakery Harajuku" title="Chiikawa Bakery location" />
 *
 * Or in JSX:
 *   <GoogleMap query="Tokyu Plaza Omotesando" height={400} directionsFrom="Harajuku Station" />
 */
export default function GoogleMap({
  query,
  height = 300,
  title = 'Map',
  directionsFrom,
}: GoogleMapProps) {
  const [loaded, setLoaded] = useState(false);

  const encodedQuery = encodeURIComponent(query);
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedQuery}`;
  const directionsUrl = directionsFrom
    ? `https://www.google.com/maps/dir/${encodeURIComponent(directionsFrom)}/${encodedQuery}`
    : `https://www.google.com/maps/search/${encodedQuery}`;

  return (
    <div style={{ margin: '1.5rem 0' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: `${height}px`,
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#f5f5f4',
          border: '1px solid #e7e5e4',
        }}
      >
        {loaded ? (
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={title}
          />
        ) : (
          <button
            onClick={() => setLoaded(true)}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              background: '#f5f5f4',
              border: 'none',
              width: '100%',
              height: '100%',
            }}
            aria-label={`Load map for ${query}`}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f97316"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#14213d',
              }}
            >
              Tap to load map
            </span>
            <span style={{ fontSize: '0.75rem', color: '#78716c' }}>{query}</span>
          </button>
        )}
      </div>

      {/* Directions link */}
      <div style={{ marginTop: '8px', textAlign: 'right' }}>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '0.8rem',
            color: '#f97316',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Open in Google Maps &rarr;
        </a>
      </div>
    </div>
  );
}
