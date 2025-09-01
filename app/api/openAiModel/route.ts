import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET(req: NextRequest) {
  try {
    if (!process.env.OPEN_ROUTER_API_KEY) {
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

    // Get list of available models from OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "NextGen Helper AI Assistant",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    const data = await response.json();

    // Filter for free models and Gemini models specifically
    const geminiModels =
      data.data?.filter(
        (model: any) =>
          model.id.includes("gemini") || model.id.includes("google")
      ) || [];

    const freeModels =
      data.data?.filter(
        (model: any) =>
          model.pricing?.prompt === "0" && model.pricing?.completion === "0"
      ) || [];

    return NextResponse.json({
      totalModels: data.data?.length || 0,
      geminiModels: geminiModels.map((model: any) => ({
        id: model.id,
        name: model.name,
        pricing: model.pricing,
        context_length: model.context_length,
      })),
      freeModels: freeModels.slice(0, 10).map((model: any) => ({
        id: model.id,
        name: model.name,
        context_length: model.context_length,
      })),
      availableGeminiIds: geminiModels.map((model: any) => model.id),
    });
  } catch (error: any) {
    console.error("Error fetching OpenRouter models:", error);
    return NextResponse.json(
      { error: "Failed to fetch models", details: error.message },
      { status: 500 }
    );
  }
}
