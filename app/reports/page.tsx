import Header from "@/components/layout/Header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Reports" 
        description="This page will allow users to generate and view detailed analytics and reports."
      />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Transfer Reports Card */}
            <Card>
              <CardHeader>
                <CardTitle>Transfer Reports</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-600 mb-4">
                  Analytics and insights on internal part transfers
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    Transfer Summary
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    Transfers by User
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    Transfers by Part
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    Transfer Timeline
                  </li>
                </ul>
              </CardBody>
            </Card>

            {/* Warranty Reports Card */}
            <Card>
              <CardHeader>
                <CardTitle>Warranty Reports</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-600 mb-4">
                  Track and analyze warranty claim patterns
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    Claims Summary
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    Claim Rate Analysis
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    Claims by Part
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    Resolution Time
                  </li>
                </ul>
              </CardBody>
            </Card>

            {/* User Activity Card */}
            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-600 mb-4">
                  Monitor user engagement and activity
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    User Activity Log
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    Login History
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    Invitation Status
                  </li>
                </ul>
              </CardBody>
            </Card>
          </div>

          {/* Placeholder for upcoming charts and filters */}
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Features</CardTitle>
              </CardHeader>
              <CardBody>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Interactive charts and graphs for visual data analysis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Date range filters for custom report periods</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Export reports as PDF, CSV, or Excel</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Scheduled reports delivered via email</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Role-based data filtering (Technicians see only their data)</span>
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
