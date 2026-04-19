'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark as BookmarkIcon, BookmarkX } from 'lucide-react';

type SavedItem = {
  slug: string;
  title: string;
  savedAt: string;
};

const STORAGE_KEY = 'jpn_bookmarks';

function readBookmarks(): SavedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedItem[]) : [];
  } catch {
    return [];
  }
}

function writeBookmarks(list: SavedItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // localStorage quota or disabled — silent best-effort
  }
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diffMs = Date.now() - then;
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function BookmarksPage() {
  const [items, setItems] = useState<SavedItem[] | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with localStorage on mount
    setItems(readBookmarks().sort((a, b) => b.savedAt.localeCompare(a.savedAt)));
  }, []);

  const remove = (slug: string) => {
    setItems((curr) => {
      const next = (curr ?? []).filter((x) => x.slug !== slug);
      writeBookmarks(next);
      return next;
    });
  };

  if (items === null) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-brand-navy mb-2">
          Saved articles
        </h1>
        <p className="text-sm text-neutral-500">Loading your saved list&hellip;</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-brand-navy mb-2">
        Saved articles
      </h1>
      <p className="text-sm text-neutral-500 mb-8">
        Articles you bookmarked on this device. Saved locally, never synced.
      </p>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
          <BookmarkIcon
            className="w-10 h-10 text-neutral-300 mx-auto mb-3"
            aria-hidden
          />
          <h2 className="font-display text-xl font-bold text-neutral-900 mb-2">
            Nothing saved yet
          </h2>
          <p className="text-sm text-neutral-500 mb-5">
            Tap the bookmark button on any article to save it here for later.
          </p>
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 bg-accent-600 text-white
                       text-sm font-semibold px-4 py-2.5 rounded-xl
                       hover:opacity-90 transition-opacity min-h-[44px]"
          >
            Browse all articles
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white overflow-hidden">
          {items.map((item) => (
            <li
              key={item.slug}
              className="flex items-center gap-3 py-4 px-4 min-h-[56px]"
            >
              <Link
                href={`/articles/${item.slug}`}
                className="flex-1 min-w-0 hover:underline decoration-accent-600/60 underline-offset-2"
              >
                <div className="font-semibold text-neutral-900 text-sm leading-snug">
                  {item.title}
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  Saved {formatRelative(item.savedAt)}
                </div>
              </Link>
              <button
                onClick={() => remove(item.slug)}
                aria-label={`Remove ${item.title} from saved`}
                className="p-2 rounded-lg text-neutral-400 hover:text-brand-red
                           hover:bg-neutral-100 transition-colors
                           min-h-[44px] min-w-[44px]
                           flex items-center justify-center shrink-0"
              >
                <BookmarkX size={18} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
