/**
 * InfoBox — MATCHA-style callout box for opening hours, prices, access info.
 * Used inside MDX article content via ArticleBody.
 *
 * Usage in markdown:
 * :::info
 * **Hours:** 10:00–18:00 (last entry 17:30)
 * **Closed:** Tuesdays
 * **Admission:** ¥1,200 adults / ¥600 children
 * **Access:** 5 min walk from Shibuya Station (Hachiko Exit)
 * :::
 */

interface InfoBoxProps {
  children: React.ReactNode;
  type?: 'info' | 'tip' | 'warning' | 'map';
}

const STYLE_MAP = {
  info: {
    border: '#f97316',
    bg: '#fff7ed',
    icon: '📍',
    label: 'Visitor Info',
  },
  tip: {
    border: '#22c55e',
    bg: '#f0fdf4',
    icon: '💡',
    label: 'Pro Tip',
  },
  warning: {
    border: '#ef4444',
    bg: '#fef2f2',
    icon: '⚠️',
    label: 'Important',
  },
  map: {
    border: '#3b82f6',
    bg: '#eff6ff',
    icon: '🗺️',
    label: 'Getting There',
  },
};

export default function InfoBox({ children, type = 'info' }: InfoBoxProps) {
  const s = STYLE_MAP[type];

  return (
    <div
      style={{
        borderLeft: `4px solid ${s.border}`,
        background: s.bg,
        borderRadius: '8px',
        padding: '16px 20px',
        margin: '24px 0',
        fontSize: '0.9rem',
        lineHeight: 1.7,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: s.border,
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span aria-hidden="true">{s.icon}</span>
        {s.label}
      </div>
      <div style={{ color: '#44403c' }}>{children}</div>
    </div>
  );
}
