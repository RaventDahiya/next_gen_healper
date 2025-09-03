import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, subscriptionId } = body;

    // Validate required fields
    if (!userId || !subscriptionId) {
      return NextResponse.json(
        { error: "Missing required information" },
        { status: 400 }
      );
    }

    // Check environment variables first
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    // Only try Razorpay if we have credentials
    if (razorpayKeyId && razorpayKeySecret) {
      try {
        // Initialize Razorpay instance
        const razorpay = new Razorpay({
          key_id: razorpayKeyId,
          key_secret: razorpayKeySecret,
        });

        // Cancel subscription with Razorpay
        const cancelResult = await razorpay.subscriptions.cancel(
          subscriptionId,
          true
        ); // true = cancel_at_cycle_end

        console.log("Razorpay cancellation successful:", cancelResult.id);
      } catch (razorpayError: any) {
        console.error("Razorpay cancellation error:", razorpayError);
        // Continue with database update even if Razorpay fails
        console.log("Continuing with database update despite Razorpay error");
      }
    } else {
      console.log("Skipping Razorpay cancellation - credentials not available");
    }

    // Initialize Convex client (using same pattern as payment-success)
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    // Update user in database (downgrade to free plan)
    const result = await convex.mutation(api.users.CancelUserSubscription, {
      userId: userId,
    });

    return NextResponse.json({
      success: true,
      message:
        "Subscription cancelled successfully. You'll continue to have Pro access until the end of your current billing cycle, then you'll be moved to the free plan.",
      credits: result.credits,
    });
  } catch (error) {
    console.error("Cancel subscription processing error:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
