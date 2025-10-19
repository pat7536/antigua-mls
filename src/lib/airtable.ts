import type { Property, AirtableResponse } from '@/types/property';
import type { PropertyId } from '@/types/branded';

export interface PropertyQueryParams {
  page?: number;
  limit?: number;
  all?: boolean;
}

interface AirtableConfig {
  apiKey: string;
  baseId: string;
  tableName: string;
}

async function fetchPropertiesFromTable(
  config: AirtableConfig,
  params: PropertyQueryParams = {}
): Promise<{
  properties: Property[];
  total: number;
  hasMore: boolean;
  page: number;
  limit: number;
}> {
  const { apiKey, baseId, tableName } = config;
  const { page = 1, limit = 24, all = false } = params;

  // If requesting all properties (for filtering), return everything
  if (all) {
    const allProperties: Property[] = [];
    let offset: string | undefined = undefined;

    do {
      const url = `https://api.airtable.com/v0/${baseId}/${tableName}${
        offset ? `?offset=${offset}` : ''
      }`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status}`);
      }

      const data: AirtableResponse = await response.json();

      const transformedProperties: Property[] = data.records.map((record) => ({
        id: record.id as unknown as PropertyId,
        fields: record.fields,
        createdTime: record.createdTime,
      }));

      allProperties.push(...transformedProperties);
      offset = data.offset;
    } while (offset);

    return {
      properties: allProperties,
      total: allProperties.length,
      hasMore: false,
      page: 1,
      limit: allProperties.length,
    };
  }

  // Paginated request - fetch all and slice for now
  // TODO: Optimize with Airtable's native pagination when needed
  const allProperties: Property[] = [];
  let offset: string | undefined = undefined;

  do {
    const url = `https://api.airtable.com/v0/${baseId}/${tableName}${
      offset ? `?offset=${offset}` : ''
    }`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data: AirtableResponse = await response.json();

    const transformedProperties: Property[] = data.records.map((record) => ({
      id: record.id as unknown as PropertyId,
      fields: record.fields,
      createdTime: record.createdTime,
    }));

    allProperties.push(...transformedProperties);
    offset = data.offset;
  } while (offset);

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProperties = allProperties.slice(startIndex, endIndex);
  const hasMore = endIndex < allProperties.length;

  return {
    properties: paginatedProperties,
    total: allProperties.length,
    hasMore,
    page,
    limit,
  };
}

export async function getResidentialProperties(
  params: PropertyQueryParams = {}
) {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME;

  if (!apiKey || !baseId || !tableName) {
    throw new Error(
      'Missing Airtable configuration for residential properties'
    );
  }

  return fetchPropertiesFromTable({ apiKey, baseId, tableName }, params);
}

export async function getCommercialProperties(
  params: PropertyQueryParams = {}
) {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_COMMERCIAL_TABLE_NAME;

  if (!apiKey || !baseId || !tableName) {
    throw new Error('Missing Airtable configuration for commercial properties');
  }

  return fetchPropertiesFromTable({ apiKey, baseId, tableName }, params);
}
