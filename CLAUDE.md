# japan-pop-now.com — Claude Code Rules

## Build & Dev
- Build: `npm run build`
- Dev: `npm run dev`
- Lint: `npm run lint`
- Type check: `npx tsc --noEmit`
- Validate articles: `npm run validate`

## Stack
- Next.js 16 (App Router) on Vercel
- React 19, TypeScript 5 strict
- Tailwind CSS v4 (CSS-first config in globals.css, NO tailwind.config file)
- Articles: `.md` files in `content/articles/` with gray-matter frontmatter
- MDX rendering: next-mdx-remote v6
- Icons: lucide-react only (no emoji in UI)
- Fonts: Playfair Display (headings) + DM Sans (body)

## Code Standards
- 2-space indentation
- Named exports for components, default export for pages
- `@/*` path alias (maps to repo root)
- Component files: `components/*.tsx`
- Utilities: `lib/*.ts`
- No console.log in production code
- React.memo for card/list item components
- No inline styles — Tailwind utility classes only

## Design System (MUST follow)
@.claude/rules/design-system.md

## Article Quality Rules
@.claude/rules/article-quality.md

## Critical Rules
- Author name: ALWAYS "Takapon" (NEVER use real name 清原崇)
- No past dates in 2026 articles (never write 2023/2024 as if current)
- No Unsplash images — only official/authentic images
- No emoji in articles or UI components
- Every image path in .md MUST have a corresponding file in public/
- Never delete files from repo (hidden dependencies may exist)
- After CSS changes: verify contrast (dark bg = light text, always)
- Table headers: white text with !important (known specificity issue)
- No footnotes in articles (remark-gfm compatibility)
- No `<table>` inside `<div>` in markdown (parsing breaks)

## Git
- Commit messages: conventional commits (feat/fix/design/content)
- One logical change per commit
- Run `npm run build` before committing

## Environment Variables
- Affiliate IDs: `NEXT_PUBLIC_*_AFF_ID` pattern
- Never hardcode affiliate IDs in source
