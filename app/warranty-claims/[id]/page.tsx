import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { getWarrantyClaim } from "@/lib/db/schema";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WarrantyClaimDetailPage({ params }: PageProps) {
  const { id } = await params;
  const claim = await getWarrantyClaim(id);

  if (!claim) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Warranty Claim Details" 
        description={`Claim ID: ${claim.id}`}
      >
        <Button variant="primary">Download PDF</Button>
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
                  <p className="text-base font-medium text-gray-900">{claim.date.toLocaleDateString()}</p>
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
                        <p className="text-base font-medium text-gray-900">{item.dateOfFailure.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date of Repair</p>
                        <p className="text-base font-medium text-gray-900">{item.dateOfRepair.toLocaleDateString()}</p>
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
                    {claim.adminProcessedStamp ? '✓ Processed' : 'Pending Review'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Submitted</p>
                  <p className="text-base font-medium text-gray-900">{claim.createdAt.toLocaleString()}</p>
                </div>
              </div>
              
              {/* Admin approval button - future wave */}
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Coming Soon:</span> Admin approval and processing workflow
                </p>
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
        </div>
      </div>
    </div>
  );
}
