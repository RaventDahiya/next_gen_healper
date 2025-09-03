const rateLimitMap = new Map();

export const rateLimit = (
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): boolean => {
  const now = Date.now();
  const windowStart = now - windowMs;

  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, []);
  }

  const requests = rateLimitMap.get(identifier);
  const validRequests = requests.filter(
    (timestamp: number) => timestamp > windowStart
  );

  if (validRequests.length >= limit) {
    return false;
  }

  validRequests.push(now);
  rateLimitMap.set(identifier, validRequests);
  return true;
};

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of rateLimitMap.entries()) {
    const validTimestamps = timestamps.filter(
      (ts: number) => now - ts < 300000
    ); // 5 minutes
    if (validTimestamps.length === 0) {
      rateLimitMap.delete(key);
    } else {
      rateLimitMap.set(key, validTimestamps);
    }
  }
}, 300000); // Clean every 5 minutes

export const getRateLimitStatus = (
  identifier: string,
  windowMs: number = 60000
) => {
  const now = Date.now();
  const windowStart = now - windowMs;

  if (!rateLimitMap.has(identifier)) {
    return { count: 0, resetTime: now + windowMs };
  }

  const requests = rateLimitMap.get(identifier);
  const validRequests = requests.filter(
    (timestamp: number) => timestamp > windowStart
  );

  return {
    count: validRequests.length,
    resetTime: Math.max(...validRequests) + windowMs,
  };
};
