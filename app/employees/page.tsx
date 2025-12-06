import Header from "@/components/layout/Header";
import { Card, CardBody } from "@/components/ui/card";
import Button from "@/components/ui/button";

export default function EmployeesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Employees" 
        description="This page will allow admins to manage employees, invite new members, and assign roles."
      >
        <Button variant="primary">+ Invite Employee</Button>
      </Header>
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardBody className="text-center py-12 text-gray-500">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-lg font-medium mb-2">No employees yet</p>
              <p className="text-sm">Invite your first employee to get started</p>
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
                    <span>Invite new employees via email with role assignment (Admin/Technician)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>View and manage all employees in the organization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Edit employee roles and permissions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Track pending invitations and resend if needed</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>View employee activity and login history</span>
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
