'use client';

import { useUser } from '@clerk/nextjs';

export default function DashboardHome() {
  const { user } = useUser();

  const stats = [
    { name: 'Saved Properties', value: '12', icon: '🏠' },
    { name: 'Property Views', value: '1,247', icon: '👁️' },
    { name: 'Inquiries Made', value: '28', icon: '📧' },
    { name: 'Active Searches', value: '3', icon: '🔍' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName || 'Agent'}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your properties today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors">
              <div className="font-medium text-blue-900">Browse All Properties</div>
              <div className="text-sm text-blue-700">View the latest listings</div>
            </button>
            <button className="w-full text-left p-3 rounded-md bg-green-50 hover:bg-green-100 transition-colors">
              <div className="font-medium text-green-900">View Saved Properties</div>
              <div className="text-sm text-green-700">Check your bookmarked listings</div>
            </button>
            <button className="w-full text-left p-3 rounded-md bg-purple-50 hover:bg-purple-100 transition-colors">
              <div className="font-medium text-purple-900">Market Analytics</div>
              <div className="text-sm text-purple-700">View market trends and data</div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">🏠</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Saved property in Jolly Harbour</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">👁️</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Viewed 12 properties</p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm">📧</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Made inquiry about luxury villa</p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}