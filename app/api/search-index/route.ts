import { getAllArticles } from '@/lib/articles';

// Rate limiting: Map<IP, { count, timestamp }>
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_MAX = 30; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in ms

function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return ip.trim();
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  // Reset if window expired
  if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  // Check if limit exceeded
  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  // Increment count
  record.count++;
  return true;
}

export async function GET(request: Request) {
  const ip = getClientIP(request);

  if (!checkRateLimit(ip)) {
    return Response.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  try {
    const articles = getAllArticles();

    const searchIndex = articles.map((article) => ({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
    }));

    return Response.json(searchIndex);
  } catch (error) {
    console.error('Failed to generate search index:', error);
    return Response.json(
      { error: 'Failed to generate search index' },
      { status: 500 }
    );
  }
}
