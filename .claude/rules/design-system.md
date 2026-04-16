---
paths:
  - "components/**/*.tsx"
  - "app/**/*.tsx"
  - "app/**/globals.css"
---

# Design System — japan-pop-now.com

## Brand Colors (defined in globals.css @theme)
- Navy: `var(--color-navy)` = #14213d
- Red: `var(--color-red)` = #e63946
- Cream: `var(--color-cream)` = #fafaf9
- Warm: `var(--color-warm)` = #f4f1eb
- Accent Orange: `var(--color-accent)` = #f97316 (primary action color)
- Accent Teal: `var(--color-accent-teal)` = #0d9488 (secondary, for info/links)

## Neutral Scale
- 50: #fafaf9 (page bg light)
- 100: #f5f5f4 (card bg)
- 200: #e7e5e4 (borders, dividers)
- 500: #78716c (muted text)
- 700: #44403c (body text)
- 900: #1c1917 (headings)

## Spacing System (8px base)
ALWAYS use multiples of 8 for padding/margin/gap:
- 8px (0.5rem) — tight
- 16px (1rem) — default
- 24px (1.5rem) — comfortable
- 32px (2rem) — section inner
- 48px (3rem) — section gap
- 64px (4rem) — major section gap

In Tailwind: p-2(8px), p-4(16px), p-6(24px), p-8(32px), py-12(48px), py-16(64px)

## Border Radius
- Cards: `rounded-2xl` (16px) — ALL cards must use this
- Buttons: `rounded-xl` (12px)
- Badges/Pills: `rounded-full`
- Images inside cards: `rounded-2xl` with `overflow-hidden` on parent

## Shadows
- Card default: `shadow-sm` (subtle)
- Card hover: `shadow-lg` + `translate-y-[-4px]` (NO scale transforms)
- Header: `shadow-[0_4px_20px_rgba(0,0,0,0.06)]`

## Transitions
- Standard: `transition-all duration-200 ease-out`
- Cards: `transition-[transform,box-shadow] duration-200 ease-out`
- Never exceed 300ms for UI transitions

## Typography
- Display headings: font-display (Playfair Display), letter-spacing: -0.02em
- Section titles: font-sans (DM Sans), uppercase, letter-spacing: 0.08em, text-sm
- Body: font-sans, text-base (1.0625rem), leading-relaxed (1.7)
- Max prose width: 65ch

## Header (Glassmorphism)
- `backdrop-blur-xl bg-white/85 dark:bg-navy/90`
- `border-b border-white/20`
- Sticky with z-50

## Cards (ArticleCard)
- ALWAYS: rounded-2xl, overflow-hidden, transition hover effect
- Image: aspect-video (16:9) for default, aspect-square for horizontal thumb
- Category pill: absolute top-left inside image, bg-accent text-white text-xs uppercase
- Status badge (collab cafes): absolute top-right, color-coded (green/orange/gray)

## Section Layout
- Alternate bg: cream → white → cream for visual rhythm
- Section padding: py-16 (64px)
- Section title + content gap: mb-8 (32px)
- Divider between sections: border-t border-neutral-200

## Dark Mode
- Selector: `[data-theme="dark"]`
- Always test contrast for both modes
- Dark card bg: neutral-800
- Dark text: neutral-100

## DO NOT
- Use inline styles
- Use emoji as icons (use lucide-react)
- Use scale transforms on hover (use translateY)
- Use box-shadow values not from the token list
- Use border-radius smaller than 12px for interactive elements
- Use spacing not on 8px grid
- Hardcode colors — use CSS variables or Tailwind tokens
