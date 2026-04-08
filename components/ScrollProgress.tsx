'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  const isArticlePage = pathname.startsWith('/articles/');

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.scrollY;
      const scrollProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setProgress(Math.min(scrollProgress, 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isArticlePage) return null;

  return (
    <>
      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 h-0.5 z-50"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #f97316, #e63946)',
          transition: 'width 0.1s ease-out',
        }}
      />
      {/* Progress % indicator — shows after 10% scroll */}
      {progress > 10 && progress < 95 && (
        <div
          className="fixed z-50"
          style={{
            bottom: '20px',
            right: '20px',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#14213d',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            fontWeight: 700,
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            opacity: 0.9,
          }}
        >
          {Math.round(progress)}%
        </div>
      )}
    </>
  );
}
