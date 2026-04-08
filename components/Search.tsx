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

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const indexRef = useRef<Index | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<(HTMLAnchorElement | null)[]>([]);

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
        (globalThis as any).__articlesMap = articlesMap;
      } catch (error) {
        console.error('Failed to initialize search index:', error);
      }
    };

    if (!indexRef.current) {
      initializeIndex();
    }
  }, []);

  // Search function
  const handleSearch = useCallback((searchQuery: string) => {
    if (!indexRef.current || !searchQuery.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    try {
      const searchResults = indexRef.current.search(searchQuery, {
        limit: 10,
      }) as string[];

      // Get articles from stored map
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
        className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-[#c2185b] transition-colors"
        title="Press Cmd+K or Ctrl+K to search"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
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
            className="bg-white rounded-lg shadow-lg w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="border-b border-gray-200 p-4">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search articles..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                className="w-full px-0 py-2 text-lg focus:outline-none bg-transparent"
              />
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading && (
                <div className="p-8 text-center text-gray-500">
                  Loading...
                </div>
              )}

              {!isLoading && query && results.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No results for "{query}"
                </div>
              )}

              {!isLoading && !query && (
                <div className="p-8 text-center text-gray-500">
                  Start typing to search...
                </div>
              )}

              {!isLoading && results.length > 0 && (
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
                            <h3 className="font-semibold text-[#1a1f36] group-hover:text-[#c2185b]">
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
                    <span className="font-semibold">↑↓</span> Navigate
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
