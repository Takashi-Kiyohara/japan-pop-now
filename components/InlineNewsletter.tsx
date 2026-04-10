'use client';

import { useState, FormEvent } from 'react';

export default function InlineNewsletter() {
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
          method: 'inline_article',
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

  return (
    <div
      className="rounded-lg p-5 border"
      style={{
        background: 'linear-gradient(135deg, rgba(249,115,22,0.05), rgba(230,57,70,0.05))',
        borderColor: 'rgba(234,88,12,0.2)',
      }}
    >
      <div className="max-w-2xl">
        <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#ea580c' }}>
          Weekly Tips
        </p>
        <p className="text-sm font-semibold mb-3" style={{ color: '#14213d' }}>
          Get weekly anime travel tips — Join 1,000+ fans
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email address"
            aria-invalid={status === 'error'}
            className="flex-1 px-3 py-2 text-sm rounded-md outline-none"
            style={{
              background: '#fff',
              border: status === 'error' ? '1px solid #dc2626' : '1px solid #e7e5e4',
              color: '#14213d',
            }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-4 py-2 text-sm font-semibold text-white rounded-md transition-opacity hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
            style={{ background: '#f97316' }}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        {message && (
          <p
            role={status === 'success' ? 'status' : 'alert'}
            className={`text-xs mt-2 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
