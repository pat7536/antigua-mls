'use client';

import { useSavedProperties } from '@/contexts/SavedPropertiesContext';
import PropertyCard from '../../../components/PropertyCard';
import Link from 'next/link';

export default function SavedPropertiesPage() {
  const { savedProperties, loading, removeSavedProperty } =
    useSavedProperties();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Saved Properties
        </h1>
        <p className="text-gray-600">
          Properties you've bookmarked for later review
        </p>
      </div>

      {savedProperties.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-16 px-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-2xl font-bold text-blue-600">♥</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            No saved properties yet
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start browsing properties and save the ones you're interested in.
            Your saved properties will appear here for easy access.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Browse Properties
          </Link>
        </div>
      ) : (
        <div>
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-700">
                  {savedProperties.length}{' '}
                  {savedProperties.length === 1 ? 'property' : 'properties'}{' '}
                  saved
                </p>
              </div>
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                + Add more properties
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {savedProperties.map((property) => (
              <div key={property.id} className="relative group">
                <div className="transform transition-all duration-200 group-hover:scale-[1.02]">
                  <PropertyCard property={property} />
                </div>

                {/* Enhanced remove button */}
                <button
                  onClick={() => removeSavedProperty(property.id)}
                  className="absolute top-4 right-16 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110 opacity-90 hover:opacity-100"
                  title="Remove from saved"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {savedProperties.length > 0 && (
            <div className="mt-12 text-center">
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                Browse More Properties
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
