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

/**
 * Ad loading skeleton/placeholder
 * Shows a subtle gray dotted border box before ad loads
 */
function AdSkeleton({ width, minHeight }: { width: string; minHeight: string }) {
  return (
    <div
      style={{
        width,
        minHeight,
        maxWidth: '100%',
        border: '2px dotted #d3d3d3',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafaf9',
        color: '#a8a29e',
        fontSize: '0.875rem',
        fontWeight: '500',
      }}
      aria-label="Advertisement loading"
    >
      Advertisement
    </div>
  );
}

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
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID || '';

  // Don't render anything if AdSense ID is not configured
  if (!publisherId) {
    return null;
  }

  return (
    <div
      ref={adRef}
      className={`ad-unit ${className}`}
      style={{
        width: dims.width,
        maxWidth: '100%',
        margin: '0 auto',
        overflow: 'hidden',
        contain: 'layout', // Prevents CLS
      }}
    >
      {!isVisible && <AdSkeleton width={dims.width} minHeight={dims.minHeight} />}

      {isVisible && !adLoaded && <AdSkeleton width={dims.width} minHeight={dims.minHeight} />}

      {isVisible && (
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '100%',
            minHeight: dims.minHeight,
            opacity: adLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
          data-ad-client={publisherId}
          data-ad-slot={slot}
          data-ad-format={format === 'auto' ? 'auto' : undefined}
          data-full-width-responsive={format === 'auto' ? 'true' : undefined}
        />
      )}
    </div>
  );
}
