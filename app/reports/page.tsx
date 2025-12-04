export default function ReportsPage() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Transfer Reports */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Transfer Reports</h2>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-primary hover:underline">
                  Transfer Summary
                </a>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline">
                  Transfers by User
                </a>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline">
                  Transfers by Part
                </a>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline">
                  Transfer Timeline
                </a>
              </li>
            </ul>
          </div>

          {/* Warranty Reports */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Warranty Reports</h2>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-primary hover:underline">
                  Claims Summary
                </a>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline">
                  Claim Rate Analysis
                </a>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline">
                  Claims by Part
                </a>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline">
                  Resolution Time
                </a>
              </li>
            </ul>
          </div>

          {/* User Activity Reports */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Activity</h2>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-primary hover:underline">
                  User Activity Log
                </a>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline">
                  Login History
                </a>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline">
                  Invitation Status
                </a>
              </li>
            </ul>
          </div>

          {/* Audit Reports (Admin Only) */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Audit Reports</h2>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-primary hover:underline">
                  Complete Audit Trail
                </a>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline">
                  Security Events
                </a>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline">
                  Data Access Log
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate Custom Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Select report type...</option>
                <option>Transfer Summary</option>
                <option>Warranty Claims</option>
                <option>User Activity</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <button className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors">
              Generate Report
            </button>
            <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
              Export as PDF
            </button>
            <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
              Export as CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
