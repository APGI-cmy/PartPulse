import { Card, CardBody, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Link from "next/link";
import { routes } from "@/lib/routes";

export default function PartsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Parts Management
          </h1>
          <p className="text-gray-600">
            Manage Trane parts inventory, track serial numbers, and monitor stock levels
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card hover>
            <CardBody>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white text-2xl mr-4">
                  📦
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Inventory
                </h2>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                View and manage parts inventory across all locations.
              </p>
              <Button variant="primary" className="w-full">
                View Inventory
              </Button>
            </CardBody>
          </Card>

          <Card hover>
            <CardBody>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-info rounded-lg flex items-center justify-center text-white text-2xl mr-4">
                  🔍
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Serial Lookup
                </h2>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Search for parts by serial number and view their history.
              </p>
              <Button variant="primary" className="w-full">
                Search Parts
              </Button>
            </CardBody>
          </Card>

          <Card hover>
            <CardBody>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center text-white text-2xl mr-4">
                  ➕
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Add Parts
                </h2>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Register new parts and update inventory levels.
              </p>
              <Button variant="primary" className="w-full">
                Add New Part
              </Button>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardBody className="text-center">
              <p className="text-gray-500 text-sm">Total Parts</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-gray-500 text-sm">In Stock</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-gray-500 text-sm">Low Stock</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-gray-500 text-sm">Out of Stock</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
