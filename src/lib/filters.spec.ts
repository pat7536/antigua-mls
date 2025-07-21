import { describe, test, expect } from 'vitest';
import {
  filterPropertiesByBedrooms,
  filterPropertiesByPriceRange,
  filterPropertiesByLocation,
  applyPropertyFilters,
} from './filters';
import type { Property, PropertyFilters } from '@/types/property';

// Following T-1: Colocate unit tests in same directory as source file
// Following T-6: Test the entire structure in one assertion if possible

const createMockProperty = (
  overrides: Partial<Property['fields']> = {}
): Property => ({
  id: 'mock-id' as any,
  fields: {
    Title: 'Mock Property',
    Price: 500000,
    Beds: 3,
    Baths: 2,
    Address: 'Mock Address, Antigua',
    Location: 'Antigua',
    ...overrides,
  },
});

describe('filterPropertiesByBedrooms', () => {
  test('filters properties with at least minimum bedrooms', () => {
    const properties = [
      createMockProperty({ Beds: 1 }),
      createMockProperty({ Beds: 2 }),
      createMockProperty({ Beds: 3 }),
      createMockProperty({ Beds: 4 }),
    ];

    const result = filterPropertiesByBedrooms(properties, 3);
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.fields.Beds! >= 3)).toBe(true);
  });

  test('excludes properties without bedroom data', () => {
    const properties = [
      createMockProperty({ Beds: undefined }),
      createMockProperty({ Beds: 3 }),
    ];

    const result = filterPropertiesByBedrooms(properties, 2);
    expect(result).toHaveLength(1);
  });
});

describe('filterPropertiesByPriceRange', () => {
  test('filters properties within price range', () => {
    const properties = [
      createMockProperty({ Price: 100000 }),
      createMockProperty({ Price: 500000 }),
      createMockProperty({ Price: 1000000 }),
      createMockProperty({ Price: 2000000 }),
    ];

    const result = filterPropertiesByPriceRange(properties, 400000, 1500000);
    expect(result).toHaveLength(2);
    expect(
      result.every(
        (p) => p.fields.Price! >= 400000 && p.fields.Price! <= 1500000
      )
    ).toBe(true);
  });
});

describe('filterPropertiesByLocation', () => {
  test('searches both address and location fields case-insensitively', () => {
    const properties = [
      createMockProperty({
        Address: 'St. Johns, Antigua',
        Location: 'St. Johns',
      }),
      createMockProperty({ Address: 'Falmouth Harbour', Location: 'Falmouth' }),
      createMockProperty({
        Address: 'English Harbour',
        Location: 'English Harbour',
      }),
    ];

    const result = filterPropertiesByLocation(properties, 'harbour');
    expect(result).toHaveLength(2);
  });
});

describe('applyPropertyFilters', () => {
  test('applies multiple filters correctly', () => {
    const properties = [
      createMockProperty({ Beds: 2, Price: 300000, Address: 'St. Johns' }),
      createMockProperty({
        Beds: 3,
        Price: 600000,
        Address: 'Falmouth Harbour',
      }),
      createMockProperty({
        Beds: 4,
        Price: 800000,
        Address: 'English Harbour',
      }),
    ];

    const filters: PropertyFilters = {
      bedrooms: '3',
      priceRange: '500000-1000000',
      location: 'harbour',
    };

    const result = applyPropertyFilters(properties, filters);
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.fields.Beds! >= 3)).toBe(true);
    expect(
      result.every((p) => p.fields.Address!.toLowerCase().includes('harbour'))
    ).toBe(true);
  });

  test('returns all properties when no filters applied', () => {
    const properties = [createMockProperty(), createMockProperty()];
    const filters: PropertyFilters = {
      bedrooms: '',
      priceRange: '',
      location: '',
    };

    const result = applyPropertyFilters(properties, filters);
    expect(result).toEqual(properties);
  });
});
