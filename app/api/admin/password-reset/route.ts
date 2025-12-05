import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sanitizeObject } from "@/lib/validators";
import { logUserManagement } from "@/lib/logging/systemLog";

/**
 * POST /api/admin/password-reset
 * Reset user password (admin only)
 */
export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const sanitized = sanitizeObject(body);

    // Validate required fields
    if (!sanitized.userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: sanitized.userId },
    });

    if (!user) {
      await logUserManagement({
        action: "password_reset",
        targetUserId: sanitized.userId,
        adminUserId: session.user.id,
        adminUserName: session.user.name || undefined,
        success: false,
        errorMessage: "User not found",
        request: req,
      });

      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Generate temporary password
    const temporaryPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Update user password
    await prisma.user.update({
      where: { id: sanitized.userId },
      data: { password: hashedPassword },
    });

    // Log the action
    await logUserManagement({
      action: "password_reset",
      targetUserId: user.id,
      targetUserEmail: user.email,
      adminUserId: session.user.id,
      adminUserName: session.user.name || undefined,
      success: true,
      request: req,
    });

    // In production, send email with temporary password
    // For now, return it (NOT SECURE - for development only)
    return NextResponse.json({
      success: true,
      message: "Password reset successfully. In production, an email would be sent.",
      // Remove this in production and send via email instead
      temporaryPassword,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    
    const session = await auth();
    await logUserManagement({
      action: "password_reset",
      adminUserId: session?.user?.id,
      adminUserName: session?.user?.name || undefined,
      success: false,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      request: req,
    });

    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
