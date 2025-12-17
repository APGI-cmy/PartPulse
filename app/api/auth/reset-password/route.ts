import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { sanitizeObject } from "@/lib/validators"
import { logUserManagement } from "@/lib/logging/systemLog"

/**
 * POST /api/auth/reset-password
 * Reset password using a valid token
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const sanitized = sanitizeObject(body)

    // Validate required fields
    if (!sanitized.token || !sanitized.password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      )
    }

    // Validate password requirements
    if (sanitized.password.length < 16) {
      return NextResponse.json(
        { error: "Password must be at least 16 characters long" },
        { status: 400 }
      )
    }
    if (!/[A-Z]/.test(sanitized.password)) {
      return NextResponse.json(
        { error: "Password must contain at least one uppercase letter" },
        { status: 400 }
      )
    }
    if (!/[0-9]/.test(sanitized.password)) {
      return NextResponse.json(
        { error: "Password must contain at least one number" },
        { status: 400 }
      )
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(sanitized.password)) {
      return NextResponse.json(
        { error: "Password must contain at least one special character" },
        { status: 400 }
      )
    }

    // Find user with valid token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: sanitized.token,
        resetTokenExpiry: {
          gt: new Date(), // Token must not be expired
        },
      },
    })

    if (!user) {
      await logUserManagement({
        action: "password_reset_failed",
        success: false,
        errorMessage: "Invalid or expired token",
        request: req,
      })

      return NextResponse.json(
        { error: "Invalid or expired reset token. Please request a new password reset." },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(sanitized.password, 10)

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    // Log the successful password reset
    await logUserManagement({
      action: "password_reset_completed",
      targetUserId: user.id,
      targetUserEmail: user.email,
      success: true,
      request: req,
    })

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You can now sign in with your new password.",
    })
  } catch (error) {
    console.error("Error resetting password:", error)
    
    await logUserManagement({
      action: "password_reset_completed",
      success: false,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      request: req,
    })

    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    )
  }
}
