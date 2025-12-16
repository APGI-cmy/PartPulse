import { Card, CardBody } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Link from "next/link";
import { routes } from "@/lib/routes";

export default function TransfersPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Internal Transfers
            </h1>
            <p className="text-gray-600">
              Manage part transfers between locations and track their status
            </p>
          </div>
          <Link href="/internal-transfer">
            <Button variant="primary">
              New Transfer
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card hover>
            <CardBody>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-warning rounded-lg flex items-center justify-center text-white text-2xl mr-4">
                  ⏳
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Pending
                </h2>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Transfers awaiting processing or approval.
              </p>
              <Button variant="primary" className="w-full">
                View Pending
              </Button>
            </CardBody>
          </Card>

          <Card hover>
            <CardBody>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-info rounded-lg flex items-center justify-center text-white text-2xl mr-4">
                  🚚
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  In Transit
                </h2>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Transfers currently being shipped to destination.
              </p>
              <Button variant="primary" className="w-full">
                View In Transit
              </Button>
            </CardBody>
          </Card>

          <Card hover>
            <CardBody>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center text-white text-2xl mr-4">
                  ✓
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Completed
                </h2>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Successfully delivered transfers.
              </p>
              <Button variant="primary" className="w-full">
                View Completed
              </Button>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardBody className="text-center">
              <p className="text-gray-500 text-sm">Total Transfers</p>
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
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-gray-500 text-sm">In Transit</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
