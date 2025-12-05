"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { SerializedWarrantyClaim } from "@/types";

export default function WarrantyClaimDetailPage() {
  const params = useParams();
  const router = useRouter();
  const claimId = params.id as string;
  
  const [claim, setClaim] = useState<SerializedWarrantyClaim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClaim() {
      try {
        const response = await fetch(`/api/warranty-claims?id=${claimId}`);
        const result = await response.json();

        if (response.ok && result.success) {
          setClaim(result.data);
        } else {
          setError(result.error?.message || "Failed to load warranty claim");
        }
      } catch (err) {
        console.error("Error fetching warranty claim:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    if (claimId) {
      fetchClaim();
    }
  }, [claimId]);

  const handleDownloadPDF = () => {
    // Stub for PDF download
    alert("PDF download functionality will be implemented in a future update.\n\nThis would download: warranty-claim-" + claimId + ".pdf");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Loading..." description="Please wait" />
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Card>
              <CardBody className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading warranty claim details...</p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Error" description="Warranty claim not found" />
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Card>
              <CardBody className="text-center py-12">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-error"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {error || "Warranty Claim Not Found"}
                </h2>
                <p className="text-gray-600 mb-6">
                  The warranty claim you are looking for does not exist or has been removed.
                </p>
                <Button variant="primary" onClick={() => router.push("/warranty-claims")}>
                  Back to Warranty Claims
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Warranty Claim Details" 
        description={`Claim ID: ${claim.id}`}
      >
        <Button variant="primary" onClick={handleDownloadPDF}>
          Download PDF
        </Button>
      </Header>
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* General Information */}
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="text-base font-medium text-gray-900">{new Date(claim.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Chiller Model</p>
                  <p className="text-base font-medium text-gray-900">{claim.chillerModel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Chiller Serial Number</p>
                  <p className="text-base font-medium text-gray-900">{claim.chillerSerial}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Job Number / SSID #</p>
                  <p className="text-base font-medium text-gray-900">{claim.ssidJobNumber}</p>
                </div>
                {claim.buildingName && (
                  <div>
                    <p className="text-sm text-gray-600">Building Name</p>
                    <p className="text-base font-medium text-gray-900">{claim.buildingName}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Site Name</p>
                  <p className="text-base font-medium text-gray-900">{claim.siteName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Attended By</p>
                  <p className="text-base font-medium text-gray-900">{claim.technicianName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Warranty Status</p>
                  <p className="text-base font-medium text-gray-900">
                    {claim.coveredByWarranty ? '✓ Covered' : '✗ Not Covered'}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Parts Details */}
          <Card>
            <CardHeader>
              <CardTitle>Parts Details</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                {claim.items.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Item {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Part No.</p>
                        <p className="text-base font-medium text-gray-900">{item.partNo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Quantity</p>
                        <p className="text-base font-medium text-gray-900">{item.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Failed Part Serial</p>
                        <p className="text-base font-medium text-gray-900">{item.failedPartSerial}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Replaced Part Serial</p>
                        <p className="text-base font-medium text-gray-900">{item.replacedPartSerial}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date of Failure</p>
                        <p className="text-base font-medium text-gray-900">{new Date(item.dateOfFailure).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date of Repair</p>
                        <p className="text-base font-medium text-gray-900">{new Date(item.dateOfRepair).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Comments */}
          {claim.comments && (
            <Card>
              <CardHeader>
                <CardTitle>Comments</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-gray-900 whitespace-pre-wrap">{claim.comments}</p>
              </CardBody>
            </Card>
          )}

          {/* Processing Status */}
          <Card>
            <CardHeader>
              <CardTitle>Processing Status</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-base font-medium text-gray-900">
                    {claim.status === 'approved' ? '✓ Approved' :
                     claim.status === 'rejected' ? '✗ Rejected' :
                     'Pending Review'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Submitted</p>
                  <p className="text-base font-medium text-gray-900">{new Date(claim.createdAt).toLocaleString()}</p>
                </div>
                {claim.adminProcessedStamp && (
                  <div>
                    <p className="text-sm text-gray-600">Processed Stamp</p>
                    <p className="text-base font-medium text-green-600">✓ Applied</p>
                  </div>
                )}
                {claim.adminDate && (
                  <div>
                    <p className="text-sm text-gray-600">Admin Processed Date</p>
                    <p className="text-base font-medium text-gray-900">
                      {new Date(claim.adminDate).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Admin link */}
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Admin Access:</span> Review and process this claim
                  </p>
                  <Button 
                    variant="primary" 
                    onClick={() => router.push(`/warranty-claims/${claimId}/admin`)}
                  >
                    Admin Review
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Important Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Important Notes</CardTitle>
            </CardHeader>
            <CardBody>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>* Need Serial Number to be able to make a claim (Mandatory).</li>
                <li>* Provide Photos of Failed Parts.</li>
                <li>* Provide Service Reports for Failed Parts.</li>
              </ul>
            </CardBody>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="secondary" onClick={() => router.push("/warranty-claims")}>
              Back to Warranty Claims
            </Button>
            <Button variant="primary" onClick={handleDownloadPDF}>
              Download PDF Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
