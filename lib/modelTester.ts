// Utility to test model availability
export const testModelAvailability = async (
  modelId: string
): Promise<{
  success: boolean;
  error?: string;
  response?: string;
}> => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider: modelId,
        userInput:
          "Hello, this is a test message. Please respond with 'OK' if you receive this.",
        conversationHistory: [],
        assistantId: null,
        userId: "test-user-id", // This would come from actual user context
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.details || "Unknown error",
      };
    }

    return {
      success: true,
      response: data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Network error",
    };
  }
};
