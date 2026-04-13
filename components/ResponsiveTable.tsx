'use client';

import { useEffect, useRef, useState } from 'react';

interface ResponsiveTableProps {
  children: React.ReactNode;
  /** Optional: force card layout below this width (default: 640px) */
  breakpoint?: number;
  /** Optional: label for the table (screen readers + mobile card header) */
  label?: string;
}

/**
 * Responsive table wrapper that switches between:
 * - Desktop: standard horizontal-scroll table
 * - Mobile: stacked card layout (each row becomes a card with label:value pairs)
 *
 * Automatically detects <table> children and extracts headers for card labels.
 * Falls back to horizontal scroll if table structure can't be parsed.
 *
 * Usage in MDX/ArticleBody:
 *   Wrap any markdown table — the component reads the DOM and restructures.
 *
 *   <ResponsiveTable label="Chiikawa Bakery at a glance">
 *     | Item | Details |
 *     | --- | --- |
 *     | Location | Tokyu Plaza 3F |
 *     | Hours | 11:00-20:00 |
 *   </ResponsiveTable>
 *
 * Or in JSX (wrapping a <table> element):
 *   <ResponsiveTable>
 *     <table>...</table>
 *   </ResponsiveTable>
 */
export default function ResponsiveTable({
  children,
  breakpoint = 640,
  label,
}: ResponsiveTableProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [tableData, setTableData] = useState<{
    headers: string[];
    rows: string[][];
  } | null>(null);

  // Detect viewport width
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);

  // Parse table from rendered DOM
  useEffect(() => {
    if (!containerRef.current) return;
    const table = containerRef.current.querySelector('table');
    if (!table) return;

    const headerCells = table.querySelectorAll('thead th, thead td, tr:first-child th, tr:first-child td');
    const headers = Array.from(headerCells).map((cell) => cell.textContent?.trim() || '');

    if (headers.length === 0) return;

    const bodyRows = table.querySelectorAll('tbody tr, tr:not(:first-child)');
    const rows: string[][] = [];
    bodyRows.forEach((row) => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length > 0) {
        rows.push(Array.from(cells).map((cell) => cell.textContent?.trim() || ''));
      }
    });

    if (rows.length > 0) {
      setTableData({ headers, rows });
    }
  }, [children]);

  // Mobile: card layout
  if (isMobile && tableData) {
    return (
      <div style={{ margin: '1.5rem 0' }} role="table" aria-label={label}>
        {label && (
          <p
            style={{
              fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
              fontSize: '1rem',
              fontWeight: 700,
              color: '#14213d',
              marginBottom: '12px',
            }}
          >
            {label}
          </p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tableData.rows.map((row, rowIdx) => (
            <div
              key={rowIdx}
              role="row"
              style={{
                background: rowIdx % 2 === 0 ? '#fff' : '#fafaf9',
                border: '1px solid #e7e5e4',
                borderRadius: '8px',
                padding: '12px 16px',
              }}
            >
              {row.map((cell, cellIdx) => (
                <div
                  key={cellIdx}
                  role="cell"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    padding: '4px 0',
                    borderBottom:
                      cellIdx < row.length - 1 ? '1px solid #f5f5f4' : 'none',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#78716c',
                      flexShrink: 0,
                      marginRight: '12px',
                    }}
                  >
                    {tableData.headers[cellIdx] || ''}
                  </span>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      color: '#14213d',
                      textAlign: 'right',
                    }}
                  >
                    {cell}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop: horizontal scroll wrapper with styled table
  return (
    <div
      ref={containerRef}
      style={{
        margin: '1.5rem 0',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
      className="prose-table"
    >
      {/* Hidden container to parse table structure on mount */}
      <div
        ref={!tableData ? containerRef : undefined}
        style={{
          display: tableData && isMobile ? 'none' : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}
