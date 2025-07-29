'use client';

import { useState, useEffect, useMemo } from 'react';
import PropertyCard from '../components/PropertyCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import FilterBar from '../components/FilterBar';
import SimpleMap from '../components/SimpleMap';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import { applyPropertyFilters } from '@/lib/filters';
import type {
  Property,
  PropertyFilters,
  PropertiesApiResponse,
} from '@/types/property';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [filters, setFilters] = useState<PropertyFilters>({
    bedrooms: '',
    priceRange: '',
    location: '',
  });

  const fetchProperties = async (page: number = 1, isLoadMore: boolean = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch(`/api/properties?page=${page}&limit=24`);

      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data: PropertiesApiResponse = await response.json();
      
      if (isLoadMore) {
        setProperties(prev => [...prev, ...data.properties]);
      } else {
        setProperties(data.properties);
      }
      
      setHasMore(data.hasMore || false);
      setTotal(data.total || 0);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchAllProperties = async () => {
    try {
      const response = await fetch('/api/properties?all=true');
      if (!response.ok) throw new Error('Failed to fetch all properties');
      
      const data: PropertiesApiResponse = await response.json();
      setAllProperties(data.properties);
    } catch (err) {
      console.error('Error fetching all properties:', err);
    }
  };

  const loadMoreProperties = () => {
    if (!loadingMore && hasMore) {
      fetchProperties(currentPage + 1, true);
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
    const hasActiveFilters = filters.bedrooms || filters.priceRange || filters.location;
    
    if (hasActiveFilters) {
      // Use all properties for filtering to show comprehensive results
      return applyPropertyFilters(allProperties, filters);
    } else {
      // Use paginated properties when no filters are active
      return properties;
    }
  }, [properties, allProperties, filters]);

  // Map should always show all properties (filtered if filters are active, otherwise all)
  const mapProperties = useMemo(() => {
    const hasActiveFilters = filters.bedrooms || filters.priceRange || filters.location;
    
    if (hasActiveFilters) {
      // Show filtered results on map when filtering
      return applyPropertyFilters(allProperties, filters);
    } else {
      // Show all properties on map when not filtering
      return allProperties;
    }
  }, [allProperties, filters]);

  const isFiltering = !!(filters.bedrooms || filters.priceRange || filters.location);

  useEffect(() => {
    fetchProperties();
    fetchAllProperties();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchProperties} />;
  }

  return (
    <div>
      <Header />
      <HeroBanner />

      <main className="main">
        <div className="container">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          <div style={{ marginBottom: '24px' }}>
            <h2
              style={{
                marginBottom: '16px',
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
              }}
            >
              Property Locations
            </h2>
            <SimpleMap properties={mapProperties} />
          </div>

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
                {isFiltering && (
                  <span className="filter-indicator">
                    {' '}
                    (filtered from {total} total)
                  </span>
                )}
                {!isFiltering && total > 0 && (
                  <span className="filter-indicator">
                    {' '}
                    (showing {properties.length} of {total})
                  </span>
                )}
              </div>

              <div className="grid">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* Load More Button - only show when not filtering and there are more properties */}
              {!isFiltering && hasMore && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  marginTop: '32px' 
                }}>
                  <button
                    onClick={loadMoreProperties}
                    disabled={loadingMore}
                    className="btn"
                    style={{
                      background: loadingMore ? '#9ca3af' : '#2563eb',
                      cursor: loadingMore ? 'not-allowed' : 'pointer',
                      padding: '12px 32px',
                      fontSize: '1rem',
                      fontWeight: '500'
                    }}
                  >
                    {loadingMore ? (
                      <>
                        <span style={{ marginRight: '8px' }}>⏳</span>
                        Loading...
                      </>
                    ) : (
                      `Load More Properties (${total - properties.length} remaining)`
                    )}
                  </button>
                </div>
              )}

              {/* Show filter message when filtering */}
              {isFiltering && filteredProperties.length > 0 && (
                <div style={{
                  textAlign: 'center',
                  marginTop: '24px',
                  padding: '16px',
                  backgroundColor: '#eff6ff',
                  borderRadius: '8px',
                  color: '#1e40af'
                }}>
                  💡 Showing all matching properties from {total} total listings
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
