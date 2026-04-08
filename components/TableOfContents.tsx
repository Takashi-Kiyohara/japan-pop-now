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

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(true);

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

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[#1a1f36] uppercase tracking-wide">
          On This Page
        </h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[#c2185b] hover:opacity-80 transition-opacity"
          aria-label="Toggle table of contents"
        >
          {isOpen ? '−' : '+'}
        </button>
      </div>

      {isOpen && (
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }}
            >
              <Link
                href={`#${heading.id}`}
                className={`block py-1 px-2 rounded transition-colors ${
                  activeId === heading.id
                    ? 'text-[#c2185b] bg-pink-50 font-semibold'
                    : 'text-gray-600 hover:text-[#c2185b]'
                }`}
              >
                {heading.text}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
