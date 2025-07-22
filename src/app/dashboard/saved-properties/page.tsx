'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import PropertyCard from '../../../components/PropertyCard';
import type { Property } from '@/types/property';

export default function SavedPropertiesPage() {
  const { user } = useUser();
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Load saved properties from localStorage or database
    // For now, we'll simulate with empty state
    const loadSavedProperties = () => {
      setLoading(true);
      try {
        const saved = localStorage.getItem(`savedProperties_${user?.id}`);
        if (saved) {
          setSavedProperties(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading saved properties:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadSavedProperties();
    }
  }, [user]);

  const removeSavedProperty = (propertyId: string) => {
    const updated = savedProperties.filter(prop => prop.id !== propertyId);
    setSavedProperties(updated);
    localStorage.setItem(`savedProperties_${user?.id}`, JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Saved Properties</h1>
        <p className="text-gray-600">
          Properties you've bookmarked for later review
        </p>
      </div>

      {savedProperties.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl text-gray-400">🏠</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved properties yet</h3>
          <p className="text-gray-600 mb-6">
            Start browsing properties and save the ones you're interested in.
          </p>
          <a 
            href="/"
            className="btn"
          >
            Browse Properties
          </a>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              {savedProperties.length} {savedProperties.length === 1 ? 'property' : 'properties'} saved
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((property) => (
              <div key={property.id} className="relative">
                <PropertyCard property={property} />
                <button
                  onClick={() => removeSavedProperty(property.id)}
                  className="absolute top-4 right-4 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                  title="Remove from saved"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}