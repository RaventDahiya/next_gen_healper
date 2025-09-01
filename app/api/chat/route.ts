import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { formatAssistantInstruction } from "@/lib/assistantUtils";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Simple token estimation function (more accurate than character/4)
function estimateTokens(text: string): number {
  // Rough estimation: average English word is ~1.3 tokens
  // Split by spaces and punctuation for better word counting
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  return Math.ceil(words.length * 1.3);
}

export async function POST(req: NextRequest) {
  let provider = "unknown"; // Declare at function level for error handling

  try {
    const {
      provider: requestProvider,
      userInput,
      conversationHistory,
      assistantId,
      userId,
    } = await req.json();

    provider = requestProvider; // Assign the actual provider value

    console.log("API Request received:", {
      provider,
      userInput,
      conversationHistory,
      assistantId,
      userId,
    });

    if (!provider || !userInput || !userId) {
      return NextResponse.json(
        { error: "Provider, userInput, and userId are required" },
        { status: 400 }
      );
    }

    // Check user's remaining credits before processing
    const user = await convex.query(api.users.GetUserById, {
      userId: userId,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate approximate tokens for input using better estimation
    const inputTokens = estimateTokens(userInput);

    // Check if user has enough credits (add some buffer for response)
    const estimatedTotalTokens = inputTokens * 2; // Estimate response will be similar length
    if (user.credits < estimatedTotalTokens) {
      return NextResponse.json(
        {
          error: "insufficient_credits",
          message:
            "You have insufficient credits to send this message. Please upgrade to Pro plan for more tokens.",
          remainingCredits: user.credits,
          estimatedCost: estimatedTotalTokens,
        },
        { status: 403 }
      );
    }

    if (!process.env.OPEN_ROUTER_API_KEY) {
      console.error("OPEN_ROUTER_API_KEY is not set in environment variables");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Get assistant data if assistantId is provided
    let systemMessage = null;
    if (assistantId && userId) {
      try {
        let assistant = null;

        // Try to get by Convex ID first
        try {
          assistant = await convex.query(
            api.userAiAssistants.GetAssistantById,
            {
              assistantId: assistantId,
            }
          );
        } catch (convexIdError) {
          // If that fails, try to get by custom ID
          console.log("Trying custom ID lookup...");
          assistant = await convex.query(
            api.userAiAssistants.GetAssistantByCustomId,
            {
              customId: assistantId.toString(),
              uid: userId,
            }
          );
        }

        if (assistant) {
          const instruction = formatAssistantInstruction(assistant);
          if (instruction) {
            systemMessage = {
              role: "system",
              content: instruction,
            };
          }
          console.log("Assistant instruction applied:", instruction);
        } else {
          console.warn("Assistant not found with ID:", assistantId);
        }
      } catch (error) {
        console.error("Error fetching assistant:", error);
      }
    }

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPEN_ROUTER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "NextGen Helper AI Assistant",
      },
    });

    // Build the messages array with system message and conversation history
    const messages = [];

    // Add system message if we have assistant instruction
    if (systemMessage) {
      messages.push(systemMessage);
    }

    // Include previous conversation if exists
    if (conversationHistory && conversationHistory.length > 0) {
      messages.push(...conversationHistory);
    }

    // Add the current user message
    messages.push({
      role: "user",
      content: userInput,
    });

    console.log(
      "Messages being sent to OpenAI:",
      JSON.stringify(messages, null, 2)
    );
    console.log("Using model:", provider);

    // Add specific handling for different model types
    let modelConfig = {
      model: provider,
      messages: messages,
      max_tokens: 1000,
    };

    // Special handling for Gemini models which might need different parameters
    if (provider.includes("gemini")) {
      console.log("Detected Gemini model, using specific configuration");
      modelConfig = {
        model: provider,
        messages: messages,
        max_tokens: 800, // Gemini might have different token limits
      };
    }

    console.log("Model configuration:", modelConfig);

    let completion;
    try {
      completion = await openai.chat.completions.create(modelConfig);
    } catch (modelError: any) {
      console.error("Error with specific model:", provider, modelError);

      // If Gemini model fails, provide more specific error information
      if (provider.includes("gemini")) {
        console.log("Gemini model failed, error:", modelError.message);
        throw new Error(
          `Gemini model (${provider}) is currently unavailable: ${modelError.message}`
        );
      }

      // Re-throw the original error for other models
      throw modelError;
    }

    const result = completion.choices[0].message.content;

    // Calculate tokens used with better estimation
    const outputTokens = estimateTokens(result || "");
    const totalTokensUsed = inputTokens + outputTokens;

    // Update user credits
    try {
      const updateResult = await convex.mutation(api.users.UpdateUserCredits, {
        userId: userId,
        tokensUsed: totalTokensUsed,
      });

      console.log("Credits updated:", updateResult);
    } catch (error) {
      console.error("Error updating user credits:", error);
    }

    console.log("OpenAI response:", result);
    console.log(
      "Tokens used - Input:",
      inputTokens,
      "Output:",
      outputTokens,
      "Total:",
      totalTokensUsed
    );

    return NextResponse.json({
      message: result,
      provider: provider,
      tokensUsed: totalTokensUsed,
      inputTokens: inputTokens,
      outputTokens: outputTokens,
      remainingCredits: user.credits - totalTokensUsed,
    });
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    console.error("Error details:", {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
      provider: provider,
    });

    // Provide more specific error messages based on the error type
    let errorMessage = "Failed to generate response";
    let statusCode = 500;

    if (error.status === 400) {
      errorMessage =
        "Invalid request. The model might not support this input format.";
      statusCode = 400;
    } else if (error.status === 401) {
      errorMessage = "Authentication failed. Please check API credentials.";
      statusCode = 401;
    } else if (error.status === 403) {
      errorMessage =
        "Access forbidden. The model might not be available or you don't have permission.";
      statusCode = 403;
    } else if (error.status === 404) {
      errorMessage =
        "Model not found. The specified AI model is not available.";
      statusCode = 404;
    } else if (error.status === 429) {
      errorMessage = "Rate limit exceeded. Please try again in a moment.";
      statusCode = 429;
    } else if (error.message?.includes("model")) {
      errorMessage = `Model error: ${error.message}`;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error.message,
        provider: provider,
        errorCode: error.status || "unknown",
      },
      { status: statusCode }
    );
  }
}
