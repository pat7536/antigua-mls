import type { Property } from '@/types/property';

export type MarketTrend = {
  area: string;
  avgPrice: number;
  propertyCount: number;
  priceChange: number;
  priceChangePercent: number;
  pricePerSqFt: number;
  trend: 'up' | 'down' | 'stable';
};

export type TimePeriodStats = {
  period: string;
  avgPrice: number;
  propertyCount: number;
  pricePerSqFt: number;
};

// Following C-4: Simple, composable, testable functions
export const calculatePricePerSqFt = (price: number, sqft: number): number => {
  if (!sqft || sqft <= 0) return 0;
  return Math.round(price / sqft);
};

export const calculatePriceChange = (
  oldPrice: number,
  newPrice: number
): { change: number; percent: number } => {
  if (!oldPrice || oldPrice <= 0) return { change: 0, percent: 0 };
  
  const change = newPrice - oldPrice;
  const percent = Math.round((change / oldPrice) * 100);
  
  return { change, percent };
};

export const groupPropertiesByLocation = (properties: Property[]): Record<string, Property[]> => {
  return properties.reduce((acc, property) => {
    const location = property.fields.Location || 'Unknown';
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(property);
    return acc;
  }, {} as Record<string, Property[]>);
};

export const calculateLocationStats = (properties: Property[]): {
  avgPrice: number;
  pricePerSqFt: number;
  propertyCount: number;
} => {
  if (properties.length === 0) {
    return { avgPrice: 0, pricePerSqFt: 0, propertyCount: 0 };
  }

  const validPrices = properties
    .map(p => p.fields.Price)
    .filter((price): price is number => typeof price === 'number' && price > 0);

  const avgPrice = validPrices.length > 0 
    ? Math.round(validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length)
    : 0;

  // Calculate average price per sq ft
  const validSqFtData = properties
    .filter(p => p.fields.Price && p.fields.SquareFootage && p.fields.SquareFootage > 0)
    .map(p => ({
      price: p.fields.Price!,
      sqft: p.fields.SquareFootage!
    }));

  const avgPricePerSqFt = validSqFtData.length > 0
    ? Math.round(
        validSqFtData.reduce((sum, data) => sum + (data.price / data.sqft), 0) / validSqFtData.length
      )
    : 0;

  return {
    avgPrice,
    pricePerSqFt: avgPricePerSqFt,
    propertyCount: properties.length
  };
};

export const analyzeMarketTrends = (properties: Property[]): MarketTrend[] => {
  const locationGroups = groupPropertiesByLocation(properties);
  
  return Object.entries(locationGroups).map(([location, locationProperties]) => {
    const stats = calculateLocationStats(locationProperties);
    
    // For trend analysis, we'll compare recent vs older properties
    // Sort by creation time (newest first)
    const sortedProperties = locationProperties.sort((a, b) => 
      new Date(b.createdTime || 0).getTime() - new Date(a.createdTime || 0).getTime()
    );
    
    // Split into recent (first half) vs older (second half) for trend analysis
    const midpoint = Math.floor(sortedProperties.length / 2);
    const recentProperties = sortedProperties.slice(0, midpoint || 1);
    const olderProperties = sortedProperties.slice(midpoint || 1);
    
    const recentStats = calculateLocationStats(recentProperties);
    const olderStats = calculateLocationStats(olderProperties);
    
    const priceChange = recentStats.avgPrice - olderStats.avgPrice;
    const priceChangePercent = olderStats.avgPrice > 0 
      ? Math.round((priceChange / olderStats.avgPrice) * 100)
      : 0;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (Math.abs(priceChangePercent) >= 5) {
      trend = priceChangePercent > 0 ? 'up' : 'down';
    }
    
    return {
      area: location,
      avgPrice: stats.avgPrice,
      propertyCount: stats.propertyCount,
      priceChange,
      priceChangePercent,
      pricePerSqFt: stats.pricePerSqFt,
      trend
    };
  }).filter(trend => trend.propertyCount > 0); // Only include areas with properties
};

export const getFastestMovingRegions = (trends: MarketTrend[], limit: number = 5): MarketTrend[] => {
  return trends
    .filter(trend => trend.propertyCount >= 2) // Only areas with multiple properties
    .sort((a, b) => Math.abs(b.priceChangePercent) - Math.abs(a.priceChangePercent))
    .slice(0, limit);
};

export const calculateOverallMarketStats = (properties: Property[]): {
  totalProperties: number;
  avgPrice: number;
  avgPricePerSqFt: number;
  avgPriceChange: number;
  totalMarketValue: number;
} => {
  const validPrices = properties
    .map(p => p.fields.Price)
    .filter((price): price is number => typeof price === 'number' && price > 0);

  const avgPrice = validPrices.length > 0 
    ? Math.round(validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length)
    : 0;

  const totalMarketValue = validPrices.reduce((sum, price) => sum + price, 0);

  // Calculate average price per sq ft across all properties
  const validSqFtData = properties
    .filter(p => p.fields.Price && p.fields.SquareFootage && p.fields.SquareFootage > 0)
    .map(p => calculatePricePerSqFt(p.fields.Price!, p.fields.SquareFootage!))
    .filter(pricePerSqFt => pricePerSqFt > 0);

  const avgPricePerSqFt = validSqFtData.length > 0
    ? Math.round(validSqFtData.reduce((sum, price) => sum + price, 0) / validSqFtData.length)
    : 0;

  // Calculate overall market trend
  const trends = analyzeMarketTrends(properties);
  const avgPriceChange = trends.length > 0
    ? Math.round(trends.reduce((sum, trend) => sum + trend.priceChangePercent, 0) / trends.length)
    : 0;

  return {
    totalProperties: properties.length,
    avgPrice,
    avgPricePerSqFt,
    avgPriceChange,
    totalMarketValue
  };
};