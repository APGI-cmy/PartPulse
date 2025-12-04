export default function Home() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Welcome to PartPulse
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Internal Transfers Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white text-2xl mr-4">
                →
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Internal Transfers
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Manage part transfers between locations and track their status.
            </p>
            <a
              href="/internal-transfer"
              className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            >
              View Transfers
            </a>
          </div>

          {/* Warranty Claims Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-warning rounded-lg flex items-center justify-center text-white text-2xl mr-4">
                ⚠
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Warranty Claims
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Submit and track warranty claims for defective parts.
            </p>
            <a
              href="/warranty"
              className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            >
              View Claims
            </a>
          </div>

          {/* Reports Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-info rounded-lg flex items-center justify-center text-white text-2xl mr-4">
                📊
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Reports
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Generate and view detailed reports on transfers and claims.
            </p>
            <a
              href="/reports"
              className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            >
              View Reports
            </a>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Pending Transfers</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Open Claims</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">This Month</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Active Users</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">1</p>
          </div>
        </div>
      </div>
    </div>
  );
}
