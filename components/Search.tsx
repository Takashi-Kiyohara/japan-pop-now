'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Index } from 'flexsearch';

interface SearchResult {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
}

const QUERY_MAX_LENGTH = 200;

/**
 * Sanitize search query: strip HTML tags and trim whitespace
 */
const sanitizeSearchQuery = (query: string): string => {
  return query
    .trim()
    .slice(0, QUERY_MAX_LENGTH)
    .replace(/<[^>]*>/g, ''); // Remove HTML tags
};

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const indexRef = useRef<Index | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Initialize search index
  useEffect(() => {
    const initializeIndex = async () => {
      try {
        const response = await fetch('/api/search-index');
        const articles: SearchResult[] = await response.json();

        // Store articles in a map for lookup
        const articlesMap = new Map(articles.map((a) => [a.slug, a]));

        const index = new Index({
          tokenize: 'full',
        });

        // Index articles by slug
        articles.forEach((article) => {
          // Combine title and excerpt for better search
          const searchText = `${article.title} ${article.excerpt} ${article.category}`;
          index.add(article.slug, searchText);
        });

        indexRef.current = index;

        // Store articles map globally for result lookup
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).__articlesMap = articlesMap;
      } catch (error) {
        console.error('Failed to initialize search index:', error);
      }
    };

    if (!indexRef.current) {
      initializeIndex();
    }
  }, []);

  // Search function - executes on debounced query
  const handleSearch = useCallback((searchQuery: string) => {
    const sanitized = sanitizeSearchQuery(searchQuery);

    if (!indexRef.current || !sanitized) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    try {
      const searchResults = indexRef.current.search(sanitized, {
        limit: 10,
      }) as string[];

      // Get articles from stored map
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const articlesMap = (globalThis as any).__articlesMap as Map<string, SearchResult>;
      if (articlesMap) {
        const matched = searchResults
          .map((slug) => articlesMap.get(slug))
          .filter(Boolean) as SearchResult[];

        setResults(matched);
        setSelectedIndex(0);
      }
    } catch (error) {
      console.error('Failed to search:', error);
    }
  }, []);

  // Trigger search when debounced query changes
  useEffect(() => {
    handleSearch(debouncedQuery); // eslint-disable-line react-hooks/set-state-in-effect -- triggers search results update on debounced input
  }, [debouncedQuery, handleSearch]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }

      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          setIsOpen(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            const result = resultsRef.current[selectedIndex];
            result?.click();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Scroll selected result into view
  useEffect(() => {
    resultsRef.current[selectedIndex]?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <>
      {/* Search Button in Header */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-[#f97316] transition-colors"
        title="Press Cmd+K or Ctrl+K to search"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span className="hidden lg:inline">Search</span>
        <span className="text-xs text-gray-400 ml-1">⌘K</span>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20"
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search articles"
            className="bg-white rounded-lg shadow-lg w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="border-b border-gray-200 p-4">
              <input
                ref={inputRef}
                type="text"
                aria-label="Search articles"
                placeholder="Search articles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-0 py-2 text-lg focus:outline-none focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-2 bg-transparent"
              />
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {query && results.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No results for &quot;{query}&quot;
                </div>
              )}

              {!query && (
                <div className="p-8 text-center text-gray-500">
                  Start typing to search...
                </div>
              )}

              {results.length > 0 && (
                <ul className="divide-y divide-gray-200">
                  {results.map((result, idx) => (
                    <li key={result.slug}>
                      <Link
                        ref={(el) => {
                          resultsRef.current[idx] = el;
                        }}
                        href={`/articles/${result.slug}`}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-3 hover:bg-gray-50 transition-colors ${
                          selectedIndex === idx ? 'bg-gray-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#1a1f36] group-hover:text-[#f97316]">
                              {result.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {result.excerpt}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded whitespace-nowrap flex-shrink-0">
                            {result.category}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {results.length > 0 && (
              <div className="border-t border-gray-200 p-3 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
                <div className="flex gap-4">
                  <span>
                    <span className="font-semibold">{String.fromCharCode(8593, 8595)}</span> Navigate
                  </span>
                  <span>
                    <span className="font-semibold">⏎</span> Select
                  </span>
                  <span>
                    <span className="font-semibold">esc</span> Close
                  </span>
                </div>
                <span>{results.length} result(s)</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
