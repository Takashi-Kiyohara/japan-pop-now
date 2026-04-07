'use client';

import { useEffect } from 'react';

type AdFormat = 'auto' | 'rectangle' | 'leaderboard';

interface AdUnitProps {
  slot: string;
  format?: AdFormat;
  className?: string;
}

const formatDimensions: Record<AdFormat, { width: number; height: number }> = {
  auto: { width: 0, height: 0 },
  rectangle: { width: 300, height: 250 },
  leaderboard: { width: 728, height: 90 },
};

export default function AdUnit({
  slot,
  format = 'auto',
  className = '',
}: AdUnitProps) {
  useEffect(() => {
    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
    } catch (error) {
      console.log('AdSense loading deferred or blocked');
    }
  }, []);

  const dimensions = formatDimensions[format];

  return (
    <div className={`flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: dimensions.width === 0 ? '100%' : `${dimensions.width}px`,
          height: `${dimensions.height}px`,
        }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format === 'auto' ? 'auto' : undefined}
      />
    </div>
  );
}
