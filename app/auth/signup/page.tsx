"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [invitation, setInvitation] = useState<{
    email: string;
    name: string;
    role: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing invitation token");
      setLoading(false);
      return;
    }

    // Verify invitation token
    fetch(`/api/auth/verify-invitation?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setInvitation(data.invitation);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to verify invitation");
        setLoading(false);
      });
  }, [token]);

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];
    if (pwd.length < 16) {
      errors.push("Password must be at least 16 characters long");
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[0-9]/.test(pwd)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      errors.push("Password must contain at least one special character");
    }
    return errors;
  };

  const handlePasswordChange = (pwd: string) => {
    setPassword(pwd);
    setPasswordErrors(validatePassword(pwd));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate password
    const errors = validatePassword(password);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/complete-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to complete signup");
        setSubmitting(false);
        return;
      }

      // Redirect to signin with success message
      router.push("/auth/signin?signup=success");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying invitation...</p>
        </div>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Invalid Invitation
              </h2>
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
              <p className="text-gray-600 mb-6">
                This invitation link may have expired or is invalid. Please
                contact your administrator for a new invitation.
              </p>
              <Link
                href="/auth/signin"
                className="text-primary hover:underline"
              >
                Return to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: "#FF2B00" }}
            >
              PartPulse
            </h1>
            <h2 className="text-2xl font-bold text-gray-900">
              Complete Your Registration
            </h2>
            <p className="text-gray-600 mt-2">
              Welcome! Create your password to get started.
            </p>
          </div>

          {invitation && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Name:</span> {invitation.name}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Email:</span> {invitation.email}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Role:</span>{" "}
                <span className="capitalize">{invitation.role}</span>
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Create a strong password"
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
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Confirm your password"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Password Requirements:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li
                  className={
                    password.length >= 16 ? "text-green-600" : "text-gray-600"
                  }
                >
                  ✓ At least 16 characters
                </li>
                <li
                  className={
                    /[A-Z]/.test(password) ? "text-green-600" : "text-gray-600"
                  }
                >
                  ✓ One uppercase letter
                </li>
                <li
                  className={
                    /[0-9]/.test(password) ? "text-green-600" : "text-gray-600"
                  }
                >
                  ✓ One number
                </li>
                <li
                  className={
                    /[!@#$%^&*(),.?":{}|<>]/.test(password)
                      ? "text-green-600"
                      : "text-gray-600"
                  }
                >
                  ✓ One special character
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={submitting || passwordErrors.length > 0}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              style={
                submitting || passwordErrors.length > 0
                  ? {}
                  : { backgroundColor: "#FF2B00" }
              }
            >
              {submitting ? "Creating Account..." : "Complete Registration"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
