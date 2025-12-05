import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSystemLogs } from "@/lib/logging/systemLog";

/**
 * GET /api/admin/logs
 * Fetch system logs (admin only)
 */
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const eventType = searchParams.get("eventType") as any;
    const userId = searchParams.get("userId") || undefined;
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Fetch logs
    const logs = await getSystemLogs({
      eventType,
      userId,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      logs,
      pagination: {
        limit,
        offset,
        count: logs.length,
      },
    });
  } catch (error) {
    console.error("Error fetching system logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch system logs" },
      { status: 500 }
    );
  }
}
