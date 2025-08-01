'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSavedProperties } from '@/contexts/SavedPropertiesContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import Header from '../../components/Header';
import RoleSelector from '@/components/RoleSelector';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const { savedProperties } = useSavedProperties();
  const { role, permissions, loading: roleLoading } = useUserRole();

  if (!isLoaded || roleLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Check if user has permission to access dashboard
  if (!permissions.canViewDashboard) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Restricted
            </h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to access the dashboard.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Properties
            </Link>
          </div>

          {/* Role Selector to allow users to change their role */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Change Your Role
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Switch to a role with dashboard access to continue.
            </p>
            <RoleSelector />
          </div>
        </div>
      </div>
    );
  }

  // Role-based navigation items
  const baseNavigation = [
    {
      name: 'Overview',
      href: '/dashboard',
      current: pathname === '/dashboard',
      show: true,
    },
    {
      name: 'Saved Properties',
      href: '/dashboard/saved-properties',
      current: pathname === '/dashboard/saved-properties',
      badge: savedProperties.length,
      show: permissions.canSaveProperties,
    },
    {
      name: 'Market Data',
      href: '/dashboard/market-data',
      current: pathname === '/dashboard/market-data',
      show: permissions.canViewMarketData,
    },
  ];

  // Add admin-only navigation items
  if (role === 'admin') {
    baseNavigation.push(
      {
        name: 'User Management',
        href: '/dashboard/users',
        current: pathname === '/dashboard/users',
        show: true,
      },
      {
        name: 'Reports',
        href: '/dashboard/reports',
        current: pathname === '/dashboard/reports',
        show: true,
      }
    );
  }

  const navigation = baseNavigation.filter((item) => item.show);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <div className="p-6">
            {/* User Profile Section */}
            <div className="mb-8 pb-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    role === 'admin'
                      ? 'bg-red-600'
                      : role === 'agent'
                        ? 'bg-blue-600'
                        : 'bg-gray-600'
                  }`}
                >
                  <span className="text-white font-semibold text-sm">
                    {user?.firstName?.[0] ||
                      user?.emailAddresses?.[0]?.emailAddress?.[0] ||
                      'A'}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {user?.firstName || 'User'}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        role === 'admin'
                          ? 'bg-red-100 text-red-700'
                          : role === 'agent'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    item.current
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span>{item.name}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Quick Stats */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Saved Properties</span>
                  <span className="font-medium text-gray-900">
                    {savedProperties.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">This Week</span>
                  <span className="font-medium text-green-600">+2</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <Link
                href="/"
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden">
          <div className="p-8 max-w-7xl mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
