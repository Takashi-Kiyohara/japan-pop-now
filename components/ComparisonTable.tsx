/**
 * ComparisonTable — Styled responsive table for comparing venues, products, etc.
 *
 * Usage:
 * <ComparisonTable
 *   headers={['Feature', 'Tokyo Tower', 'Skytree']}
 *   rows={[
 *     ['Height', '333m', '634m'],
 *     ['Price', '¥1,200', '¥2,100'],
 *     ['Best for', 'Sunset views', 'Night views'],
 *   ]}
 * />
 */

interface ComparisonTableProps {
  headers: string[];
  rows: string[][];
  caption?: string;
  highlightCol?: number; // 1-indexed column to highlight as "recommended"
}

export default function ComparisonTable({
  headers,
  rows,
  caption,
  highlightCol,
}: ComparisonTableProps) {
  return (
    <div
      style={{
        margin: '24px 0',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e7e5e4',
      }}
    >
      {caption && (
        <div
          style={{
            padding: '10px 16px',
            background: '#14213d',
            color: '#fff',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          {caption}
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    background: highlightCol === i + 1 ? '#fff7ed' : '#f5f5f4',
                    color: highlightCol === i + 1 ? '#f97316' : '#44403c',
                    borderBottom: '2px solid #e7e5e4',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                  {highlightCol === i + 1 && (
                    <span
                      style={{
                        marginLeft: '6px',
                        fontSize: '0.7rem',
                        background: '#f97316',
                        color: '#fff',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        verticalAlign: 'middle',
                      }}
                    >
                      Top Pick
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: '10px 16px',
                      borderBottom: ri < rows.length - 1 ? '1px solid #f5f5f4' : 'none',
                      background: highlightCol === ci + 1 ? '#fffbf5' : '#fff',
                      color: ci === 0 ? '#14213d' : '#44403c',
                      fontWeight: ci === 0 ? 600 : 400,
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
