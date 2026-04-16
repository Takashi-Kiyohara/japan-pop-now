---
paths:
  - "content/articles/**/*.md"
  - "components/**/*CTA*.tsx"
  - "components/**/Affiliate*.tsx"
  - "lib/affiliate*.ts"
---

# Affiliate & Monetization Rules — japan-pop-now.com

## Approved Programs
- **Klook** — activities, tickets, transport (highest CVR for JPN readers)
- **Agoda** — hotels
- **Booking.com** — hotels (backup)
- **GetYourGuide** — tours/experiences
- **Viator** — experiences (secondary)
- **Amazon JP** — merch/goods
- AdSense — display (approval pending)

## CTA Placement (3-position rule)
Every monetizable article must have CTAs at these positions:
1. **Above-the-fold** — quick-info card with "Book on Klook" pill link
2. **Mid-article** — contextual CTA after the 1st or 2nd H2
3. **End-of-article** — full CTA card before related-articles block

## Environment Variables (Vercel)
All affiliate IDs MUST use this pattern. Never hardcode:

```
NEXT_PUBLIC_KLOOK_AFF_ID
NEXT_PUBLIC_AGODA_AFF_ID
NEXT_PUBLIC_BOOKING_AFF_ID
NEXT_PUBLIC_GYG_AFF_ID
NEXT_PUBLIC_VIATOR_AFF_ID
NEXT_PUBLIC_AMAZON_TAG
```

Access via: `process.env.NEXT_PUBLIC_KLOOK_AFF_ID`

## URL Construction
- Always use helper `lib/affiliate.ts` → `buildKlookUrl(productId)`, `buildAgodaUrl(hotelId)`
- Never concatenate strings in components
- Append UTM: `?aid=${AFF_ID}&utm_source=japan-pop-now&utm_medium=article&utm_campaign={slug}`

## Disclosure (FTC / Japan消費者庁)
- Every article with affiliate links: disclosure at top
- Text: "This post contains affiliate links. We may earn a commission at no cost to you."
- Component: `<AffiliateDisclosure />` — auto-injected above H1 by MDX wrapper

## Product Selection Criteria
- Match article intent (collab cafe article → food-activity Klook product)
- Prefer products with:
  - ≥ 4.5 star rating
  - ≥ 500 bookings
  - Instant confirmation
  - Mobile voucher
- Never link to sold-out or discontinued products — audit quarterly

## CTA Copy Rules
- Action verb + benefit + urgency (when honest)
  - OK: "Reserve your slot on Klook (sells out fast)"
  - NOT OK: "Click here"
- Use ¥ currency, localize for JP reader
- Show price transparency: "from ¥3,200"

## Link Attributes
- Always `rel="nofollow sponsored noopener"` on affiliate links
- Always `target="_blank"` with accessible label
- Use `<AffiliateLink>` component; never bare `<a>`

## Countdown / Urgency
- Only use real deadlines (collab cafe end dates, seasonal events)
- Component: `<CountdownBadge endDate="2026-05-31" />`
- Never invent urgency

## DO NOT
- Hardcode affiliate IDs in source files
- Use naked `<a href="https://affiliate.klook.com/...">` — always use wrapper
- Add affiliate link to >5 products per article (link saturation = CTR drop)
- Cloak links (redirect via own domain without disclosure)
- Use deceptive "just $0" styling for paid products
