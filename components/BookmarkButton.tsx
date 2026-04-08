'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface BookmarkButtonProps {
  slug: string;
  title: string;
}

export default function BookmarkButton({ slug, title }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('jpn_bookmarks') || '[]');
      setSaved(bookmarks.some((b: { slug: string }) => b.slug === slug));
    } catch {
      // localStorage not available
    }
  }, [slug]);

  const toggle = () => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('jpn_bookmarks') || '[]');
      if (saved) {
        const filtered = bookmarks.filter((b: { slug: string }) => b.slug !== slug);
        localStorage.setItem('jpn_bookmarks', JSON.stringify(filtered));
        setSaved(false);
      } else {
        bookmarks.push({ slug, title, savedAt: new Date().toISOString() });
        localStorage.setItem('jpn_bookmarks', JSON.stringify(bookmarks));
        setSaved(true);
      }

      // GA4 tracking
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', saved ? 'bookmark_remove' : 'bookmark_add', {
          article_slug: slug,
        });
      }
    } catch {
      // localStorage not available
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={saved ? 'Remove bookmark' : 'Save article'}
      title={saved ? 'Saved' : 'Save for later'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '8px',
        border: `1px solid ${saved ? '#f97316' : '#e7e5e4'}`,
        background: saved ? '#fff7ed' : '#fff',
        color: saved ? '#f97316' : '#78716c',
        fontSize: '0.8rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
