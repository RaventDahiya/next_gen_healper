import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export async function POST(req: NextRequest) {
  try {
    console.log("Test cancel subscription API called");

    const body = await req.json();
    const { userId, subscriptionId } = body;

    console.log("Request data:", { userId, subscriptionId });

    // Validate required fields
    if (!userId || !subscriptionId) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Missing required information" },
        { status: 400 }
      );
    }

    // Initialize Convex client
    console.log("Initializing Convex client");
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    console.log("Convex URL available:", !!convexUrl);

    if (!convexUrl) {
      return NextResponse.json(
        { error: "Convex URL not configured" },
        { status: 500 }
      );
    }

    const convex = new ConvexHttpClient(convexUrl);

    // Update user in database (downgrade to free plan)
    console.log("Updating user in database");
    const result = await convex.mutation(api.users.CancelUserSubscription, {
      userId: userId,
    });

    console.log("Database update result:", result);

    return NextResponse.json({
      success: true,
      message:
        "Subscription cancelled successfully (test mode - no Razorpay call).",
      credits: result.credits,
    });
  } catch (error) {
    console.error("Test cancel subscription processing error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return NextResponse.json(
      {
        error: "Failed to cancel subscription",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
