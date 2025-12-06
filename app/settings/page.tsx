import Header from "@/components/layout/Header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Settings" 
        description="This page will allow admins to configure system settings and preferences."
      />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {/* System Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-600 mb-4">
                  Configure general system preferences and company information
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    Company name and branding
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    Email configuration
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    Default notification preferences
                  </li>
                </ul>
              </CardBody>
            </Card>

            {/* Security Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-600 mb-4">
                  Manage authentication and security policies
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    Session timeout duration
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    Failed login lockout settings
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    Password requirements
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    Two-factor authentication options
                  </li>
                </ul>
              </CardBody>
            </Card>

            {/* Notification Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-600 mb-4">
                  Control email notifications and alerts
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    Email notifications for transfers
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    Email notifications for warranty claims
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    Audit logging preferences
                  </li>
                </ul>
              </CardBody>
            </Card>

            {/* Placeholder for upcoming settings */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Features</CardTitle>
              </CardHeader>
              <CardBody>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Customizable email templates for notifications</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Data retention policies configuration</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Integration settings for external systems</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Backup and restore functionality</span>
                  </li>
                </ul>
              </CardBody>
            </Card>

            <div className="flex justify-end">
              <Button variant="primary">Save Settings</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
