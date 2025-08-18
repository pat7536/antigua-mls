'use client';

import { useUser } from '@clerk/nextjs';
import { useSavedProperties } from '@/contexts/SavedPropertiesContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import Link from 'next/link';
import RoleSelector from '@/components/RoleSelector';

export default function DashboardHome() {
  const { user } = useUser();
  const { savedProperties } = useSavedProperties();
  const { role } = useUserRole();

  // Calculate stats
  const totalSaved = savedProperties.length;
  const avgPrice =
    savedProperties.length > 0
      ? Math.round(
          savedProperties.reduce(
            (sum, prop) => sum + (prop.fields.Price || 0),
            0
          ) / savedProperties.length
        )
      : 0;

  // Recent properties (last 3)
  const recentSaved = savedProperties.slice(-3);

  return (
    <div className="space-y-8">
      {/* Top Section: Profile + Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center space-x-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                role === 'admin'
                  ? 'bg-red-500'
                  : role === 'agent'
                    ? 'bg-blue-500'
                    : 'bg-gray-500'
              }`}
            >
              {user?.firstName?.[0] ||
                user?.emailAddresses?.[0]?.emailAddress?.[0] ||
                'A'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                👋 Welcome back, {user?.firstName || 'Agent'}!
              </h2>
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    role === 'admin'
                      ? 'bg-red-100 text-red-700'
                      : role === 'agent'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Role: {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Saved Properties
              </p>
              <p className="text-2xl font-bold text-blue-600">{totalSaved}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Avg. Price
              </p>
              <p className="text-2xl font-bold text-green-600">
                {avgPrice > 0 ? `$${(avgPrice / 1000000).toFixed(1)}M` : '$0'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Views
              </p>
              <p className="text-2xl font-bold text-purple-600">247</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Active Alerts
              </p>
              <p className="text-2xl font-bold text-orange-600">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/"
          className="bg-indigo-50 border border-indigo-200 text-indigo-800 p-4 rounded-xl shadow-sm hover:bg-indigo-100 hover:shadow-md transition-all duration-200 group"
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🔍</span>
            <div>
              <p className="font-semibold">Browse Properties</p>
              <p className="text-sm text-indigo-600">Find new listings</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/saved-properties"
          className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl shadow-sm hover:bg-emerald-100 hover:shadow-md transition-all duration-200 group"
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">💾</span>
            <div>
              <p className="font-semibold">Saved Properties</p>
              <p className="text-sm text-emerald-600">
                {totalSaved} properties
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/resources/agent-academy"
          className="bg-purple-50 border border-purple-200 text-purple-800 p-4 rounded-xl shadow-sm hover:bg-purple-100 hover:shadow-md transition-all duration-200 group"
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🎓</span>
            <div>
              <p className="font-semibold">Agent Academy</p>
              <p className="text-sm text-purple-600">
                Learn, grow, and stay ahead
              </p>
            </div>
          </div>
        </Link>

        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl shadow-sm hover:bg-amber-100 hover:shadow-md transition-all duration-200 group cursor-pointer">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🔔</span>
            <div>
              <p className="font-semibold">Set Alerts</p>
              <p className="text-sm text-amber-600">Get notified</p>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/market-data"
          className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl shadow-sm hover:bg-green-100 hover:shadow-md transition-all duration-200 group"
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📈</span>
            <div>
              <p className="font-semibold">Market Analytics</p>
              <p className="text-sm text-green-600">View trends</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Bottom Section: Recent Activity + Recently Saved */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity Card */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-green-500 text-lg">✓</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Saved property in Jolly Harbour
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 text-lg">👁️</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Viewed 12 properties
                </p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-purple-500 text-lg">📩</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Made inquiry about luxury villa
                </p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Saved Card */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recently Saved
            </h3>
            {totalSaved > 3 && (
              <Link
                href="/dashboard/saved-properties"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all →
              </Link>
            )}
          </div>

          {recentSaved.length > 0 ? (
            <div className="space-y-3">
              {recentSaved.map((property) => (
                <div
                  key={property.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <p className="font-medium text-gray-900 text-sm mb-1">
                    {property.fields.Title || 'Untitled Property'}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600">
                      {property.fields.Price
                        ? `$${(property.fields.Price / 1000000).toFixed(1)}M`
                        : 'Price on request'}
                    </p>
                    {property.fields.Location && (
                      <p className="text-xs text-gray-500">
                        {property.fields.Location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🏠</div>
              <p className="text-gray-600 mb-3">No saved properties yet</p>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start browsing properties
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Role Management */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Role Management
        </h3>
        <RoleSelector />
      </div>
    </div>
  );
}
