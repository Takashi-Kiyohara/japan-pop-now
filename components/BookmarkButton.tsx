'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface BookmarkButtonProps {
  slug: string;
  title: string;
}

interface Bookmark {
  slug: string;
  title: string;
  savedAt: string;
}

const getBookmarks = (): Bookmark[] => {
  try {
    const stored = localStorage.getItem('jpn_bookmarks');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to read bookmarks:', error);
    return [];
  }
};

const saveBookmarks = (bookmarks: Bookmark[]): boolean => {
  try {
    localStorage.setItem('jpn_bookmarks', JSON.stringify(bookmarks));
    return true;
  } catch (error) {
    console.warn('Failed to save bookmarks:', error);
    return false;
  }
};

export default function BookmarkButton({ slug, title }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const bookmarks = getBookmarks();
    setSaved(bookmarks.some((b) => b.slug === slug));
  }, [slug]);

  const toggle = () => {
    const bookmarks = getBookmarks();
    const isSaved = bookmarks.some((b) => b.slug === slug);

    if (isSaved) {
      const filtered = bookmarks.filter((b) => b.slug !== slug);
      if (saveBookmarks(filtered)) {
        setSaved(false);
      }
    } else {
      bookmarks.push({ slug, title, savedAt: new Date().toISOString() });
      if (saveBookmarks(bookmarks)) {
        setSaved(true);
      }
    }

    // GA4 tracking
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', isSaved ? 'bookmark_remove' : 'bookmark_add', {
        article_slug: slug,
      });
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
      {saved ? <BookmarkCheck size={16} aria-hidden="true" /> : <Bookmark size={16} aria-hidden="true" />}
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
