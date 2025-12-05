import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { sanitizeObject } from "@/lib/validators"
import { logUserManagement } from "@/lib/logging/systemLog"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const sanitized = sanitizeObject(body)

    // Validate required fields
    if (!sanitized.email || !sanitized.name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitized.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Generate secure temporary password (in production, send via email)
    const temporaryPassword = crypto.randomBytes(4).toString('hex') // 8 characters
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: sanitized.email,
        name: sanitized.name,
        password: hashedPassword,
        role: sanitized.role || "technician",
      },
    })

    // Log the user creation
    await logUserManagement({
      action: "user_invited",
      targetUserId: user.id,
      targetUserEmail: user.email,
      adminUserId: session.user.id,
      adminUserName: session.user.name || undefined,
      success: true,
      request: req,
    })

    // In production, send email with invitation link
    // For now, return the temporary password (NOT SECURE - for development only)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      // Remove this in production and send via email instead
      temporaryPassword,
      message: "User invited successfully. In production, an email would be sent.",
    })
  } catch (error) {
    console.error("Error inviting user:", error)
    
    const session = await auth()
    await logUserManagement({
      action: "user_invited",
      adminUserId: session?.user?.id,
      adminUserName: session?.user?.name || undefined,
      success: false,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      request: req,
    })

    return NextResponse.json(
      { error: "Failed to invite user" },
      { status: 500 }
    )
  }
}
