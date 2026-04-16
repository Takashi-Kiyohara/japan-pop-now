/**
 * Single source of truth for IP-signature gradients used as image fallbacks
 * (calendar cards, bento tiles, etc.).
 *
 * Tailwind class strings must appear verbatim so the JIT picker keeps them.
 * Light gradients pair with text-slate-900 to keep AA contrast on the badge.
 */

export interface IpVisual {
  /** Tailwind gradient class string (e.g. `bg-gradient-to-br from-amber-200 to-amber-500`). */
  gradient: string;
  /** Tailwind text-color class for the IP badge overlay. */
  textColor: string;
}

const LIGHT_TEXT = 'text-white drop-shadow-lg';
const DARK_TEXT = 'text-slate-900 drop-shadow';

const IP_VISUALS: Record<string, IpVisual> = {
  Chiikawa:                 { gradient: 'bg-gradient-to-br from-amber-200 to-amber-500',  textColor: DARK_TEXT },
  'Detective Conan':        { gradient: 'bg-gradient-to-br from-blue-900 to-red-500',     textColor: LIGHT_TEXT },
  'Jujutsu Kaisen':         { gradient: 'bg-gradient-to-br from-gray-900 to-purple-600',  textColor: LIGHT_TEXT },
  'My Hero Academia':       { gradient: 'bg-gradient-to-br from-emerald-500 to-amber-500',textColor: LIGHT_TEXT },
  'One Piece':              { gradient: 'bg-gradient-to-br from-red-500 to-yellow-400',   textColor: DARK_TEXT },
  Hololive:                 { gradient: 'bg-gradient-to-br from-pink-400 to-blue-400',    textColor: LIGHT_TEXT },
  Sanrio:                   { gradient: 'bg-gradient-to-br from-rose-300 to-red-200',     textColor: DARK_TEXT },
  Rilakkuma:                { gradient: 'bg-gradient-to-br from-amber-700 to-yellow-400', textColor: DARK_TEXT },
  'Yu-Gi-Oh!':              { gradient: 'bg-gradient-to-br from-amber-900 to-yellow-300', textColor: DARK_TEXT },
  'Yu-Gi-Oh! ZEXAL':        { gradient: 'bg-gradient-to-br from-amber-900 to-yellow-300', textColor: DARK_TEXT },
  'Super Mario':            { gradient: 'bg-gradient-to-br from-red-600 to-yellow-300',   textColor: DARK_TEXT },
  'Pokemon GO':             { gradient: 'bg-gradient-to-br from-red-600 to-yellow-300',   textColor: DARK_TEXT },
  'Demon Slayer':           { gradient: 'bg-gradient-to-br from-emerald-950 to-black',    textColor: LIGHT_TEXT },
  'Spy×Family':             { gradient: 'bg-gradient-to-br from-slate-800 to-red-600',    textColor: LIGHT_TEXT },
  'SPY×FAMILY':             { gradient: 'bg-gradient-to-br from-slate-800 to-red-600',    textColor: LIGHT_TEXT },
};

const DEFAULT_VISUAL: IpVisual = {
  gradient: 'bg-gradient-to-br from-gray-500 to-gray-800',
  textColor: LIGHT_TEXT,
};

export function getIpVisual(ip: string): IpVisual {
  if (IP_VISUALS[ip]) return IP_VISUALS[ip];
  // Match by prefix for franchise variants (e.g. "One Piece Film Red")
  for (const key of Object.keys(IP_VISUALS)) {
    if (ip.startsWith(key)) return IP_VISUALS[key];
  }
  return DEFAULT_VISUAL;
}

/** Convenience: just the gradient class (when text-color is handled separately). */
export function getIpGradient(ip: string): string {
  return getIpVisual(ip).gradient;
}
