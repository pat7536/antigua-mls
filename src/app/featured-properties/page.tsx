'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import AdminPropertyCard from '@/components/AdminPropertyCard';
import type { AdminProperty, AdminPropertiesApiResponse } from '@/types/adminProperty';

export default function FeaturedPropertiesPage() {
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin-properties?all=true');
      
      if (!response.ok) {
        throw new Error('Failed to fetch featured properties');
      }

      const data: AdminPropertiesApiResponse = await response.json();
      setProperties(data.properties || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching featured properties:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <main className="main">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading featured properties...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <main className="main">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Properties</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={fetchFeaturedProperties}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="main">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Discover our handpicked selection of premium properties in Antigua. 
              Each listing has been carefully curated to showcase the finest real estate opportunities.
            </p>
            {total > 0 && (
              <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {total} Featured Properties Available
              </div>
            )}
          </div>

          {/* Properties Grid */}
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {properties.map((property) => (
                <AdminPropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🏠</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Featured Properties</h2>
              <p className="text-gray-600 mb-6">
                There are currently no published featured properties available.
              </p>
              <button
                onClick={fetchFeaturedProperties}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Refresh
              </button>
            </div>
          )}

          {/* Call to Action Section */}
          {properties.length > 0 && (
            <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Find Your Dream Property
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                These featured properties represent the best of what Antigua has to offer. 
                Contact us today to schedule a viewing or get more information.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/dashboard"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  View All Properties
                </a>
                <a
                  href="mailto:info@antiguamls.com"
                  className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors border border-blue-400"
                >
                  Contact Us
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}