export const handleError = (error: any, context: string) => {
  // Log to external service in production (e.g., Sentry)
  if (process.env.NODE_ENV === "production") {
    // Send to error tracking service
    console.error(`[${context}]`, error);
  } else {
    console.error(`[${context}]`, error);
  }
};

export const sanitizeError = (error: any): string => {
  if (process.env.NODE_ENV === "production") {
    return "An error occurred. Please try again.";
  }
  return error?.message || "Unknown error";
};

export const isNetworkError = (error: any): boolean => {
  return (
    error?.code === "NETWORK_ERROR" ||
    error?.message?.includes("fetch") ||
    error?.name === "NetworkError"
  );
};

export const logUserAction = (
  action: string,
  userId?: string,
  metadata?: any
) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[USER_ACTION] ${action}`, { userId, metadata });
  }
  // In production, send to analytics service
};
