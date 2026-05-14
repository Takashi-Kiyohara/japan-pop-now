/**
 * R14-D: ThreadsCTA component auto-injected at end of every article body.
 *
 * Previously, 29 articles carried an inline jpn-cta block with the same
 * "Follow @pop_now_jp on Threads" text. That duplicate inline text
 * inflates the duplicate-paragraph signal Google uses for "thin content"
 * detection. This component renders the same CTA once at the article
 * page level; the inline MDX blocks are stripped from article bodies.
 *
 * Aligns with feedback_sns_policy (Threads + X only, both @pop_now_jp).
 */
export default function ThreadsCTA() {
  return (
    <div className="jpn-cta not-prose" role="complementary" aria-label="Follow on Threads">
      <p>
        <strong>
          Follow{' '}
          <a
            href="https://www.threads.net/@pop_now_jp"
            rel="nofollow noopener noreferrer"
            target="_blank"
          >
            @pop_now_jp on Threads
          </a>
        </strong>{' '}
        for daily Tokyo pop culture updates.
      </p>
    </div>
  )
}
