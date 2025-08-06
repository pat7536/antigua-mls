import type { AirtableRecordId } from './branded';

// Following C-8: Use type instead of interface when possible
export type AdminProperty = {
  id: string;
  fields: AdminPropertyFields;
  createdTime: string;
};

export type AdminPropertyFields = {
  Title?: string;
  Slug?: string;
  Address?: string;
  Price?: number;
  Bedrooms?: number;
  Bathrooms?: number;
  'Square Footage'?: number;
  'Lot Size'?: string;
  'Main Image'?: AirtableImage[];
  Images?: AirtableImage[]; // Gallery images
  Description?: string;
  Features?: string[]; // Multi-select field
  'Contact Info'?: string;
  'Ross Feature?'?: boolean;
  Done?: boolean; // This is your "published" field
};

// Airtable image attachment type
export type AirtableImage = {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
  thumbnails?: {
    small: AirtableImageThumbnail;
    large: AirtableImageThumbnail;
    full: AirtableImageThumbnail;
  };
};

export type AirtableImageThumbnail = {
  url: string;
  width: number;
  height: number;
};

export type AdminPropertiesResponse = {
  records: Array<{
    id: AirtableRecordId;
    fields: AdminPropertyFields;
    createdTime: string;
  }>;
  offset?: string;
};

export type AdminPropertiesApiResponse = {
  properties: AdminProperty[];
  total?: number;
  hasMore?: boolean;
  page?: number;
  limit?: number;
};