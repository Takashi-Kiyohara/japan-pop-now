'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

interface NewsletterSignupProps {
  compact?: boolean;
  leadMagnet?: string;
}

export default function NewsletterSignup({
  compact = false,
  leadMagnet = 'Free: Top 10 Anime Collab Cafes Open This Month',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!consent) {
      setStatus('error');
      setMessage('Please confirm consent to receive emails.');
      return;
    }
    setStatus('loading');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent: true, consentTimestamp: new Date().toISOString() }),
      });

      if (!res.ok) throw new Error('Subscribe failed');

      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'newsletter_signup', {
          method: compact ? 'sidebar' : 'inline',
        });
      }

      setStatus('success');
      setMessage("Check your inbox — click the confirmation link inside to complete signup.");
      setEmail('');
      setConsent(false);

      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 8000);
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
        <form onSubmit={handleSubmit} aria-label="Newsletter signup (compact)" className="space-y-2">
          <input
            type="email"
            aria-label="Email address"
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
          <label className="flex items-start gap-2 text-xs text-white/70 leading-snug" style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              aria-label="Consent to receive emails"
              style={{ marginTop: '2px' }}
            />
            <span>
              I agree to receive emails and have read the{' '}
              <Link href="/privacy" className="underline" style={{ color: '#fb923c' }}>Privacy Policy</Link>.
            </span>
          </label>
          <button
            type="submit"
            disabled={status === 'loading' || !consent}
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
          <p className="text-[0.65rem] text-white/45 leading-tight">
            Double opt-in via confirmation email. One-click unsubscribe in every email. Operated from Tokyo, Japan.
          </p>
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

        <form onSubmit={handleSubmit} aria-label="Newsletter signup" className="flex flex-col gap-3 max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              aria-label="Email address"
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
              disabled={status === 'loading' || !consent}
              className="px-6 py-3 rounded-lg font-semibold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: '#f97316', whiteSpace: 'nowrap' }}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe Free'}
            </button>
          </div>

          <label className="flex items-start gap-2 text-xs text-white/70 leading-snug text-left" style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              aria-label="Consent to receive emails"
              style={{ marginTop: '2px' }}
            />
            <span>
              I agree to receive emails from japan-pop-now.com and have read the{' '}
              <Link href="/privacy" className="underline" style={{ color: '#fb923c' }}>Privacy Policy</Link>.
              You will receive a confirmation email — please click the link inside to complete signup
              (double opt-in).
            </span>
          </label>
        </form>

        {message && (
          <p className={`text-sm mt-3 ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}

        <p className="mt-4 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
          One-click unsubscribe in every email. Operated by Japan Pop Now from Tokyo, Japan. We do not
          sell, rent, or share your email. See our{' '}
          <Link href="/privacy" className="underline" style={{ color: '#fb923c' }}>Privacy Policy</Link>{' '}
          and{' '}
          <Link href="/terms" className="underline" style={{ color: '#fb923c' }}>Terms</Link> for full details.
        </p>
      </div>
    </section>
  );
}
