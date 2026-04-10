'use client';

import { useEffect, useRef } from 'react';
import { env } from '@/lib/env';

interface GiscusCommentsProps {
  slug: string;
}

export default function GiscusComments({ slug }: GiscusCommentsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  const repoId = env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const categoryId = env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  useEffect(() => {
    // Don't load if Giscus is not configured
    if (!repoId || !categoryId || loaded.current || !ref.current) return;
    loaded.current = true;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'Takashi-Kiyohara/japan-pop-now');
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', 'Article Comments');
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', 'specific');
    script.setAttribute('data-term', slug);
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', 'light');
    script.setAttribute('data-lang', 'en');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;

    ref.current.appendChild(script);
  }, [slug, repoId, categoryId]);

  // Don't render anything if Giscus is not configured
  if (!repoId || !categoryId) return null;

  return (
    <section className="mt-12 pt-8" style={{ borderTop: '1px solid #e7e5e4' }}>
      <div className="flex items-center gap-4 mb-6">
        <div style={{ width: '4px', height: '24px', background: '#f97316', borderRadius: '2px' }} />
        <h2
          style={{
            fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
            fontSize: '1.3rem',
            fontWeight: 700,
            color: '#14213d',
          }}
        >
          Comments
        </h2>
      </div>
      <div ref={ref} />
    </section>
  );
}
