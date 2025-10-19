'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import type { UserRole, UserRolePermissions } from '@/types/roles';
import { ROLE_PERMISSIONS, DEFAULT_ROLE } from '@/types/roles';

type UserRoleContextType = {
  role: UserRole;
  permissions: UserRolePermissions;
  loading: boolean;
  updateRole: (newRole: UserRole) => Promise<void>;
};

const UserRoleContext = createContext<UserRoleContextType | undefined>(
  undefined
);

type UserRoleProviderProps = {
  children: ReactNode;
};

export function UserRoleProvider({ children }: UserRoleProviderProps) {
  const { user, isSignedIn } = useUser();
  const [role, setRole] = useState<UserRole>(DEFAULT_ROLE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn && user) {
      // Check if this is the admin user
      const userEmail = user.primaryEmailAddress?.emailAddress;
      const isAdmin = userEmail === 'pat7536@gmail.com';

      if (isAdmin) {
        // Automatically set admin role for the admin user
        if (user.unsafeMetadata?.role !== 'admin') {
          updateRole('admin');
        } else {
          setRole('admin');
          setLoading(false);
        }
      } else {
        // Get role from Clerk user metadata for non-admin users
        const userRole = user.unsafeMetadata?.role as UserRole;
        setRole(userRole || DEFAULT_ROLE);
        setLoading(false);
      }
    } else if (!isSignedIn) {
      setRole(DEFAULT_ROLE);
      setLoading(false);
    }
  }, [user, isSignedIn]);

  const updateRole = async (newRole: UserRole) => {
    if (!user) return;

    try {
      setLoading(true);

      // Update Clerk user metadata
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role: newRole,
        },
      });

      setRole(newRole);
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setLoading(false);
    }
  };

  const permissions = ROLE_PERMISSIONS[role];

  const value: UserRoleContextType = {
    role,
    permissions,
    loading,
    updateRole,
  };

  return (
    <UserRoleContext.Provider value={value}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole(): UserRoleContextType {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
}
