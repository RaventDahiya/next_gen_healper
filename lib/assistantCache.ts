// Utility functions for managing assistant cache

export const clearAssistantCache = (userId: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(`user_${userId}_has_assistants`);
  }
};

export const setAssistantCache = (userId: string, hasAssistants: boolean) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      `user_${userId}_has_assistants`,
      hasAssistants.toString()
    );
  }
};

export const getAssistantCache = (userId: string): boolean | null => {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(`user_${userId}_has_assistants`);
    return cached === null ? null : cached === "true";
  }
  return null;
};
