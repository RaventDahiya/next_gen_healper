import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { provider, userInput, conversationHistory } = await req.json();

    console.log("API Request received:", {
      provider,
      userInput,
      conversationHistory,
    });

    if (!provider || !userInput) {
      return NextResponse.json(
        { error: "Provider and userInput are required" },
        { status: 400 }
      );
    }

    if (!process.env.OPEN_ROUTER_API_KEY) {
      console.error("OPEN_ROUTER_API_KEY is not set in environment variables");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
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

    // Build the messages array with conversation history
    const messages = [
      // Include previous conversation if exists
      ...(conversationHistory || []),
      // Add the current user message
      {
        role: "user",
        content: userInput,
      },
    ];

    console.log(
      "Messages being sent to OpenAI:",
      JSON.stringify(messages, null, 2)
    );
    console.log("Using model:", provider);

    const completion = await openai.chat.completions.create({
      model: provider,
      messages: messages,
      max_tokens: 1000, // Add token limit to prevent very long responses
    });

    const result = completion.choices[0].message.content;

    console.log("OpenAI response:", result);

    return NextResponse.json({
      message: result,
      provider: provider,
    });
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    console.error("Error details:", {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
    });
    return NextResponse.json(
      { error: "Failed to generate response", details: error.message },
      { status: 500 }
    );
  }
}
