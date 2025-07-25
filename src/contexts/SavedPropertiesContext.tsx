'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import type { Property } from '@/types/property';

type SavedPropertiesContextType = {
  savedProperties: Property[];
  isSaved: (propertyId: string) => boolean;
  saveProperty: (property: Property) => void;
  removeSavedProperty: (propertyId: string) => void;
  loading: boolean;
};

const SavedPropertiesContext = createContext<
  SavedPropertiesContextType | undefined
>(undefined);

type SavedPropertiesProviderProps = {
  children: ReactNode;
};

export function SavedPropertiesProvider({
  children,
}: SavedPropertiesProviderProps) {
  const { user, isSignedIn } = useUser();
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  const getStorageKey = () => `savedProperties_${user?.id}`;

  // Load saved properties from localStorage
  const loadSavedProperties = () => {
    if (!user) return;

    setLoading(true);
    try {
      const saved = localStorage.getItem(getStorageKey());
      if (saved) {
        setSavedProperties(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save properties to localStorage
  const persistSavedProperties = (properties: Property[]) => {
    if (!user) return;

    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(properties));
    } catch (error) {
      console.error('Error persisting saved properties:', error);
    }
  };

  useEffect(() => {
    if (isSignedIn && user) {
      loadSavedProperties();
    } else {
      setSavedProperties([]);
    }
  }, [user, isSignedIn]);

  const isSaved = (propertyId: string): boolean => {
    return savedProperties.some((p) => p.id === propertyId);
  };

  const saveProperty = (property: Property) => {
    if (!isSignedIn || !user) return;

    const updatedProperties = [...savedProperties, property];
    setSavedProperties(updatedProperties);
    persistSavedProperties(updatedProperties);
  };

  const removeSavedProperty = (propertyId: string) => {
    if (!isSignedIn || !user) return;

    const updatedProperties = savedProperties.filter(
      (p) => p.id !== propertyId
    );
    setSavedProperties(updatedProperties);
    persistSavedProperties(updatedProperties);
  };

  const value: SavedPropertiesContextType = {
    savedProperties,
    isSaved,
    saveProperty,
    removeSavedProperty,
    loading,
  };

  return (
    <SavedPropertiesContext.Provider value={value}>
      {children}
    </SavedPropertiesContext.Provider>
  );
}

export function useSavedProperties(): SavedPropertiesContextType {
  const context = useContext(SavedPropertiesContext);
  if (context === undefined) {
    throw new Error(
      'useSavedProperties must be used within a SavedPropertiesProvider'
    );
  }
  return context;
}
