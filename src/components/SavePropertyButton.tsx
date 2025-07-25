'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSavedProperties } from '@/contexts/SavedPropertiesContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import type { Property } from '@/types/property';

type SavePropertyButtonProps = {
  property: Property;
};

export default function SavePropertyButton({
  property,
}: SavePropertyButtonProps) {
  const { isSignedIn } = useUser();
  const { isSaved, saveProperty, removeSavedProperty } = useSavedProperties();
  const { permissions } = useUserRole();
  const [loading, setLoading] = useState(false);

  const isPropertySaved = isSaved(property.id);

  const toggleSave = async () => {
    if (!isSignedIn || !permissions.canSaveProperties) {
      return;
    }

    setLoading(true);

    try {
      if (isPropertySaved) {
        removeSavedProperty(property.id);
      } else {
        saveProperty(property);
      }
    } catch (error) {
      console.error('Error toggling save status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hide save button if user doesn't have permission or isn't signed in
  if (!isSignedIn || !permissions.canSaveProperties) {
    return null;
  }

  return (
    <button
      onClick={toggleSave}
      disabled={loading}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
        isPropertySaved
          ? 'bg-red-500 hover:bg-red-600 text-white scale-105'
          : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-300 hover:border-gray-400'
      } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
      title={isPropertySaved ? 'Remove from saved' : 'Save property'}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      ) : (
        <span className="text-sm font-medium">
          {isPropertySaved ? '♥' : '♡'}
        </span>
      )}
    </button>
  );
}
