'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

const MAX_VISIBLE = 6;

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [expanded, setExpanded] = useState(false);

  // Only show h2 headings (level 2) for cleaner TOC
  const h2Headings = headings.filter((h) => h.level === 2);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -66% 0px' }
    );

    h2Headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [h2Headings]);

  if (h2Headings.length === 0) return null;

  const visibleHeadings = expanded ? h2Headings : h2Headings.slice(0, MAX_VISIBLE);
  const hasMore = h2Headings.length > MAX_VISIBLE;

  return (
    <nav>
      <h3
        className="mb-3"
        style={{
          fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
          fontSize: '0.95rem',
          fontWeight: 700,
          color: '#14213d',
        }}
      >
        On This Page
      </h3>

      <ul
        style={{
          maxHeight: expanded ? 'none' : '240px',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease',
        }}
      >
        {visibleHeadings.map((heading, i) => (
          <li key={heading.id}>
            <Link
              href={`#${heading.id}`}
              className="block py-1.5 text-sm transition-colors leading-snug"
              style={{
                color: activeId === heading.id ? '#f97316' : '#78716c',
                fontWeight: activeId === heading.id ? 600 : 400,
                borderLeft: activeId === heading.id ? '2px solid #f97316' : '2px solid transparent',
                paddingLeft: '10px',
              }}
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            marginTop: '8px',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#f97316',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {expanded ? '− Show less' : `+ ${h2Headings.length - MAX_VISIBLE} more sections`}
        </button>
      )}
    </nav>
  );
}
