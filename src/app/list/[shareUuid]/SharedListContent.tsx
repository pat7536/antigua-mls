'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Property } from '@/types/property';
import PropertyCard from '@/components/PropertyCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  getResidentialProperties,
  getCommercialProperties,
} from '@/lib/airtable';

type SharedList = {
  id: string;
  title: string;
  description?: string;
  shareUuid: string;
  createdAt: string;
  updatedAt: string;
  properties: Array<{
    id: string;
    propertyId: string;
    note?: string;
    sortOrder?: number;
  }>;
  _count: {
    properties: number;
  };
};

type SharedListContentProps = {
  list: SharedList;
};

export default function SharedListContent({ list }: SharedListContentProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);

        // Get all properties from both residential and commercial
        const [residential, commercial] = await Promise.all([
          getResidentialProperties({ all: true }),
          getCommercialProperties({ all: true }),
        ]);

        const allProperties = [
          ...residential.properties,
          ...commercial.properties,
        ];

        // Filter to only the properties in this list and sort them
        const listPropertyIds = list.properties.map((p) => p.propertyId);
        const filteredProperties = allProperties.filter((property) =>
          listPropertyIds.includes(property.id as string)
        );

        // Sort according to the list's sort order
        const sortedProperties = filteredProperties.sort((a, b) => {
          const aListItem = list.properties.find((p) => p.propertyId === a.id);
          const bListItem = list.properties.find((p) => p.propertyId === b.id);

          const aSortOrder = aListItem?.sortOrder || 0;
          const bSortOrder = bListItem?.sortOrder || 0;

          return aSortOrder - bSortOrder;
        });

        setProperties(sortedProperties);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties');
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [list]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  const getPropertyNote = (propertyId: string) => {
    return list.properties.find((p) => p.propertyId === propertyId)?.note;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {list.title}
          </h1>
          {list.description && (
            <p className="text-gray-600 text-lg">{list.description}</p>
          )}
          <div className="mt-4 text-sm text-gray-500">
            {list._count.properties}{' '}
            {list._count.properties === 1 ? 'property' : 'properties'}• Shared
            by a realtor on Antigua MLS
          </div>
        </div>

        {/* Branding */}
        <div className="border-t pt-4 text-center">
          <div className="text-gray-600">
            <span className="font-semibold">Antigua MLS</span> - Your Premier
            Real Estate Platform
          </div>
          <div className="mt-2">
            <Link href="/" className="text-blue-600 hover:underline text-sm">
              Browse more properties →
            </Link>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            This list doesn&apos;t contain any properties yet.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => {
            const note = getPropertyNote(property.id as string);

            return (
              <div key={property.id} className="relative">
                <PropertyCard property={property} />
                {note && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm text-blue-800">
                      <strong>Realtor&apos;s Note:</strong> {note}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 text-center py-8 border-t">
        <div className="text-gray-600 mb-4">
          Interested in these properties? Contact a licensed realtor for more
          information.
        </div>
        <a
          href="/become-agent"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Become an Agent
        </a>
      </div>
    </div>
  );
}
