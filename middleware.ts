import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { SECURITY_HEADERS } from "@/lib/security/utils"

export default auth((req) => {
  const token = req.auth
  const path = req.nextUrl.pathname
  
  // Create response
  const response = NextResponse.next()

  // Add security headers to all responses
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Allow access to auth pages (signup, first-admin) without authentication
  if (path.startsWith("/auth/")) {
    return response
  }

  // Require authentication for protected routes
  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }

  // Admin-only routes
  if (path.startsWith("/users") || path.startsWith("/settings")) {
    if (token?.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return response
})

export const config = {
  matcher: [
    "/",
    "/internal-transfer/:path*",
    "/warranty-claims/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/users/:path*",
    "/employees/:path*",
  ],
}
