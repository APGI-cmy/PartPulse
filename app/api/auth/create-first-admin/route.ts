import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { sanitizeObject } from "@/lib/validators"
import { logUserManagement } from "@/lib/logging/systemLog"

export async function POST(req: NextRequest) {
  try {
    // Check if any admin users already exist
    const adminCount = await prisma.user.count({
      where: { role: "admin" },
    })

    if (adminCount > 0) {
      return NextResponse.json(
        { error: "First admin has already been created. Please sign in or contact your administrator." },
        { status: 403 }
      )
    }

    const body = await req.json()
    const sanitized = sanitizeObject(body)

    // Validate required fields
    if (!sanitized.email || !sanitized.name || !sanitized.password) {
      return NextResponse.json(
        { error: "Email, name, and password are required" },
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

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitized.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(sanitized.password, 10)

    // Create first admin user
    const user = await prisma.user.create({
      data: {
        email: sanitized.email,
        name: sanitized.name,
        password: hashedPassword,
        role: "admin",
      },
    })

    // Log the first admin creation
    await logUserManagement({
      action: "first_admin_created",
      targetUserId: user.id,
      targetUserEmail: user.email,
      success: true,
      request: req,
    })

    return NextResponse.json({
      success: true,
      message: "First admin account created successfully. You can now sign in.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Error creating first admin:", error)
    
    await logUserManagement({
      action: "first_admin_created",
      success: false,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      request: req,
    })

    return NextResponse.json(
      { error: "Failed to create admin account" },
      { status: 500 }
    )
  }
}
