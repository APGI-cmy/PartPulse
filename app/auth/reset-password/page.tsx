"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tokenParam = searchParams.get("token") || ""
  const [token] = useState(tokenParam)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(
    tokenParam ? "" : "Invalid reset link. Please request a new password reset."
  )
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = []
    if (pwd.length < 16) {
      errors.push("Password must be at least 16 characters long")
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push("Password must contain at least one uppercase letter")
    }
    if (!/[0-9]/.test(pwd)) {
      errors.push("Password must contain at least one number")
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      errors.push("Password must contain at least one special character")
    }
    return errors
  }

  const handlePasswordChange = (pwd: string) => {
    setPassword(pwd)
    setPasswordErrors(validatePassword(pwd))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate password
    const errors = validatePassword(password)
    if (errors.length > 0) {
      setPasswordErrors(errors)
      return
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to reset password")
        setLoading(false)
        return
      }

      // Redirect to signin with success message
      router.push("/auth/signin?reset=success")
    } catch {
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  if (!token && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Set New Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#FF2B00] focus:border-[#FF2B00] focus:z-10 sm:text-sm"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
            />
            {passwordErrors.length > 0 && (
              <ul className="mt-2 text-sm text-red-600 space-y-1">
                {passwordErrors.map((err, idx) => (
                  <li key={idx}>• {err}</li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#FF2B00] focus:border-[#FF2B00] focus:z-10 sm:text-sm"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Password Requirements:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className={password.length >= 16 ? "text-green-600" : "text-gray-600"}>
                ✓ At least 16 characters
              </li>
              <li className={/[A-Z]/.test(password) ? "text-green-600" : "text-gray-600"}>
                ✓ One uppercase letter
              </li>
              <li className={/[0-9]/.test(password) ? "text-green-600" : "text-gray-600"}>
                ✓ One number
              </li>
              <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-green-600" : "text-gray-600"}>
                ✓ One special character
              </li>
            </ul>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || passwordErrors.length > 0 || !token}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF2B00] hover:bg-[#E02700] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF2B00] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/signin"
              className="text-sm text-[#FF2B00] hover:underline font-medium"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
