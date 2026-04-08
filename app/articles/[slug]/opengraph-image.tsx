import { ImageResponse } from 'next/og';
import { getArticleBySlug, CATEGORIES } from '@/lib/articles';
import { getAllArticleSlugs } from '@/lib/articles';

export const runtime = 'nodejs';
export const alt = 'Article Preview';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function OGImage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          Article Not Found
        </div>
      ),
      {
        ...size,
      }
    );
  }

  const category = CATEGORIES.find((c) => c.slug === article.category);
  const bgColor = category?.color || '#667eea';

  // Create gradient background using category color
  const gradientStart = bgColor;
  const gradientEnd = adjustBrightness(bgColor, -20);

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 80px',
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-150px',
            left: '-150px',
            width: '500px',
            height: '500px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '30px',
          }}
        >
          {/* Category Badge */}
          {category && (
            <div
              style={{
                display: 'inline-block',
                background: 'rgba(255, 255, 255, 0.25)',
                padding: '12px 24px',
                borderRadius: '50px',
                fontSize: '24px',
                fontWeight: '600',
                border: '2px solid rgba(255, 255, 255, 0.5)',
              }}
            >
              {category.icon} {category.label}
            </div>
          )}

          {/* Article Title */}
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 'bold',
              margin: '0',
              lineHeight: '1.3',
              maxWidth: '900px',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            }}
          >
            {article.title}
          </h1>

          {/* Branding */}
          <div
            style={{
              marginTop: '20px',
              fontSize: '28px',
              fontWeight: '500',
              opacity: 0.9,
              letterSpacing: '1px',
            }}
          >
            Japan Pop Now
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

function adjustBrightness(color: string, percent: number): string {
  // Simple hex color adjustment
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + percent));
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + percent));
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + percent));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
