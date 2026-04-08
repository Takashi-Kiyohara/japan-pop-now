'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  // Only show on article pages
  const isArticlePage = pathname.startsWith('/articles/');

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.scrollY;
      const scrollProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setProgress(Math.min(scrollProgress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isArticlePage) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-[#c2185b] z-50 transition-all duration-200"
      style={{ width: `${progress}%` }}
    />
  );
}
