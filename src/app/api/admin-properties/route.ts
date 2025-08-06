import { NextResponse } from 'next/server';
import type { AdminProperty, AdminPropertiesResponse } from '@/types/adminProperty';

export async function GET(request: Request) {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = 'Admin Properties';

    if (!apiKey || !baseId) {
      return NextResponse.json(
        { error: 'Missing Airtable configuration' },
        { status: 500 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const getAll = searchParams.get('all') === 'true';

    // Fetch all published properties from Airtable
    const allProperties: AdminProperty[] = [];
    let offset: string | undefined = undefined;

    do {
      // Build URL with filter for done properties only (using "Done" checkbox field)
      const filterFormula = "({Done} = TRUE())";
      const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?filterByFormula=${encodeURIComponent(filterFormula)}${offset ? `&offset=${offset}` : ''}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Airtable API error details:', {
          status: response.status,
          error: errorData,
          url: url,
          tableName: tableName
        });
        throw new Error(`Airtable API error: ${response.status} - ${errorData}`);
      }

      const data: AdminPropertiesResponse = await response.json();

      const transformedProperties: AdminProperty[] = data.records.map(
        (record) => ({
          id: record.id,
          fields: record.fields,
          createdTime: record.createdTime,
        })
      );

      allProperties.push(...transformedProperties);
      offset = data.offset;
    } while (offset);

    // If requesting all properties, return everything
    if (getAll) {
      return NextResponse.json({
        properties: allProperties,
        total: allProperties.length,
        hasMore: false,
        page: 1,
        limit: allProperties.length,
      });
    }

    // Apply pagination for regular requests
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
    console.error('Error fetching admin properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin properties' },
      { status: 500 }
    );
  }
}

// Also create endpoint to fetch single property by slug
export async function POST(request: Request) {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = 'Admin Properties';

    if (!apiKey || !baseId) {
      return NextResponse.json(
        { error: 'Missing Airtable configuration' },
        { status: 500 }
      );
    }

    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    // Build URL with filter for specific slug and done = true
    const filterFormula = `AND({Slug} = '${slug}', {Done} = TRUE())`;
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?filterByFormula=${encodeURIComponent(filterFormula)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Airtable API error details (POST):', {
        status: response.status,
        error: errorData,
        url: url,
        tableName: tableName,
        slug: slug
      });
      throw new Error(`Airtable API error: ${response.status} - ${errorData}`);
    }

    const data: AdminPropertiesResponse = await response.json();

    if (data.records.length === 0) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    const property: AdminProperty = {
      id: data.records[0].id,
      fields: data.records[0].fields,
      createdTime: data.records[0].createdTime,
    };

    return NextResponse.json({ property });
  } catch (error) {
    console.error('Error fetching property by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}