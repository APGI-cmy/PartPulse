import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const token = req.auth
  const path = req.nextUrl.pathname

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

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/internal-transfer/:path*",
    "/warranty-claims/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/users/:path*",
    "/employees/:path*",
  ],
}
