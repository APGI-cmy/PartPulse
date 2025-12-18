import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { sanitizeObject } from "@/lib/validators"
import { logUserManagement } from "@/lib/logging/systemLog"

export async function POST(req: NextRequest) {
  try {
    console.log("[first-admin] Starting first admin creation process")
    
    // Check if any admin users already exist
    console.log("[first-admin] Checking for existing admin users...")
    const adminCount = await prisma.user.count({
      where: { role: "admin" },
    })
    console.log(`[first-admin] Admin count: ${adminCount}`)

    if (adminCount > 0) {
      return NextResponse.json(
        { error: "First admin has already been created. Please sign in or contact your administrator." },
        { status: 403 }
      )
    }

    const body = await req.json()
    const sanitized = sanitizeObject(body)
    console.log("[first-admin] Request body sanitized successfully")

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
    console.log("[first-admin] Checking for existing user with provided email")
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitized.email },
    })

    if (existingUser) {
      console.log("[first-admin] User with this email already exists")
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    console.log("[first-admin] Hashing password...")
    const hashedPassword = await bcrypt.hash(sanitized.password, 10)
    console.log("[first-admin] Password hashed successfully")

    // Create first admin user
    console.log("[first-admin] Creating admin user in database...")
    const user = await prisma.user.create({
      data: {
        email: sanitized.email,
        name: sanitized.name,
        password: hashedPassword,
        role: "admin",
      },
    })
    console.log("[first-admin] Admin user created successfully, ID:", user.id)

    // Log the first admin creation
    console.log("[first-admin] Logging user management event...")
    await logUserManagement({
      action: "first_admin_created",
      targetUserId: user.id,
      targetUserEmail: user.email,
      success: true,
      request: req,
    })
    console.log("[first-admin] User management event logged successfully")

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
    // Enhanced logging to surface exact Prisma error
    console.error("Error creating first admin:", error)
    console.error("Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    await logUserManagement({
      action: "first_admin_created",
      success: false,
      errorMessage,
      request: req,
    })

    // Return detailed error in development, generic in production
    const isDevelopment = process.env.NODE_ENV === "development"
    return NextResponse.json(
      { 
        error: "Failed to create admin account",
        ...(isDevelopment && { details: errorMessage })
      },
      { status: 500 }
    )
  }
}
