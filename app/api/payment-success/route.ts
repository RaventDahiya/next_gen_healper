import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { paymentId, subscriptionId, orderId, userId } = body;

    // Validate required fields
    if (!paymentId || !subscriptionId || !orderId || !userId) {
      return NextResponse.json(
        { error: "Missing required payment information" },
        { status: 400 }
      );
    }

    // Initialize Convex client
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    // Upgrade user to Pro plan
    const result = await convex.mutation(api.users.UpgradeUserToPro, {
      userId: userId,
      orderId: orderId,
      paymentId: paymentId,
      subscriptionId: subscriptionId,
    });

    return NextResponse.json({
      success: true,
      message: "Payment processed successfully",
      credits: result.credits,
    });
  } catch (error) {
    console.error("Payment success processing error:", error);
    return NextResponse.json(
      { error: "Failed to process payment success" },
      { status: 500 }
    );
  }
}
