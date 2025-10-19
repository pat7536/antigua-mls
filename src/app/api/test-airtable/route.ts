import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (!apiKey || !baseId) {
      return NextResponse.json(
        { error: 'Missing Airtable configuration' },
        { status: 500 }
      );
    }

    // Try to get base schema to see what tables exist
    const schemaUrl = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`;

    const schemaResponse = await fetch(schemaUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (schemaResponse.ok) {
      const schemaData = await schemaResponse.json();
      const adminPropertiesTable = schemaData.tables?.find(
        (table: any) => table.name === 'Admin Properties'
      );
      const featuresField = adminPropertiesTable?.fields?.find(
        (field: any) => field.name === 'Features'
      );

      return NextResponse.json({
        success: true,
        message: 'Base schema retrieved successfully',
        adminPropertiesTable: {
          id: adminPropertiesTable?.id,
          name: adminPropertiesTable?.name,
          fields: adminPropertiesTable?.fields?.map((field: any) => ({
            name: field.name,
            type: field.type,
            options: field.options, // This will show the allowed values for multi-select fields
          })),
        },
        featuresFieldDetails: featuresField,
      });
    }

    // If schema fails, try to test the specific table
    const tableName = 'Admin Properties';
    const testUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?maxRecords=1`;

    const testResponse = await fetch(testUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const responseText = await testResponse.text();

    return NextResponse.json({
      success: false,
      testResults: {
        status: testResponse.status,
        statusText: testResponse.statusText,
        response: responseText,
        url: testUrl,
        tableName: tableName,
      },
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json(
      {
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
