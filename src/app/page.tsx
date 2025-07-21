'use client';

import { useState, useEffect, useMemo } from 'react';
import PropertyCard from '../components/PropertyCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import FilterBar from '../components/FilterBar';
import { applyPropertyFilters } from '@/lib/filters';
import type {
  Property,
  PropertyFilters,
  PropertiesApiResponse,
} from '@/types/property';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyFilters>({
    bedrooms: '',
    priceRange: '',
    location: '',
  });

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/properties');

      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data: PropertiesApiResponse = await response.json();
      setProperties(data.properties);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    filterType: keyof PropertyFilters,
    value: string
  ): void => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleClearFilters = (): void => {
    setFilters({
      bedrooms: '',
      priceRange: '',
      location: '',
    });
  };

  // Following C-4: Using simple, composable, testable functions
  const filteredProperties = useMemo(() => {
    return applyPropertyFilters(properties, filters);
  }, [properties, filters]);

  useEffect(() => {
    fetchProperties();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchProperties} />;
  }

  return (
    <div>
      <header className="header">
        <div className="container">
          <h1>Antigua MLS</h1>
          <p>Find your dream property in Antigua</p>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          {filteredProperties.length === 0 ? (
            <div className="empty-state">
              <svg
                className="empty-icon"
                width="64"
                height="64"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h2>No properties found</h2>
              <p>
                Try adjusting your filters or check back later for new listings
              </p>
            </div>
          ) : (
            <>
              <div className="results-count">
                {filteredProperties.length}{' '}
                {filteredProperties.length === 1 ? 'Property' : 'Properties'}{' '}
                Found
                {(filters.bedrooms ||
                  filters.priceRange ||
                  filters.location) && (
                  <span className="filter-indicator">
                    {' '}
                    (filtered from {properties.length} total)
                  </span>
                )}
              </div>

              <div className="grid">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
