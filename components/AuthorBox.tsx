import Image from 'next/image';
import Link from 'next/link';
import { AUTHOR } from '@/lib/author';

interface AuthorBoxProps {
  variant?: 'compact' | 'full';
}

export default function AuthorBox({ variant = 'full' }: AuthorBoxProps) {
  const avatarSize = variant === 'compact' ? 40 : 64;

  return (
    <aside
      className={`rounded-xl flex items-start gap-4 ${variant === 'compact' ? 'p-3' : 'p-5'}`}
      style={{ background: '#fff', border: '1px solid #e7e5e4' }}
      aria-label={`About ${AUTHOR.name}`}
    >
      <Link
        href={AUTHOR.profilePath}
        aria-label={`${AUTHOR.name} profile`}
        className="flex-shrink-0 rounded-full overflow-hidden"
        style={{ width: avatarSize, height: avatarSize, background: '#f5f5f4' }}
      >
        <Image
          src={AUTHOR.avatar}
          alt={AUTHOR.avatarAlt}
          width={avatarSize}
          height={avatarSize}
          className="rounded-full object-cover"
        />
      </Link>

      <div className="min-w-0">
        <Link
          href={AUTHOR.profilePath}
          style={{
            fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
            fontWeight: 700,
            color: '#14213d',
            fontSize: variant === 'compact' ? '0.95rem' : '1.05rem',
            display: 'block',
          }}
        >
          {AUTHOR.name}
        </Link>
        <p style={{ color: '#78716c', fontSize: '0.8rem', marginTop: '2px' }}>
          {AUTHOR.jobTitle}
        </p>
        {variant === 'full' && (
          <p
            style={{
              color: '#57534e',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              marginTop: '10px',
            }}
          >
            {AUTHOR.bio}
          </p>
        )}
        <a
          href={AUTHOR.socials.linkedin}
          target="_blank"
          rel="me noopener noreferrer"
          aria-label={`${AUTHOR.name} on LinkedIn`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            marginTop: '10px',
            color: '#0d9488',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          LinkedIn
        </a>
      </div>
    </aside>
  );
}
