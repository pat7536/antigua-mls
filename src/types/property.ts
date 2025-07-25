import type { PropertyId, AirtableRecordId } from './branded';

// Following C-8: Use type instead of interface when possible
export type Property = {
  id: PropertyId;
  fields: PropertyFields;
  createdTime?: string;
};

export type PropertyFields = {
  Title?: string;
  Price?: number;
  Location?: string;
  Address?: string;
  Description?: string;
  Image?: string; // Updated to string as per actual API response
  Beds?: number;
  Baths?: number;
  SquareFootage?: number;
  Status?: string;
  'Property URL'?: string;
  Latitude?: number;
  Longitude?: number;
};

export type PropertyFilters = {
  bedrooms: string;
  priceRange: string;
  location: string;
};

export type AirtableResponse = {
  records: Array<{
    id: AirtableRecordId;
    fields: PropertyFields;
    createdTime: string;
  }>;
  offset?: string;
};

export type PropertiesApiResponse = {
  properties: Property[];
};
