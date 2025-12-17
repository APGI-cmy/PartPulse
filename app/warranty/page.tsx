"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { Card, CardBody } from "@/components/ui/card";
import Button from "@/components/ui/button";

export default function WarrantyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Warranty Claims" 
        description="Manage warranty claims for defective Trane parts"
      >
        <Button 
          variant="primary"
          onClick={() => router.push('/warranty-claims')}
        >
          + New Claim
        </Button>
      </Header>
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardBody className="text-center">
                <div className="text-4xl mb-2">📋</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Submit Claims</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Submit warranty claims for defective parts
                </p>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => router.push('/warranty-claims')}
                >
                  New Claim
                </Button>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <div className="text-4xl mb-2">🔍</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">View Claims</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Track status and view claim details
                </p>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => router.push('/reports')}
                >
                  View Reports
                </Button>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <div className="text-4xl mb-2">✅</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Process Claims</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Review and approve warranty claims
                </p>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => router.push('/settings/admin')}
                >
                  Admin Dashboard
                </Button>
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Warranty Claims Process</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">Submit Claim</h3>
                    <p className="text-sm text-gray-600">
                      Complete the warranty claim form with part details, serial numbers, and failure information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">Admin Review</h3>
                    <p className="text-sm text-gray-600">
                      Administrators review the claim for completeness and verify warranty coverage.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">Approval Decision</h3>
                    <p className="text-sm text-gray-600">
                      Claim is approved or rejected with admin signature and processing stamp.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">Resolution</h3>
                    <p className="text-sm text-gray-600">
                      Approved claims are processed for parts replacement. You'll receive email notifications at each step.
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
