'use client';

import { useEffect, useRef, useState } from 'react';

type AdFormat = 'auto' | 'rectangle' | 'leaderboard' | 'sticky-sidebar';

interface AdUnitProps {
  slot: string;
  format?: AdFormat;
  className?: string;
  lazy?: boolean;
}

const formatDimensions: Record<AdFormat, { width: string; minHeight: string }> = {
  auto: { width: '100%', minHeight: '100px' },
  rectangle: { width: '300px', minHeight: '250px' },
  leaderboard: { width: '100%', minHeight: '90px' },
  'sticky-sidebar': { width: '300px', minHeight: '600px' },
};

export default function AdUnit({
  slot,
  format = 'auto',
  className = '',
  lazy = true,
}: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!lazy);
  const [adLoaded, setAdLoaded] = useState(false);

  // Lazy load: only render ad when near viewport
  useEffect(() => {
    if (!lazy || !adRef.current) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(adRef.current);
    return () => observer.disconnect();
  }, [lazy]);

  // Push ad when visible
  useEffect(() => {
    if (!isVisible || adLoaded) return;
    try {
      const adsbygoogle = (window as any).adsbygoogle;
      if (adsbygoogle) {
        adsbygoogle.push({});
        setAdLoaded(true);
      }
    } catch {
      // AdSense not loaded or blocked
    }
  }, [isVisible, adLoaded]);

  const dims = formatDimensions[format];
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-XXXXXXXXXXXXXXXX';

  return (
    <div
      ref={adRef}
      className={`ad-unit ${className}`}
      style={{
        width: dims.width,
        minHeight: dims.minHeight,
        maxWidth: '100%',
        margin: '0 auto',
        overflow: 'hidden',
        contain: 'layout', // Prevents CLS
      }}
    >
      {isVisible && (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client={publisherId}
          data-ad-slot={slot}
          data-ad-format={format === 'auto' ? 'auto' : undefined}
          data-full-width-responsive={format === 'auto' ? 'true' : undefined}
        />
      )}
    </div>
  );
}
