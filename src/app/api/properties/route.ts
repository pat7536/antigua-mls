import { NextResponse } from 'next/server';
import type { Property, AirtableResponse } from '@/types/property';
import type { AirtableRecordId, PropertyId } from '@/types/branded';

export async function GET() {
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

      // Transform Airtable records to our Property type
      const transformedProperties: Property[] = data.records.map((record) => ({
        id: record.id as unknown as PropertyId,
        fields: record.fields,
        createdTime: record.createdTime,
      }));

      allProperties.push(...transformedProperties);
      offset = data.offset;
    } while (offset);

    return NextResponse.json({ properties: allProperties });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
