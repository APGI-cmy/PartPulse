import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    console.log("[first-admin] Checking if first admin can be created...")
    
    // Check if any admin users exist
    const adminCount = await prisma.user.count({
      where: { role: "admin" },
    })
    console.log(`[first-admin] Current admin count: ${adminCount}`)

    // Can only create first admin if no admins exist
    const canCreate = adminCount === 0
    console.log(`[first-admin] Can create first admin: ${canCreate}`)
    
    return NextResponse.json({
      canCreate,
    })
  } catch (error) {
    // Enhanced logging to surface exact Prisma error
    console.error("Error checking first admin status:", error)
    console.error("Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    // Return detailed error in development, generic in production
    const isDevelopment = process.env.NODE_ENV === "development"
    return NextResponse.json(
      { 
        error: "Failed to check setup status",
        ...(isDevelopment && { details: errorMessage })
      },
      { status: 500 }
    )
  }
}
