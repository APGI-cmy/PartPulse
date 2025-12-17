import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
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

    // Check if there's already a pending invitation for this email
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email: sanitized.email,
        accepted: false,
        expires: {
          gt: new Date(),
        },
      },
    })

    if (existingInvitation) {
      return NextResponse.json(
        { error: "An invitation for this email is already pending" },
        { status: 400 }
      )
    }

    // Generate secure invitation token
    const invitationToken = crypto.randomBytes(32).toString('hex')
    
    // Token expires in 7 days
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // Create invitation record
    const invitation = await prisma.invitation.create({
      data: {
        email: sanitized.email,
        name: sanitized.name,
        role: sanitized.role || "technician",
        token: invitationToken,
        expires: expiresAt,
        createdBy: session.user.id,
      },
    })

    // Log the invitation
    await logUserManagement({
      action: "user_invited",
      targetUserEmail: invitation.email,
      adminUserId: session.user.id,
      adminUserName: session.user.name || undefined,
      success: true,
      request: req,
    })

    // Build invitation URL
    const invitationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/signup?token=${invitationToken}`

    // TODO: Send email with invitation link
    // For now, return the invitation URL in the response
    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        name: invitation.name,
        role: invitation.role,
        expiresAt: invitation.expires,
      },
      invitationUrl,
      message: "User invited successfully. In production, an email would be sent with the invitation link.",
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
