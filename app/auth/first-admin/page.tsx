"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FirstAdminSetup() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [canSetup, setCanSetup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  useEffect(() => {
    // Check if first admin can be created
    fetch("/api/auth/can-create-first-admin")
      .then((res) => res.json())
      .then((data) => {
        setCanSetup(data.canCreate);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to check setup status");
        setLoading(false);
      });
  }, []);

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
      const response = await fetch("/api/auth/create-first-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create admin account");
        setSubmitting(false);
        return;
      }

      // Redirect to signin
      router.push("/auth/signin?setup=success");
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
          <p className="text-gray-600">Checking setup status...</p>
        </div>
      </div>
    );
  }

  if (!canSetup) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Setup Already Complete
              </h2>
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
                The first admin has already been created. This setup page is no longer available.
              </div>
              <p className="text-gray-600 mb-6">
                If you need an account, please contact your administrator to send you an invitation.
              </p>
              <Link
                href="/auth/signin"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                style={{ backgroundColor: "#FF2B00" }}
              >
                Go to Sign In
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
              First-Time Setup
            </h2>
            <p className="text-gray-600 mt-2">
              Create the first administrator account
            </p>
          </div>

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              <strong>Welcome!</strong> This is a one-time setup to create the first administrator account. 
              After this, you'll be able to invite other users (admins and technicians) from the admin dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="john.smith@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password *
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
                Confirm Password *
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
              {submitting ? "Creating Admin Account..." : "Create Admin Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>This page will only be available until the first admin is created.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
