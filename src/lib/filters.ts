import type { Property, PropertyFilters } from '@/types/property';

// Following C-4: Simple, composable, testable functions
export function filterPropertiesByBedrooms(
  properties: Property[],
  minBedrooms: number
): Property[] {
  return properties.filter((property) => {
    const beds = property.fields.Beds;
    return beds !== undefined && beds >= minBedrooms;
  });
}

export function filterPropertiesByPriceRange(
  properties: Property[],
  minPrice: number,
  maxPrice: number
): Property[] {
  return properties.filter((property) => {
    const price = property.fields.Price;
    return price !== undefined && price >= minPrice && price <= maxPrice;
  });
}

export function filterPropertiesByLocation(
  properties: Property[],
  searchTerm: string
): Property[] {
  const searchLower = searchTerm.toLowerCase();
  return properties.filter((property) => {
    const address = property.fields.Address?.toLowerCase() || '';
    const location = property.fields.Location?.toLowerCase() || '';
    return address.includes(searchLower) || location.includes(searchLower);
  });
}

export function applyPropertyFilters(
  properties: Property[],
  filters: PropertyFilters
): Property[] {
  let filtered = properties;

  if (filters.bedrooms) {
    const minBeds = parseInt(filters.bedrooms);
    filtered = filterPropertiesByBedrooms(filtered, minBeds);
  }

  if (filters.priceRange) {
    const [minPrice, maxPrice] = filters.priceRange.split('-').map(Number);
    filtered = filterPropertiesByPriceRange(filtered, minPrice, maxPrice);
  }

  if (filters.location) {
    filtered = filterPropertiesByLocation(filtered, filters.location);
  }

  return filtered;
}
