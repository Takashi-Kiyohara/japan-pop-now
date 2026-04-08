'use client';

import { useState, FormEvent } from 'react';

interface NewsletterSignupProps {
  compact?: boolean;
}

export default function NewsletterSignup({
  compact = false,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Placeholder for actual API integration (Mailchimp, ConvertKit, etc.)
      // For now, just simulate success after 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStatus('success');
      setMessage('Thanks for subscribing!');
      setEmail('');

      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (compact) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-bold text-[#1a1f36] mb-3">Newsletter</h3>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c2185b]"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-3 py-2 text-sm font-medium bg-[#c2185b] text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
          {message && (
            <p
              className={`text-xs ${
                status === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-r from-[#c2185b] to-[#e91e63] text-white rounded-lg p-8 my-12">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2">Join Our Community</h2>
        <p className="text-pink-100 mb-6">
          Join 1,000+ anime fans getting exclusive collab cafe announcements and pilgrimage guides.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-gray-900"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 bg-white text-[#c2185b] font-semibold rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {message && (
          <p
            className={`text-sm mt-3 ${
              status === 'success' ? 'text-green-100' : 'text-red-100'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
