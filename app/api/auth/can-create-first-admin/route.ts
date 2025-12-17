import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Check if any admin users exist
    const adminCount = await prisma.user.count({
      where: { role: "admin" },
    })

    // Can only create first admin if no admins exist
    return NextResponse.json({
      canCreate: adminCount === 0,
    })
  } catch (error) {
    console.error("Error checking first admin status:", error)
    return NextResponse.json(
      { error: "Failed to check setup status" },
      { status: 500 }
    )
  }
}
