import { Card, CardBody } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Link from "next/link";
import { routes } from "@/lib/routes";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Welcome to PartPulse
          </h1>
          <p className="text-gray-600">
            Internal spare parts distribution for Trane Thermo King
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Internal Transfer Card */}
          <Card hover>
            <CardBody>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl mr-4" style={{ backgroundColor: '#FF2B00' }}>
                  →
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Internal Transfer
                </h2>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Submit internal part transfer notifications for HVAC repair parts.
              </p>
              <Link href={routes.internalTransfer}>
                <Button variant="primary" className="w-full">
                  New Transfer
                </Button>
              </Link>
            </CardBody>
          </Card>

          {/* Warranty Claims Card */}
          <Card hover>
            <CardBody>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl mr-4" style={{ backgroundColor: '#FF2B00' }}>
                  ⚠
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Warranty Claims
                </h2>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Submit parts booked out for warranty claims.
              </p>
              <Link href={routes.warrantyClaims}>
                <Button variant="primary" className="w-full">
                  New Claim
                </Button>
              </Link>
            </CardBody>
          </Card>

          {/* Reports Card */}
          <Card hover>
            <CardBody>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl mr-4" style={{ backgroundColor: '#FF2B00' }}>
                  📊
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Reports
                </h2>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                View and filter transfer and warranty claim notifications.
              </p>
              <Link href={routes.reports}>
                <Button variant="primary" className="w-full">
                  View Reports
                </Button>
              </Link>
            </CardBody>
          </Card>

          {/* Admin Dashboard Card (Admin only - would need auth check) */}
          <Card hover>
            <CardBody>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl mr-4" style={{ backgroundColor: '#FF2B00' }}>
                  🔧
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Admin Settings
                </h2>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Manage users, email notifications, and system settings.
              </p>
              <Link href={routes.settingsAdmin}>
                <Button variant="primary" className="w-full">
                  Admin Dashboard
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>

        {/* Quick Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Start</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="mr-2" style={{ color: '#FF2B00' }}>•</span>
              <span>Use <strong>Internal Transfer</strong> to record parts removed from stock for repairs</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2" style={{ color: '#FF2B00' }}>•</span>
              <span>Use <strong>Warranty Claims</strong> to document parts booked out for warranty-related work</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2" style={{ color: '#FF2B00' }}>•</span>
              <span>All required fields are marked with a <span className="text-red-600">*</span> red asterisk</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2" style={{ color: '#FF2B00' }}>•</span>
              <span>You can add multiple parts to each form using the <strong>"+"</strong> button</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
                <Button variant="primary" className="w-full">
                  View Employees
                </Button>
              </Link>
            </CardBody>
          </Card>

          {/* Reports Card */}
          <Card hover>
            <CardBody>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white text-2xl mr-4">
                  📊
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Reports
                </h2>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Generate and view detailed reports on transfers and claims.
              </p>
              <Link href={routes.reports}>
                <Button variant="primary" className="w-full">
                  View Reports
                </Button>
              </Link>
            </CardBody>
          </Card>

          {/* Settings Card */}
          <Card hover>
            <CardBody>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-white text-2xl mr-4">
                  ⚙
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Settings
                </h2>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Configure system preferences and security settings.
              </p>
              <Link href={routes.settings}>
                <Button variant="primary" className="w-full">
                  View Settings
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardBody className="text-center">
              <p className="text-gray-500 text-sm">Pending Transfers</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-gray-500 text-sm">Open Claims</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-gray-500 text-sm">This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-gray-500 text-sm">Active Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">1</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
