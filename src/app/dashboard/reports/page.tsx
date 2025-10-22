export default function ReportsPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">View platform usage and performance metrics</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Reports & Analytics Coming Soon
          </h2>
          <p className="text-gray-600 mb-6">
            This feature is currently under development. You&apos;ll be able to view detailed 
            analytics and generate reports here.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>• Property listing performance</p>
            <p>• User engagement metrics</p>
            <p>• Favorites lists usage</p>
            <p>• Agent activity reports</p>
            <p>• Market trends analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
}