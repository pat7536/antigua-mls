export default function UserManagementPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage users and their permissions</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            User Management Coming Soon
          </h2>
          <p className="text-gray-600 mb-6">
            This feature is currently under development. You&apos;ll be able to manage user roles, 
            permissions, and account settings here.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>• View all registered users</p>
            <p>• Manage user roles (Admin, Agent, Buyer)</p>
            <p>• Review agent applications</p>
            <p>• Set user permissions</p>
          </div>
        </div>
      </div>
    </div>
  );
}