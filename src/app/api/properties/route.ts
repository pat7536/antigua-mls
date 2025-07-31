import { NextResponse } from 'next/server';
import type { Property, AirtableResponse } from '@/types/property';
import type { PropertyId } from '@/types/branded';

export async function GET(request: Request) {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME;

    if (!apiKey || !baseId || !tableName) {
      return NextResponse.json(
        { error: 'Missing Airtable configuration' },
        { status: 500 }
      );
    }

    // Parse pagination parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const getAll = searchParams.get('all') === 'true';

    // If requesting all properties (for filtering), return everything
    if (getAll) {
      const allProperties: Property[] = [];
      let offset: string | undefined = undefined;

      do {
        const url = `https://api.airtable.com/v0/${baseId}/${tableName}${offset ? `?offset=${offset}` : ''}`;

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

        const transformedProperties: Property[] = data.records.map(
          (record) => ({
            id: record.id as unknown as PropertyId,
            fields: record.fields,
            createdTime: record.createdTime,
          })
        );

        allProperties.push(...transformedProperties);
        offset = data.offset;
      } while (offset);

      return NextResponse.json({
        properties: allProperties,
        total: allProperties.length,
        hasMore: false,
        page: 1,
        limit: allProperties.length,
      });
    }

    // Paginated request - fetch all and slice for now
    // TODO: Optimize with Airtable's native pagination when needed
    const allProperties: Property[] = [];
    let offset: string | undefined = undefined;

    do {
      const url = `https://api.airtable.com/v0/${baseId}/${tableName}${offset ? `?offset=${offset}` : ''}`;

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

    return NextResponse.json({
      properties: paginatedProperties,
      total: allProperties.length,
      hasMore,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
