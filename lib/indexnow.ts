/**
 * IndexNow Integration for Real-Time Search Engine Indexing
 * Submits URLs to IndexNow API (used by Bing, Yandex, and other search engines)
 * Enables faster crawling and indexing of new content
 */

const INDEXNOW_API = 'https://api.indexnow.org/indexnow';
const SITE_URL = 'https://japan-pop-now.com';

// Should be set from environment variable
const INDEXNOW_KEY = process.env.NEXT_PUBLIC_INDEXNOW_KEY || '';

export interface IndexNowRequest {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

/**
 * Submit a single URL to IndexNow
 * @param url - Full URL to submit
 * @returns Response status and message
 */
export async function submitToIndexNow(url: string): Promise<{
  success: boolean;
  status?: number;
  message: string;
}> {
  if (!INDEXNOW_KEY) {
    return {
      success: false,
      message: 'IndexNow key not configured',
    };
  }

  try {
    const payload: IndexNowRequest = {
      host: new URL(SITE_URL).hostname,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: [url],
    };

    const response = await fetch(INDEXNOW_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return {
        success: true,
        status: response.status,
        message: `Successfully submitted to IndexNow`,
      };
    } else {
      return {
        success: false,
        status: response.status,
        message: `IndexNow submission failed: ${response.statusText}`,
      };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      message: `Error submitting to IndexNow: ${message}`,
    };
  }
}

/**
 * Submit multiple URLs to IndexNow (batch submission)
 * Note: IndexNow limits batch submissions. If you have many URLs,
 * this will be sent in chunks of 10,000
 * @param urls - Array of URLs to submit
 * @returns Response status
 */
export async function submitBatchToIndexNow(urls: string[]): Promise<{
  success: boolean;
  submitted: number;
  failed: number;
  message: string;
}> {
  if (!INDEXNOW_KEY) {
    return {
      success: false,
      submitted: 0,
      failed: urls.length,
      message: 'IndexNow key not configured',
    };
  }

  if (urls.length === 0) {
    return {
      success: true,
      submitted: 0,
      failed: 0,
      message: 'No URLs to submit',
    };
  }

  // IndexNow accepts up to 10,000 URLs per request
  const BATCH_SIZE = 10000;
  let submitted = 0;
  let failed = 0;

  try {
    for (let i = 0; i < urls.length; i += BATCH_SIZE) {
      const batch = urls.slice(i, i + BATCH_SIZE);

      const payload: IndexNowRequest = {
        host: new URL(SITE_URL).hostname,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: batch,
      };

      const response = await fetch(INDEXNOW_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        submitted += batch.length;
      } else {
        failed += batch.length;
      }
    }

    return {
      success: failed === 0,
      submitted,
      failed,
      message: `Submitted ${submitted} URLs, ${failed} failed`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      submitted,
      failed: urls.length - submitted,
      message: `Error during batch submission: ${message}`,
    };
  }
}

/**
 * Create the IndexNow key file content
 * This file should be placed at the site root: /public/[key].txt
 * Contains the API key used for verification
 * @param key - The IndexNow API key
 * @returns File content
 */
export function generateIndexNowKeyFile(key: string): string {
  return key;
}

/**
 * Get IndexNow status/diagnostics
 * @returns Current configuration status
 */
export function getIndexNowStatus(): {
  configured: boolean;
  keyLength: number;
  keyLocation: string;
  apiEndpoint: string;
} {
  return {
    configured: !!INDEXNOW_KEY,
    keyLength: INDEXNOW_KEY.length,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    apiEndpoint: INDEXNOW_API,
  };
}

/**
 * Helper: Format article URL for IndexNow submission
 * @param slug - Article slug
 * @returns Full article URL
 */
export function getArticleUrl(slug: string): string {
  return `${SITE_URL}/articles/${slug}`;
}

/**
 * Helper: Format category URL for IndexNow submission
 * @param categorySlug - Category slug
 * @returns Full category URL
 */
export function getCategoryUrl(categorySlug: string): string {
  return `${SITE_URL}/category/${categorySlug}`;
}

/**
 * Validate IndexNow key format
 * IndexNow keys are typically 32 alphanumeric characters
 * @param key - Key to validate
 * @returns true if valid
 */
export function isValidIndexNowKey(key: string): boolean {
  // IndexNow keys are typically 32 characters, alphanumeric
  return /^[a-zA-Z0-9]{32}$/.test(key);
}
