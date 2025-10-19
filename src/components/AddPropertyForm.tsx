'use client';

import { useState } from 'react';
import type { AdminPropertyFields } from '@/types/adminProperty';

// Following C-8: Use type instead of interface
type FormData = {
  title: string;
  slug: string;
  address: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  squareFootage: string;
  lotSize: string;
  mainImageUrl: string;
  imageUrls: string;
  description: string;
  features: string[];
  contactInfo: string;
  rossFeature: boolean;
};

const FEATURE_OPTIONS = [
  'Ocean View',
  'Pool',
  'Gated Community',
  'Garage',
  'Air Conditioning',
  'Beach Access',
  'Furnished',
  'Solar Panels',
  'Guest House',
  'Waterfront',
];

export function AddPropertyForm() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    address: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    lotSize: '',
    mainImageUrl: '',
    imageUrls: '',
    description: '',
    features: [],
    contactInfo: '',
    rossFeature: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Auto-generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: generateSlug(newTitle),
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Convert string numbers to numbers and prepare image arrays
      const mainImageUrls = formData.mainImageUrl.trim()
        ? [formData.mainImageUrl.trim()]
        : [];
      const galleryImageUrls = formData.imageUrls
        .split('\n')
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      const propertyData: Partial<AdminPropertyFields> = {
        Title: formData.title,
        Slug: formData.slug,
        Address: formData.address,
        Price: formData.price ? Number(formData.price) : undefined,
        Bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
        Bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
        'Square Footage': formData.squareFootage
          ? Number(formData.squareFootage)
          : undefined,
        'Lot Size': formData.lotSize || undefined,
        Description: formData.description || undefined,
        Features: formData.features.length > 0 ? formData.features : undefined,
        'Contact Info': formData.contactInfo || undefined,
        'Ross Feature?': formData.rossFeature,
        Done: false, // New properties start as unpublished
      };

      const response = await fetch('/api/admin-properties/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property: propertyData,
          mainImageUrls,
          galleryImageUrls,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create property');
      }

      await response.json();
      setSubmitMessage({
        type: 'success',
        text: 'Property created successfully!',
      });

      // Reset form after successful submission
      setFormData({
        title: '',
        slug: '',
        address: '',
        price: '',
        bedrooms: '',
        bathrooms: '',
        squareFootage: '',
        lotSize: '',
        mainImageUrl: '',
        imageUrls: '',
        description: '',
        features: [],
        contactInfo: '',
        rossFeature: false,
      });
    } catch (error) {
      console.error('Error submitting property:', error);
      setSubmitMessage({
        type: 'error',
        text:
          error instanceof Error ? error.message : 'Failed to create property',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitMessage && (
        <div
          className={`p-4 rounded-md ${
            submitMessage.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {submitMessage.text}
        </div>
      )}

      {/* Title and Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={handleTitleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Beautiful Ocean View Villa"
          />
        </div>
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Slug (Auto-generated)
          </label>
          <input
            type="text"
            id="slug"
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slug: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
            placeholder="beautiful-ocean-view-villa"
          />
          <p className="text-xs text-gray-500 mt-1">
            Auto-generated from title, but you can edit it
          </p>
        </div>
      </div>

      {/* Address */}
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Address
        </label>
        <input
          type="text"
          id="address"
          value={formData.address}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, address: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="123 Ocean Drive, St. John's, Antigua"
        />
      </div>

      {/* Price and Property Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Price (USD)
          </label>
          <input
            type="number"
            id="price"
            value={formData.price}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, price: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="750000"
          />
        </div>
        <div>
          <label
            htmlFor="bedrooms"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bedrooms
          </label>
          <input
            type="number"
            id="bedrooms"
            value={formData.bedrooms}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, bedrooms: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="3"
          />
        </div>
        <div>
          <label
            htmlFor="bathrooms"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bathrooms
          </label>
          <input
            type="number"
            step="0.5"
            id="bathrooms"
            value={formData.bathrooms}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, bathrooms: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="2.5"
          />
        </div>
      </div>

      {/* Square Footage and Lot Size */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="squareFootage"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Square Footage
          </label>
          <input
            type="number"
            id="squareFootage"
            value={formData.squareFootage}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                squareFootage: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="2500"
          />
        </div>
        <div>
          <label
            htmlFor="lotSize"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Lot Size
          </label>
          <input
            type="text"
            id="lotSize"
            value={formData.lotSize}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, lotSize: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.5 acres"
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="mainImageUrl"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Main Image URL
          </label>
          <input
            type="url"
            id="mainImageUrl"
            value={formData.mainImageUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, mainImageUrl: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/main-image.jpg"
          />
        </div>
        <div>
          <label
            htmlFor="imageUrls"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Gallery Image URLs (one per line)
          </label>
          <textarea
            id="imageUrls"
            rows={4}
            value={formData.imageUrls}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, imageUrls: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter each image URL on a separate line
          </p>
        </div>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe the property features, location highlights, and unique selling points..."
        />
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Features
        </label>
        <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
          <p className="text-sm text-green-800">
            <strong>✅ Ready!</strong> Features field is now configured in
            Airtable. Select any applicable features below.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {FEATURE_OPTIONS.map((feature) => (
            <label
              key={feature}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="checkbox"
                checked={formData.features.includes(feature)}
                onChange={() => handleFeatureToggle(feature)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{feature}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div>
        <label
          htmlFor="contactInfo"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Contact Information
        </label>
        <input
          type="text"
          id="contactInfo"
          value={formData.contactInfo}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, contactInfo: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Contact Pat at pat@example.com or call (555) 123-4567"
        />
      </div>

      {/* Ross Feature */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="rossFeature"
          checked={formData.rossFeature}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, rossFeature: e.target.checked }))
          }
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label
          htmlFor="rossFeature"
          className="text-sm font-medium text-gray-700 cursor-pointer"
        >
          Ross Feature?
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !formData.title}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSubmitting && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>{isSubmitting ? 'Creating...' : 'Create Property'}</span>
        </button>
      </div>
    </form>
  );
}
