import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";

export async function GET() {
  try {
    // Check database connectivity
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    // Simple health check - verify we can connect to Convex
    const healthCheck = await Promise.race([
      convex.query("users:GetUser" as any, { email: "healthcheck@test.com" }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 5000)
      ),
    ]).catch(() => "connection_test_failed");

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      services: {
        database:
          healthCheck === "connection_test_failed" ? "degraded" : "healthy",
        openrouter: process.env.OPEN_ROUTER_API_KEY ? "configured" : "missing",
        razorpay: process.env.RAZORPAY_KEY_SECRET ? "configured" : "missing",
      },
      version: process.env.npm_package_version || "1.0.0",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error:
          process.env.NODE_ENV === "production"
            ? "Service unavailable"
            : errorMessage,
      },
      { status: 503 }
    );
  }
}
