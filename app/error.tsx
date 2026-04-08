'use client';

import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: ErrorProps) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f4',
            padding: '20px',
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              background: '#fff',
              padding: '40px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: '#14213d',
                marginBottom: '16px',
                fontFamily: '"Playfair Display", Georgia, serif',
              }}
            >
              Something Went Wrong
            </h1>

            <p
              style={{
                fontSize: '1rem',
                color: '#78716c',
                marginBottom: '8px',
                lineHeight: '1.6',
              }}
            >
              An unexpected error occurred on the website. Our team has been notified.
            </p>

            {process.env.NODE_ENV === 'development' && error.message && (
              <div
                style={{
                  background: '#f5f5f4',
                  border: '1px solid #d3cfc9',
                  borderRadius: '4px',
                  padding: '12px',
                  margin: '20px 0',
                  fontSize: '0.875rem',
                  color: '#57534e',
                  textAlign: 'left',
                  fontFamily: 'monospace',
                  overflow: 'auto',
                  maxHeight: '200px',
                }}
              >
                <strong>Error details:</strong>
                <pre style={{ margin: '8px 0 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {error.message}
                </pre>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                marginTop: '32px',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={reset}
                style={{
                  padding: '10px 20px',
                  background: '#f97316',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = '1';
                }}
              >
                Try Again
              </button>

              <Link
                href="/"
                style={{
                  padding: '10px 20px',
                  background: '#e7e5e4',
                  color: '#14213d',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = '1';
                }}
              >
                Back to Home
              </Link>
            </div>

            <p
              style={{
                fontSize: '0.875rem',
                color: '#a8a29e',
                marginTop: '24px',
              }}
            >
              Error ID: {error.digest}
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
