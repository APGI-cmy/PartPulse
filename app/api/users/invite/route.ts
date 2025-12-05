import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { sanitizeObject } from "@/lib/validators"

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

    // Generate temporary password (in production, send via email)
    const temporaryPassword = Math.random().toString(36).slice(-8)
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
    return NextResponse.json(
      { error: "Failed to invite user" },
      { status: 500 }
    )
  }
}
