"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface Transfer {
  id: string;
  technician: string;
  department: string;
  transferType: string;
  serial: string;
  model: string;
  part: string;
  description: string;
  reason: string;
  newUnit?: string;
  comments?: string;
  images?: string[];
  signature?: string;
  createdAt: string;
}

export default function InternalTransferDetailPage() {
  const params = useParams();
  const router = useRouter();
  const transferId = params.id as string;
  
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransfer() {
      try {
        const response = await fetch(`/api/internal-transfer?id=${transferId}`);
        const result = await response.json();

        if (response.ok && result.success) {
          // Find the transfer by ID from the list
          const foundTransfer = result.data.find((t: Transfer) => t.id === transferId);
          if (foundTransfer) {
            setTransfer(foundTransfer);
          } else {
            setError("Transfer not found");
          }
        } else {
          setError(result.error?.message || "Failed to load transfer");
        }
      } catch (err) {
        console.error("Error fetching transfer:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    if (transferId) {
      fetchTransfer();
    }
  }, [transferId]);

  const handleDownloadPDF = () => {
    // Stub for PDF download
    alert("PDF download functionality will be implemented in a future update.\n\nThis would download: transfer-" + transferId + ".pdf");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Loading..." description="Please wait" />
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardBody className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading transfer details...</p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !transfer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Error" description="Transfer not found" />
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
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
                  {error || "Transfer Not Found"}
                </h2>
                <p className="text-gray-600 mb-6">
                  The transfer you are looking for does not exist or has been removed.
                </p>
                <Button variant="primary" onClick={() => router.push("/internal-transfer")}>
                  Back to Transfers
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
        title="Transfer Report"
        description={`Transfer ID: ${transfer.id}`}
      >
        <Button variant="primary" onClick={handleDownloadPDF}>
          Download PDF
        </Button>
      </Header>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Transfer Details */}
          <Card>
            <CardHeader>
              <CardTitle>Transfer Information</CardTitle>
            </CardHeader>
            <CardBody>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Transfer ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">{transfer.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(transfer.createdAt).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Technician</dt>
                  <dd className="mt-1 text-sm text-gray-900">{transfer.technician}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Department</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{transfer.department}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Transfer Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{transfer.transferType}</dd>
                </div>
              </dl>
            </CardBody>
          </Card>

          {/* Part Details */}
          <Card>
            <CardHeader>
              <CardTitle>Part Details</CardTitle>
            </CardHeader>
            <CardBody>
              <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Serial Number</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">{transfer.serial}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Model Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{transfer.model}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Part Number</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">{transfer.part}</dd>
                </div>
                <div className="md:col-span-3">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{transfer.description}</dd>
                </div>
                <div className="md:col-span-3">
                  <dt className="text-sm font-medium text-gray-500">Reason for Removal</dt>
                  <dd className="mt-1 text-sm text-gray-900">{transfer.reason}</dd>
                </div>
              </dl>
            </CardBody>
          </Card>

          {/* Additional Information */}
          {(transfer.newUnit || transfer.comments) && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardBody>
                <dl className="space-y-4">
                  {transfer.newUnit && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">New Unit / Job Number</dt>
                      <dd className="mt-1 text-sm text-gray-900">{transfer.newUnit}</dd>
                    </div>
                  )}
                  {transfer.comments && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Comments</dt>
                      <dd className="mt-1 text-sm text-gray-900">{transfer.comments}</dd>
                    </div>
                  )}
                </dl>
              </CardBody>
            </Card>
          )}

          {/* Audit Trail Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">
                  Audit trail functionality will be implemented in a future update.
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  This will show a complete history of all actions taken on this transfer.
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="secondary" onClick={() => router.push("/internal-transfer")}>
              Back to Transfers
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
