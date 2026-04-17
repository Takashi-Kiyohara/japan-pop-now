// Single source of truth for the site author ("Takapon").
// Consumed by components/AuthorBox.tsx, lib/structured-data.ts (schema),
// app/llms.txt & app/llms-full.txt routes, and the /about page.

export const AUTHOR = {
  name: 'Takapon',
  jobTitle: 'Founder & Editor',
  avatar: '/images/author/takapon.webp',
  avatarAlt: 'Portrait of Takapon, Founder & Editor of Japan Pop Now',
  profilePath: '/about',
  bio: 'Kyoto-born, Tokyo-based writer covering anime, collab cafes, pilgrimage spots, and pop culture travel for international visitors. Former US strategy consultant; currently completing a graduate degree in International Relations in the UK.',
  tagline:
    "Kyoto-born, Tokyo-based writer covering anime, collab cafes, and pop culture travel. Former US strategy consultant, currently completing a graduate degree in International Relations in the UK. Verifies every cafe and event against the operator's official source.",
  bioShort:
    'Japan-based writer covering anime pop culture, collab cafes, and travel for international visitors.',
  locationLine:
    'Kyoto-born, Tokyo-based. Ex-US strategy consulting, now completing a graduate degree in International Relations in the UK.',
  expertise: [
    'Anime Collab Cafes',
    'Tokyo Pop Culture Districts',
    'Content Strategy',
    'SEO',
  ],
  knowsAbout: [
    'Anime',
    'Manga',
    'Japanese Pop Culture',
    'Travel in Japan',
    'Tourism',
    'Anime Locations',
  ],
  socials: {
    threads: 'https://www.threads.net/@pop_now_jp',
    x: 'https://x.com/pop_now_jp',
  },
} as const;

export type AuthorInfo = typeof AUTHOR;

export const AUTHOR_SAME_AS: readonly string[] = [
  AUTHOR.socials.threads,
  AUTHOR.socials.x,
] as const;
