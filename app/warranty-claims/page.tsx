import Header from "@/components/layout/Header";
import { Card, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function WarrantyClaimsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Warranty Claims" 
        description="This page will allow technicians to submit and track warranty claims for defective parts."
      >
        <Button variant="primary">+ New Claim</Button>
      </Header>
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardBody className="text-center py-12 text-gray-500">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-lg font-medium mb-2">No warranty claims yet</p>
              <p className="text-sm">Submit your first warranty claim to get started</p>
            </CardBody>
          </Card>

          {/* Placeholder for upcoming form */}
          <div className="mt-6">
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Upcoming Features</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Submit warranty claims with part details and failure descriptions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Track claim status (Submitted, Under Review, Approved, Denied, Resolved)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Upload photos of defective parts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>View claim history and resolution details</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Generate PDF reports for warranty claims</span>
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
