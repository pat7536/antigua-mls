'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import type { Property } from '@/types/property';

type SavePropertyButtonProps = {
  property: Property;
};

export default function SavePropertyButton({ property }: SavePropertyButtonProps) {
  const { user, isSignedIn } = useUser();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Check if property is already saved
    const checkSavedStatus = () => {
      try {
        const saved = localStorage.getItem(`savedProperties_${user.id}`);
        if (saved) {
          const savedProperties = JSON.parse(saved);
          setIsSaved(savedProperties.some((p: Property) => p.id === property.id));
        }
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };

    checkSavedStatus();
  }, [user, property.id]);

  const toggleSave = async () => {
    if (!isSignedIn) {
      // You could trigger sign-in modal here
      return;
    }

    setLoading(true);

    try {
      const storageKey = `savedProperties_${user?.id}`;
      const saved = localStorage.getItem(storageKey);
      let savedProperties: Property[] = saved ? JSON.parse(saved) : [];

      if (isSaved) {
        // Remove from saved
        savedProperties = savedProperties.filter(p => p.id !== property.id);
        setIsSaved(false);
      } else {
        // Add to saved
        savedProperties.push(property);
        setIsSaved(true);
      }

      localStorage.setItem(storageKey, JSON.stringify(savedProperties));
    } catch (error) {
      console.error('Error toggling save status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return null; // Hide save button for non-authenticated users
  }

  return (
    <button
      onClick={toggleSave}
      disabled={loading}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
        isSaved
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-300'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isSaved ? 'Remove from saved' : 'Save property'}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      ) : (
        <span className="text-sm">{isSaved ? '♥' : '♡'}</span>
      )}
    </button>
  );
}