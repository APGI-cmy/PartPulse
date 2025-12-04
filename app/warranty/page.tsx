export default function WarrantyClaimsPage() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Warranty Claims</h1>
          <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors">
            + New Claim
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search claims..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <select className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary">
                <option>All Status</option>
                <option>Submitted</option>
                <option>Under Review</option>
                <option>Approved</option>
                <option>Denied</option>
                <option>Resolved</option>
              </select>
            </div>
          </div>

          <div className="p-6">
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No warranty claims found</p>
              <p className="text-sm">Submit your first warranty claim to get started</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
