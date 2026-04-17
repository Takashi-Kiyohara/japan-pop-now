import { Metadata } from 'next';
import { getAllArticles } from '@/lib/articles';
import { AUTHOR } from '@/lib/author';
import { getAuthorSchema } from '@/lib/structured-data';
import ArticleCard from '@/components/ArticleCard';

export const metadata: Metadata = {
  title: 'About Us — Meet the Japan Pop Now Team',
  description:
    'Learn about the team behind Japan Pop Now — your trusted guide to anime collab cafes, pilgrimage spots, and pop culture travel in Japan.',
  alternates: {
    canonical: 'https://www.japan-pop-now.com/about',
  },
};

const TEAM = [
  {
    name: AUTHOR.name,
    role: AUTHOR.jobTitle,
    bio: AUTHOR.bio,
    expertise: AUTHOR.expertise,
    socials: AUTHOR.socials,
  },
];

export default function AboutPage() {
  const allArticles = getAllArticles();
  const recentArticles = allArticles.slice(0, 6);

  return (
    <>
      {/* Author Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getAuthorSchema()),
        }}
      />

      <div style={{ background: '#fafaf9' }}>
        {/* Hero */}
        <section
          style={{
            background: 'linear-gradient(135deg, #14213d 0%, #1a2a4a 100%)',
            padding: '80px 0 60px',
          }}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p
              className="text-sm font-bold tracking-widest uppercase mb-4"
              style={{ color: '#fb923c' }}
            >
              About Us
            </p>
            <h1
              className="text-white mb-6"
              style={{
                fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              The Team Behind Japan Pop Now
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.7 }}>
              We&apos;re on a mission to be the most trusted English-language guide to Japan&apos;s anime and pop culture scene — written by people who actually live here.
            </p>
          </div>
        </section>

        <div style={{ height: '3px', background: 'linear-gradient(90deg, #f97316, #e63946, #14213d)' }} />

        {/* Mission */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-4 mb-6">
            <div style={{ width: '4px', height: '28px', background: '#f97316', borderRadius: '2px' }} />
            <h2
              style={{
                fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                fontSize: '1.6rem',
                fontWeight: 700,
                color: '#14213d',
              }}
            >
              Our Mission
            </h2>
          </div>
          <div
            className="rounded-xl p-6 md:p-8"
            style={{ background: '#fff', border: '1px solid #e7e5e4', lineHeight: 1.8, color: '#44403c' }}
          >
            <p className="mb-4">
              Japan&apos;s anime and pop culture scene is incredible — but navigating it as an international visitor can be overwhelming. Most information is only in Japanese, booking systems are confusing, and the best spots are hidden in plain sight.
            </p>
            <p className="mb-4">
              Japan Pop Now exists to fix that. We provide accurate, up-to-date, English-language guides to everything from anime collaboration cafes to real-life anime locations, otaku shopping districts, and practical travel logistics.
            </p>
            <p>
              Every article is based on firsthand experience. We visit the locations, eat at the cafes, and test the booking systems ourselves — so you can focus on enjoying the experience.
            </p>
          </div>
        </section>

        {/* Team */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center gap-4 mb-8">
            <div style={{ width: '4px', height: '28px', background: '#f97316', borderRadius: '2px' }} />
            <h2
              style={{
                fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                fontSize: '1.6rem',
                fontWeight: 700,
                color: '#14213d',
              }}
            >
              Meet the Team
            </h2>
          </div>

          {TEAM.map((member) => (
            <div
              key={member.name}
              className="rounded-xl p-6 md:p-8"
              style={{ background: '#fff', border: '1px solid #e7e5e4' }}
            >
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar placeholder */}
                <div
                  className="flex-shrink-0 rounded-full flex items-center justify-center"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #f97316, #e63946)',
                    fontSize: '2rem',
                    color: '#fff',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                  }}
                >
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      color: '#14213d',
                      marginBottom: '4px',
                    }}
                  >
                    {member.name}
                  </h3>
                  <p style={{ color: '#f97316', fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px' }}>
                    {member.role}
                  </p>
                  <p style={{ color: '#57534e', lineHeight: 1.7, marginBottom: '12px' }}>
                    {member.bio}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {member.expertise.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          fontSize: '0.75rem',
                          padding: '3px 10px',
                          borderRadius: '99px',
                          background: '#fef3c7',
                          color: '#92400e',
                          fontWeight: 500,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Recent Articles */}
        <section style={{ background: '#fff', borderTop: '1px solid #e7e5e4' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center gap-4 mb-8">
              <div style={{ width: '4px', height: '28px', background: '#f97316', borderRadius: '2px' }} />
              <h2
                style={{
                  fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  color: '#14213d',
                }}
              >
                Our Latest Work
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recentArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} size="sm" />
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section
          style={{
            background: '#14213d',
            padding: '60px 0',
            textAlign: 'center',
          }}
        >
          <div className="max-w-2xl mx-auto px-4">
            <h2
              className="text-white mb-4"
              style={{
                fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                fontSize: '1.8rem',
                fontWeight: 700,
              }}
            >
              Get in Touch
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px', lineHeight: 1.7 }}>
              Have a tip, correction, or partnership inquiry? We&apos;d love to hear from you.
            </p>
            <a
              href="mailto:takashi03157@gmail.com"
              className="inline-block px-8 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ background: '#f97316', color: '#fff' }}
            >
              Contact Us
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
