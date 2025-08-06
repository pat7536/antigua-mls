'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { AdminProperty } from '@/types/adminProperty';

type AdminPropertyCardProps = {
  property: AdminProperty;
};

export default function AdminPropertyCard({ property }: AdminPropertyCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    Title,
    Slug,
    Address,
    Price,
    Bedrooms,
    Bathrooms,
    'Main Image': mainImage,
  } = property.fields;

  // Format price with commas and dollar sign
  const formatPrice = (price: number | undefined) => {
    if (!price) return 'Price on Request';
    return `$${price.toLocaleString()}`;
  };

  // Get main image URL
  const getImageUrl = () => {
    if (mainImage && mainImage.length > 0) {
      return mainImage[0].thumbnails?.large?.url || mainImage[0].url;
    }
    return '/placeholder-property.jpg'; // Fallback image
  };

  // Handle missing slug
  const propertySlug = Slug || property.id;

  return (
    <Link href={`/properties/${propertySlug}`} className="block group">
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
        {/* Property Image */}
        <div className="relative h-48 md:h-56 overflow-hidden bg-gray-100">
          {!imageError ? (
            <>
              <img
                src={getImageUrl()}
                alt={Title || 'Property'}
                className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="text-gray-400 text-sm">Loading...</div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <div className="text-blue-400 text-center">
                <div className="text-2xl mb-2">🏠</div>
                <div className="text-sm">No Image Available</div>
              </div>
            </div>
          )}
          
          {/* Price Badge */}
          <div className="absolute top-3 right-3">
            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              {formatPrice(Price)}
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="p-5">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {Title || 'Untitled Property'}
          </h3>

          {/* Address */}
          <p className="text-gray-600 text-sm mb-3 flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {Address || 'Address not provided'}
          </p>

          {/* Bedrooms & Bathrooms */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {Bedrooms !== undefined && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
                  </svg>
                  <span className="font-medium">{Bedrooms}</span>
                  <span className="ml-1">bed{Bedrooms !== 1 ? 's' : ''}</span>
                </div>
              )}
              
              {Bathrooms !== undefined && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                  <span className="font-medium">{Bathrooms}</span>
                  <span className="ml-1">bath{Bathrooms !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            {/* View Details Arrow */}
            <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}