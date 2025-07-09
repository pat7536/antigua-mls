export interface Property {
  id: string;
  fields: {
    Title?: string;
    Price?: number;
    Location?: string;
    Description?: string;
    Image?: Array<{
      id: string;
      url: string;
      filename: string;
      size: number;
      type: string;
    }>;
    Bedrooms?: number;
    Bathrooms?: number;
    SquareFootage?: number;
    PropertyType?: string;
    Status?: string;
  };
}