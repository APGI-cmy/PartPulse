"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { Card, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const transferId = searchParams.get("id");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Transfer Submitted"
        description="Your internal transfer has been successfully submitted."
      />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardBody className="text-center py-12">
              {/* Success Icon */}
              <div className="mb-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                  <svg
                    className="h-10 w-10 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Success Message */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Internal Transfer Submitted Successfully!
              </h2>
              <p className="text-gray-600 mb-8">
                Your transfer request has been recorded and is being processed.
              </p>

              {/* Transfer ID */}
              {transferId && (
                <div className="bg-gray-50 rounded-lg p-4 mb-8">
                  <p className="text-sm text-gray-600 mb-1">Transfer ID</p>
                  <p className="text-lg font-mono font-semibold text-gray-900">
                    {transferId}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/internal-transfer">
                  <Button variant="secondary">
                    Back to Transfers
                  </Button>
                </Link>
                {transferId && (
                  <Link href={`/internal-transfer/${transferId}`}>
                    <Button variant="primary">
                      View Report
                    </Button>
                  </Link>
                )}
              </div>

              {/* Additional Info */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  You will receive a confirmation email shortly. The transfer
                  report is available for download and can be accessed at any
                  time from the transfers list.
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Next Steps */}
          <div className="mt-6">
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  What happens next?
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-0.5">✓</span>
                    <span>
                      Your transfer has been logged in the system
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-0.5">✓</span>
                    <span>
                      A PDF report has been generated and is available for download
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-0.5">○</span>
                    <span className="text-gray-400">
                      Email notifications will be sent (coming soon)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-0.5">○</span>
                    <span className="text-gray-400">
                      Audit trail has been created (coming soon)
                    </span>
                  </li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InternalTransferSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header title="Loading..." description="Please wait" />
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardBody className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
