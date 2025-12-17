import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import crypto from "crypto"
import { sanitizeObject } from "@/lib/validators"
import { logUserManagement } from "@/lib/logging/systemLog"

/**
 * POST /api/auth/request-password-reset
 * Request a password reset token
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const sanitized = sanitizeObject(body)

    // Validate required fields
    if (!sanitized.email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: sanitized.email },
    })

    // Always return success to prevent email enumeration
    // But only send email if user exists
    if (user) {
      // Generate secure reset token
      const resetToken = crypto.randomBytes(32).toString('hex')
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      // Store token in database
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      })

      // Log the password reset request
      await logUserManagement({
        action: "password_reset_requested",
        targetUserId: user.id,
        targetUserEmail: user.email,
        success: true,
        request: req,
      })

      // In production, send email with reset link
      // For now, we'll construct the URL
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`
      
      // TODO: Send email with reset link
      // await sendPasswordResetEmail(user.email, resetUrl)
      
      console.log(`Password reset requested for ${user.email}. Reset URL: ${resetUrl}`)
    }

    // Always return success (prevent email enumeration)
    return NextResponse.json({
      success: true,
      message: "If an account exists with that email, we've sent password reset instructions.",
    })
  } catch (error) {
    console.error("Error requesting password reset:", error)
    
    await logUserManagement({
      action: "password_reset_requested",
      success: false,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      request: req,
    })

    return NextResponse.json(
      { error: "Failed to process password reset request" },
      { status: 500 }
    )
  }
}
