import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      )
    }

    // Find invitation by token
    const invitation = await prisma.invitation.findUnique({
      where: { token },
    })

    if (!invitation) {
      return NextResponse.json(
        { error: "Invalid invitation token" },
        { status: 404 }
      )
    }

    // Check if invitation has expired
    if (new Date() > invitation.expires) {
      return NextResponse.json(
        { error: "This invitation has expired. Please contact your administrator for a new invitation." },
        { status: 400 }
      )
    }

    // Check if invitation has already been accepted
    if (invitation.accepted) {
      return NextResponse.json(
        { error: "This invitation has already been used." },
        { status: 400 }
      )
    }

    // Note: We don't check if user already exists here to prevent email enumeration
    // This check will be done during the actual signup process
    
    // Return invitation details
    return NextResponse.json({
      invitation: {
        email: invitation.email,
        name: invitation.name,
        role: invitation.role,
      },
    })
  } catch (error) {
    console.error("Error verifying invitation:", error)
    return NextResponse.json(
      { error: "Failed to verify invitation" },
      { status: 500 }
    )
  }
}
