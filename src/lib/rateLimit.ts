const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/**
 * Fixed-window limiter, in process memory.
 *
 * Adequate for a single-instance marketing site and enough to stop a script
 * hammering the quote endpoint. It is NOT shared across serverless instances —
 * if this deploys to more than one region, move it to Upstash or Vercel KV.
 */
export function checkRateLimit(identifier: string): {
  isAllowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const bucket = buckets.get(identifier);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { isAllowed: true, retryAfterSeconds: 0 };
  }

  bucket.count += 1;

  if (bucket.count > MAX_REQUESTS) {
    return {
      isAllowed: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  return { isAllowed: true, retryAfterSeconds: 0 };
}
