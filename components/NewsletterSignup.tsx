'use client';

import { useState, FormEvent } from 'react';

interface NewsletterSignupProps {
  compact?: boolean;
  leadMagnet?: string;
}

export default function NewsletterSignup({
  compact = false,
  leadMagnet = 'Free: Top 10 Anime Collab Cafes Open This Month',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error('Subscribe failed');

      // GA4 tracking
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'newsletter_signup', {
          method: compact ? 'sidebar' : 'inline',
        });
      }

      setStatus('success');
      setMessage('Welcome aboard! Check your inbox.');
      setEmail('');

      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (compact) {
    return (
      <div className="rounded-xl p-5" style={{ background: '#14213d' }}>
        <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#fb923c' }}>
          Newsletter
        </p>
        <p className="text-sm text-white/80 mb-3 leading-relaxed">
          {leadMagnet}
        </p>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm rounded-lg outline-none"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
            }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-3 py-2.5 text-sm font-semibold text-white rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: '#f97316' }}
          >
            {status === 'loading' ? 'Subscribing...' : 'Get Free Guide'}
          </button>
          {message && (
            <p className={`text-xs ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    );
  }

  return (
    <section className="rounded-xl overflow-hidden my-10" style={{ background: '#14213d' }}>
      <div className="max-w-2xl mx-auto px-6 py-10 text-center">
        <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#fb923c' }}>
          Free Weekly Guide
        </p>
        <h2
          className="text-white mb-3"
          style={{
            fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
            fontSize: '1.5rem',
            fontWeight: 700,
          }}
        >
          {leadMagnet}
        </h2>
        <p className="mb-6" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          Join anime fans getting weekly collab cafe updates, pilgrimage guides, and Japan travel tips.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-3 rounded-lg text-sm outline-none"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
            }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 rounded-lg font-semibold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: '#f97316', whiteSpace: 'nowrap' }}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe Free'}
          </button>
        </form>

        {message && (
          <p className={`text-sm mt-3 ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}

        <p className="mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
