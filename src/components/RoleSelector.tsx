'use client';

import { useUserRole } from '@/contexts/UserRoleContext';
import type { UserRole } from '@/types/roles';

export default function RoleSelector() {
  const { role, updateRole, loading } = useUserRole();

  // Only show role selector for admin users
  if (role !== 'admin') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Role Information
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Current role: <span className="font-medium capitalize">{role}</span>
        </p>
        <p className="text-sm text-gray-500">
          {role === 'viewer' && 'You can browse properties and request to become an agent.'}
          {role === 'agent' && 'You have access to save properties and view market data.'}
        </p>
      </div>
    );
  }

  const roles: { value: UserRole; label: string; description: string }[] = [
    {
      value: 'admin',
      label: 'Admin',
      description: 'Full access to all features',
    },
    {
      value: 'agent',
      label: 'Agent',
      description: 'Can save properties and view market data',
    },
    {
      value: 'viewer',
      label: 'Viewer',
      description: 'Can only browse properties',
    },
  ];

  const handleRoleChange = async (newRole: UserRole) => {
    if (newRole !== role) {
      await updateRole(newRole);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Role Management
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Current role: <span className="font-medium">{role}</span>
      </p>

      <div className="space-y-3">
        {roles.map((roleOption) => (
          <button
            key={roleOption.value}
            onClick={() => handleRoleChange(roleOption.value)}
            disabled={loading}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${
              role === roleOption.value
                ? 'border-blue-200 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="font-medium">{roleOption.label}</div>
            <div className="text-sm text-gray-600">
              {roleOption.description}
            </div>
          </button>
        ))}
      </div>

      {loading && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-2"></div>
            Updating role...
          </div>
        </div>
      )}
    </div>
  );
}
