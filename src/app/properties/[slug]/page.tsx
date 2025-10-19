'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import PropertyImageGallery from '@/components/PropertyImageGallery';
import type { AdminProperty } from '@/types/adminProperty';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<AdminProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slug = params?.slug as string;

  useEffect(() => {
    if (slug) {
      fetchProperty();
    }
  }, [slug]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin-properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Property not found');
        }
        throw new Error('Failed to fetch property');
      }

      const data = await response.json();
      setProperty(data.property);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching property:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format price with commas
  const formatPrice = (price: number | undefined) => {
    if (!price) return 'Price on Request';
    return `$${price.toLocaleString()}`;
  };

  // Format square footage
  const formatSquareFootage = (sqft: number | undefined) => {
    if (!sqft) return null;
    return `${sqft.toLocaleString()} sq ft`;
  };

  if (loading) {
    return (
      <div>
        <Header />
        <main className="main">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading property details...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div>
        <Header />
        <main className="main">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">🏠</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {error === 'Property not found'
                  ? 'Property Not Found'
                  : 'Error Loading Property'}
              </h1>
              <p className="text-gray-600 mb-6">
                {error === 'Property not found'
                  ? 'The property you are looking for does not exist or is no longer available.'
                  : error}
              </p>
              <div className="space-x-4">
                <Link
                  href="/featured-properties"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  View All Properties
                </Link>
                <button
                  onClick={() => router.back()}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const {
    Title,
    Address,
    Price,
    Bedrooms,
    Bathrooms,
    'Square Footage': squareFootage,
    'Main Image': mainImage,
    Images: images,
    Description,
    Features,
    'Contact Info': contactInfo,
  } = property.fields;

  // Combine main image and gallery images
  const allImages = [];
  if (mainImage && mainImage.length > 0) {
    allImages.push(...mainImage);
  }
  if (images && images.length > 0) {
    // Avoid duplicates by checking if images are already included
    const mainImageIds = mainImage?.map((img) => img.id) || [];
    const additionalImages = images.filter(
      (img) => !mainImageIds.includes(img.id)
    );
    allImages.push(...additionalImages);
  }

  return (
    <div>
      <Header />
      <main className="main">
        {/* Back Navigation */}
        <div className="bg-gray-50 border-b">
          <div className="container mx-auto px-4 py-4">
            <Link
              href="/featured-properties"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Featured Properties
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Property Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {Title || 'Untitled Property'}
            </h1>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-lg">
                  {Address || 'Address not provided'}
                </span>
              </div>

              <div className="text-2xl md:text-3xl font-bold text-blue-600">
                {formatPrice(Price)}
              </div>
            </div>
          </div>

          {/* Property Gallery */}
          <div className="mb-12">
            <PropertyImageGallery
              images={allImages}
              propertyTitle={Title || 'Property'}
            />
          </div>

          {/* Property Details Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Stats */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Property Details
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {Bedrooms !== undefined && (
                    <div className="text-center">
                      <div className="bg-blue-50 rounded-lg p-4 mb-2">
                        <svg
                          className="w-8 h-8 text-blue-600 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0"
                          />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {Bedrooms}
                      </div>
                      <div className="text-gray-600">
                        Bedroom{Bedrooms !== 1 ? 's' : ''}
                      </div>
                    </div>
                  )}

                  {Bathrooms !== undefined && (
                    <div className="text-center">
                      <div className="bg-blue-50 rounded-lg p-4 mb-2">
                        <svg
                          className="w-8 h-8 text-blue-600 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                          />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {Bathrooms}
                      </div>
                      <div className="text-gray-600">
                        Bathroom{Bathrooms !== 1 ? 's' : ''}
                      </div>
                    </div>
                  )}

                  {squareFootage && (
                    <div className="text-center">
                      <div className="bg-blue-50 rounded-lg p-4 mb-2">
                        <svg
                          className="w-8 h-8 text-blue-600 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                          />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {squareFootage.toLocaleString()}
                      </div>
                      <div className="text-gray-600">Sq Ft</div>
                    </div>
                  )}

                  <div className="text-center">
                    <div className="bg-blue-50 rounded-lg p-4 mb-2">
                      <svg
                        className="w-8 h-8 text-blue-600 mx-auto"
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
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      Featured
                    </div>
                    <div className="text-gray-600">Property</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {Description && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    About This Property
                  </h2>
                  <div className="prose prose-lg text-gray-700 max-w-none">
                    {Description.split('\n').map((paragraph, index) =>
                      paragraph.trim() ? (
                        <p key={index} className="mb-4 leading-relaxed">
                          {paragraph}
                        </p>
                      ) : null
                    )}
                  </div>
                </div>
              )}

              {/* Features */}
              {Features && Features.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Property Features
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Section */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Interested in this property?
                </h3>

                {contactInfo ? (
                  <div className="mb-6">
                    <div className="bg-white rounded-lg p-4 border">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Contact Information
                      </h4>
                      <div className="text-gray-700 whitespace-pre-line">
                        {contactInfo}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <p className="text-gray-700 mb-4">
                      Get in touch with our team to learn more about this
                      exceptional property or to schedule a viewing.
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <a
                    href="mailto:pat7536@gmail.com?subject=Inquiry about Featured Property&body=Hi, I'm interested in learning more about this property."
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block"
                  >
                    Email Us
                  </a>

                  <a
                    href="tel:+1234567890"
                    className="w-full bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center block border border-blue-200"
                  >
                    Call Now
                  </a>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => window.print()}
                    className="w-full flex items-center justify-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                    Print Details
                  </button>

                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: Title,
                          text: `Check out this property: ${Title}`,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Property link copied to clipboard!');
                      }
                    }}
                    className="w-full flex items-center justify-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                    Share Property
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
