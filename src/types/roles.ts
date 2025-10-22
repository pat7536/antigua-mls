export type UserRole = 'admin' | 'agent' | 'viewer';

export interface UserRolePermissions {
  canViewDashboard: boolean;
  canSaveProperties: boolean;
  canViewMarketData: boolean;
  canViewAllProperties: boolean;
  canManageUsers?: boolean;
  canAccessReports?: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, UserRolePermissions> = {
  admin: {
    canViewDashboard: true,
    canSaveProperties: true,
    canViewMarketData: true,
    canViewAllProperties: true,
    canManageUsers: true,
    canAccessReports: true,
  },
  agent: {
    canViewDashboard: true,
    canSaveProperties: true,
    canViewMarketData: true,
    canViewAllProperties: true,
  },
  viewer: {
    canViewDashboard: true,
    canSaveProperties: true,
    canViewMarketData: false,
    canViewAllProperties: true,
  },
};

export const DEFAULT_ROLE: UserRole = 'agent';
