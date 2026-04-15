'use client'

import { useState, useEffect } from 'react'
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react'

interface FeedbackFormProps {
  articleSlug: string
  articleTitle?: string
  tallyFormId?: string // Tally.so form ID, e.g., 'wN1K8y'
}

type HelpfulStatus = 'pending' | 'yes' | 'no'

const STORAGE_KEY_PREFIX = 'jpn-feedback-'
const TALLY_EMBED_BASE = 'https://tally.so/embed/'

export default function FeedbackForm({
  articleSlug,
  articleTitle = 'this article',
  tallyFormId = 'wN1K8y', // Placeholder Tally form ID
}: FeedbackFormProps) {
  const [helpful, setHelpful] = useState<HelpfulStatus>('pending')
  const [showExtended, setShowExtended] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [mounted, setMounted] = useState(false)

  const storageKey = `${STORAGE_KEY_PREFIX}${articleSlug}`

  // Hydrate from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      setHelpful(stored as HelpfulStatus)
      setSubmitted(true)
    }
  }, [articleSlug, storageKey])

  const handleHelpful = (value: boolean) => {
    const status = value ? 'yes' : 'no'
    setHelpful(status)
    localStorage.setItem(storageKey, status)

    // If they said "no", show extended feedback option
    if (!value) {
      setShowExtended(true)
    } else {
      setSubmitted(true)
    }
  }

  const handleExtendedSubmit = () => {
    setSubmitted(true)
    setShowExtended(false)
  }

  if (!mounted) {
    return null
  }

  if (submitted) {
    return (
      <div className="jpn-info-box mt-8 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800 p-4">
        <p className="text-sm font-medium text-green-800 dark:text-green-200">
          {helpful === 'yes'
            ? 'Thanks for the feedback! Glad we could help.'
            : 'Thanks for the feedback. We\'ll use it to improve.'}
        </p>
      </div>
    )
  }

  return (
    <div className="jpn-feedback-form mt-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6">
      <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Was this helpful?
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Your feedback helps us improve {articleTitle}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleHelpful(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-700 transition-colors text-sm font-medium"
            aria-label="Mark as helpful"
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="hidden sm:inline">Yes</span>
          </button>

          <button
            onClick={() => handleHelpful(false)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 transition-colors text-sm font-medium"
            aria-label="Mark as not helpful"
          >
            <ThumbsDown className="h-4 w-4" />
            <span className="hidden sm:inline">No</span>
          </button>
        </div>
      </div>

      {showExtended && (
        <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
          <div className="mb-3">
            <label htmlFor="feedback-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MessageCircle className="inline h-4 w-4 mr-1.5" />
              Tell us what we could improve
            </label>
            <textarea
              id="feedback-text"
              placeholder="Missing information? Outdated details? Let us know..."
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Optional • 500 char limit
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExtendedSubmit}
              className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm transition-colors"
            >
              Send Feedback
            </button>
            <button
              onClick={() => {
                setShowExtended(false)
                setHelpful('pending')
              }}
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tally.so embedded form (hidden, auto-submit friendly) */}
      <iframe
        data-tally-src={`${TALLY_EMBED_BASE}${tallyFormId}?alignement=left&hideTitle=true&transparentBackground=true&dynamicHeight=true&articleSlug=${encodeURIComponent(articleSlug)}`}
        width="100%"
        height="0"
        style={{ border: 'none' }}
        title="Tally feedback form"
        className="hidden"
      />
    </div>
  )
}
