/**
 * FTC + 消費者庁 compliant affiliate disclosure, auto-injected by the
 * article page when the body contains any affiliate domain. Rendered
 * with the existing `jpn-tip` style for consistency with manual
 * disclosures that used the same class.
 */
export default function AffiliateDisclosure() {
  return (
    <div className="jpn-tip not-prose" role="note" aria-label="Affiliate disclosure">
      <strong>Disclosure:</strong> This article contains affiliate links. We
      may earn a commission if you book through these links, at no extra cost
      to you.
    </div>
  )
}
