"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import type { SerializedWarrantyClaim } from "@/types";

export default function WarrantyClaimAdminPage() {
  const params = useParams();
  const router = useRouter();
  const claimId = params.id as string;
  
  const [claim, setClaim] = useState<SerializedWarrantyClaim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [adminSignature, setAdminSignature] = useState("");

  useEffect(() => {
    async function fetchClaim() {
      try {
        const response = await fetch(`/api/warranty-claims?id=${claimId}`);
        const result = await response.json();

        if (response.ok && result.success) {
          setClaim(result.data);
          setAdminSignature(result.data.adminSignature || "");
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

  const handleApprove = async () => {
    if (!adminSignature.trim()) {
      alert("Please provide an admin signature before approving.");
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(`/api/warranty-claims`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: claimId,
          adminSignature: adminSignature.trim(),
          status: "approved",
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("Warranty claim approved successfully!");
        // Refresh the claim data
        setClaim(result.data);
      } else {
        alert(`Failed to approve: ${result.error?.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error approving warranty claim:", err);
      alert("An unexpected error occurred while approving the claim.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!adminSignature.trim()) {
      alert("Please provide an admin signature before rejecting.");
      return;
    }

    if (!confirm("Are you sure you want to reject this warranty claim?")) {
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(`/api/warranty-claims`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: claimId,
          adminSignature: adminSignature.trim(),
          status: "rejected",
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("Warranty claim rejected.");
        // Refresh the claim data
        setClaim(result.data);
      } else {
        alert(`Failed to reject: ${result.error?.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error rejecting warranty claim:", err);
      alert("An unexpected error occurred while rejecting the claim.");
    } finally {
      setProcessing(false);
    }
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

  const statusColor = 
    claim.status === 'approved' ? 'text-green-600' :
    claim.status === 'rejected' ? 'text-red-600' :
    'text-yellow-600';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Admin - Warranty Claim Review" 
        description={`Claim ID: ${claim.id}`}
      >
        <Button 
          variant="secondary" 
          onClick={() => router.push(`/warranty-claims/${claim.id}`)}
        >
          View Public Page
        </Button>
      </Header>
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Status Banner */}
          {claim.status && claim.status !== 'pending' && (
            <Card>
              <CardBody className="bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current Status</p>
                    <p className={`text-xl font-bold ${statusColor} uppercase`}>
                      {claim.status}
                    </p>
                    {claim.adminProcessedStamp && (
                      <p className="text-sm text-gray-600 mt-1">
                        ✓ Processed Stamp Applied
                      </p>
                    )}
                  </div>
                  {claim.adminDate && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Processed On</p>
                      <p className="text-base font-medium text-gray-900">
                        {new Date(claim.adminDate).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

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
              <CardTitle>Parts Details (6 Columns)</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Part No.
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Failed Part Serial
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Replaced Part Serial
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date of Failure
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date of Repair
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {claim.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.partNo}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.failedPartSerial}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.replacedPartSerial}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(item.dateOfFailure).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(item.dateOfRepair).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

          {/* Admin Processing */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Processing</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <label htmlFor="adminSignature" className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Signature *
                  </label>
                  <input
                    type="text"
                    id="adminSignature"
                    value={adminSignature}
                    onChange={(e) => setAdminSignature(e.target.value)}
                    disabled={claim.status !== 'pending'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your name or initials"
                  />
                  {claim.adminSignature && (
                    <p className="mt-1 text-sm text-gray-500">
                      Current signature: {claim.adminSignature}
                    </p>
                  )}
                </div>

                {claim.status === 'pending' ? (
                  <div className="flex gap-4">
                    <Button
                      variant="primary"
                      onClick={handleApprove}
                      disabled={processing || !adminSignature.trim()}
                      className="flex-1"
                    >
                      {processing ? "Processing..." : "✓ Approve & Apply Processed Stamp"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleReject}
                      disabled={processing || !adminSignature.trim()}
                      className="flex-1"
                    >
                      {processing ? "Processing..." : "✗ Reject"}
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">
                      This claim has already been {claim.status}. 
                      {claim.adminProcessedStamp && " The PROCESSED stamp has been applied to the PDF."}
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="secondary" onClick={() => router.push("/warranty-claims")}>
              Back to Warranty Claims List
            </Button>
            <Button variant="primary" onClick={() => router.push(`/warranty-claims/${claim.id}`)}>
              View Public Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
