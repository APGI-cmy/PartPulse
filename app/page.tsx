import { Card, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Welcome to PartPulse
          </h1>
          <p className="text-gray-600">
            Streamline your part distribution, warranty claims, and employee management
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Internal Transfers Card */}
          <Card hover>
            <CardBody>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white text-2xl mr-4">
                  →
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Internal Transfers
                </h2>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Manage part transfers between locations and track their status.
              </p>
              <Link href="/internal-transfer">
                <Button variant="primary" className="w-full">
                  View Transfers
                </Button>
              </Link>
            </CardBody>
          </Card>

          {/* Warranty Claims Card */}
          <Card hover>
            <CardBody>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-warning rounded-lg flex items-center justify-center text-white text-2xl mr-4">
                  ⚠
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Warranty Claims
                </h2>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Submit and track warranty claims for defective parts.
              </p>
              <Link href="/warranty-claims">
                <Button variant="primary" className="w-full">
                  View Claims
                </Button>
              </Link>
            </CardBody>
          </Card>

          {/* Employees Card */}
          <Card hover>
            <CardBody>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-info rounded-lg flex items-center justify-center text-white text-2xl mr-4">
                  👥
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Employees
                </h2>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Manage employees and invite new team members.
              </p>
              <Link href="/employees">
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
                <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center text-white text-2xl mr-4">
                  📊
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Reports
                </h2>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Generate and view detailed reports on transfers and claims.
              </p>
              <Link href="/reports">
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
              <Link href="/settings">
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
