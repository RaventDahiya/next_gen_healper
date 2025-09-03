import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Check environment variables
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

    return NextResponse.json({
      success: true,
      environment: {
        hasRazorpayKeyId: !!razorpayKeyId,
        hasRazorpayKeySecret: !!razorpayKeySecret,
        hasConvexUrl: !!convexUrl,
        razorpayKeyIdLength: razorpayKeyId?.length || 0,
        nodeEnv: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    console.error("Environment check error:", error);
    return NextResponse.json(
      { error: "Failed to check environment" },
      { status: 500 }
    );
  }
}
