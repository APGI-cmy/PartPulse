import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { sanitizeObject } from "@/lib/validators"
import { logUserManagement, logEvent } from "@/lib/logging/systemLog"
import { sendInvitationEmail } from "@/lib/email/sendInvitationEmail"
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
    const baseUrl = process.env.NEXTAUTH_URL;
    if (!baseUrl) {
      throw new Error('NEXTAUTH_URL environment variable is not configured');
    }
    const invitationUrl = `${baseUrl}/auth/signup?token=${invitationToken}`

    // Log email queued
    await logEvent({
      eventType: "user_management",
      action: "invitation_email_queued",
      userId: session.user.id,
      userName: session.user.name || session.user.email,
      details: {
        targetEmail: invitation.email,
        targetName: invitation.name,
        role: invitation.role,
      },
    });

    // Send invitation email
    try {
      const emailResult = await sendInvitationEmail({
        email: invitation.email,
        name: invitation.name,
        role: invitation.role,
        invitationUrl,
        expiresAt: invitation.expires,
        invitedBy: session.user.name || session.user.email,
      });

      // Log email sent/failed
      await logEvent({
        eventType: "user_management",
        action: emailResult.success ? "invitation_email_sent" : "invitation_email_failed",
        userId: session.user.id,
        userName: session.user.name || session.user.email,
        details: {
          targetEmail: invitation.email,
          targetName: invitation.name,
          messageId: emailResult.messageId,
        },
        success: emailResult.success,
        errorMessage: emailResult.error,
      });

      // Return success response
      return NextResponse.json({
        success: true,
        invitation: {
          id: invitation.id,
          email: invitation.email,
          name: invitation.name,
          role: invitation.role,
          expiresAt: invitation.expires,
        },
        invitationUrl: emailResult.success ? undefined : invitationUrl, // Only return URL if email failed
        message: emailResult.success 
          ? "User invited successfully. An invitation email has been sent."
          : `User invited, but email delivery failed: ${emailResult.error}. Please share this invitation link manually: ${invitationUrl}`,
        emailSent: emailResult.success,
      });
    } catch (emailError) {
      console.error("Error sending invitation email:", emailError);
      
      // Log email error
      await logEvent({
        eventType: "user_management",
        action: "invitation_email_failed",
        userId: session.user.id,
        userName: session.user.name || session.user.email,
        details: {
          targetEmail: invitation.email,
          targetName: invitation.name,
        },
        success: false,
        errorMessage: emailError instanceof Error ? emailError.message : "Unknown error",
      });

      // Return success with warning about email failure
      return NextResponse.json({
        success: true,
        invitation: {
          id: invitation.id,
          email: invitation.email,
          name: invitation.name,
          role: invitation.role,
          expiresAt: invitation.expires,
        },
        invitationUrl, // Return URL for manual sharing
        message: `User invited, but email delivery failed. Please share this invitation link manually: ${invitationUrl}`,
        emailSent: false,
      });
    }
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
