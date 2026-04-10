'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search as SearchIcon } from 'lucide-react';

interface SearchResult {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch('/api/search-index');
      const articles: SearchResult[] = await res.json();
      const lower = q.toLowerCase();
      const filtered = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(lower) ||
          a.excerpt.toLowerCase().includes(lower) ||
          a.category.toLowerCase().includes(lower)
      );
      setResults(filtered);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ minHeight: '60vh' }}>
      <h1
        style={{
          fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
          fontSize: '2rem',
          fontWeight: 700,
          color: '#14213d',
          marginBottom: '1.5rem',
        }}
      >
        Search
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(query);
        }}
        style={{ display: 'flex', gap: '8px', marginBottom: '2rem' }}
      >
        <div style={{ flex: 1, position: 'relative' }}>
          <SearchIcon
            size={18}
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#a8a29e' }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            style={{
              width: '100%',
              padding: '12px 12px 12px 42px',
              borderRadius: '8px',
              border: '1px solid #e7e5e4',
              fontSize: '1rem',
              background: '#fff',
            }}
            className="focus:outline-none focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-2"
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            background: '#f97316',
            color: '#fff',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </form>

      {loading && <p style={{ color: '#78716c' }}>Searching...</p>}

      {!loading && searched && results.length === 0 && (
        <p style={{ color: '#78716c' }}>No results found for &ldquo;{query}&rdquo;. Try a different search term.</p>
      )}

      {results.length > 0 && (
        <div>
          <p style={{ fontSize: '0.85rem', color: '#a8a29e', marginBottom: '1rem' }}>
            {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {results.map((r) => (
              <li
                key={r.slug}
                style={{ borderBottom: '1px solid #f5f5f4', padding: '16px 0' }}
              >
                <Link
                  href={`/articles/${r.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#14213d', marginBottom: '4px' }}>
                    {r.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#78716c', lineHeight: 1.6 }}>
                    {r.excerpt}
                  </p>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#f97316',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em',
                    }}
                  >
                    {r.category}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-12" style={{ minHeight: '60vh' }}><p style={{ color: '#78716c' }}>Loading search...</p></div>}>
      <SearchContent />
    </Suspense>
  );
}
