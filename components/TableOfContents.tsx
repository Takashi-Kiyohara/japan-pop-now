'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [expanded, setExpanded] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Filter to H2 and H3 only
  const tocHeadings = headings.filter((h) => h.level === 2 || h.level === 3);

  // Track active heading with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-20px 0px -60% 0px', threshold: 0 }
    );

    tocHeadings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tocHeadings]);

  // Auto-expand if active heading is beyond the fold
  useEffect(() => {
    if (!expanded) {
      const activeIndex = tocHeadings.findIndex((h) => h.id === activeId);
      if (activeIndex >= 6) setExpanded(true); // eslint-disable-line react-hooks/set-state-in-effect -- intentional: reveal hidden headings
    }
  }, [activeId, expanded, tocHeadings]);

  if (tocHeadings.length === 0) return null;

  const INITIAL_SHOW = 8; // Show more initially for better usability
  const visibleHeadings = expanded ? tocHeadings : tocHeadings.slice(0, INITIAL_SHOW);
  const hasMore = tocHeadings.length > INITIAL_SHOW;

  return (
    <nav ref={navRef} aria-label="On This Page">
      <h3
        style={{
          fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
          fontSize: '0.9rem',
          fontWeight: 700,
          color: '#14213d',
          marginBottom: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        On This Page
      </h3>

      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {visibleHeadings.map((heading) => {
          const isH3 = heading.level === 3;
          const isActive = activeId === heading.id;

          return (
            <li
              key={heading.id}
              style={{
                paddingLeft: isH3 ? '16px' : '0',
                borderLeft: isH3 ? '1px solid #e7e5e4' : 'none',
                marginLeft: isH3 ? '8px' : '0',
              }}
            >
              <Link
                href={`#${heading.id}`}
                style={{
                  display: 'block',
                  padding: isH3 ? '3px 8px 3px 10px' : '5px 0 5px 10px',
                  fontSize: isH3 ? '0.78rem' : '0.82rem',
                  fontWeight: isActive ? 700 : isH3 ? 400 : 500,
                  color: isActive ? '#f97316' : isH3 ? '#78716c' : '#44403c',
                  borderLeft: !isH3
                    ? `2px solid ${isActive ? '#f97316' : 'transparent'}`
                    : 'none',
                  lineHeight: 1.4,
                  transition: 'color 0.15s ease, border-color 0.15s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = '#ea580c';
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLAnchorElement).style.color = isH3 ? '#78716c' : '#44403c';
                }}
              >
                {heading.text}
              </Link>
            </li>
          );
        })}
      </ul>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            marginTop: '8px',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#f97316',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {expanded ? '− Less' : `+ ${tocHeadings.length - INITIAL_SHOW} more`}
        </button>
      )}
    </nav>
  );
}
