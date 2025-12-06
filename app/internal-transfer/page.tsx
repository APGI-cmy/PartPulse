import Header from "@/components/layout/Header";
import { Card, CardBody } from "@/components/ui/card";
import InternalTransferForm from "./InternalTransferForm";

export default function InternalTransferPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Internal Transfer" 
        description="Submit and track internal part movements."
      />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <InternalTransferForm />

          {/* Information Card */}
          <div className="mt-6">
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Use</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Fill in all required fields marked with an asterisk (*)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Select the appropriate transfer type based on your needs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Provide detailed descriptions to ensure proper tracking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>After submission, you can view and download the transfer report</span>
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
