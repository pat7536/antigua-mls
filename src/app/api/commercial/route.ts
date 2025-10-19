import { NextResponse } from 'next/server';
import { getCommercialProperties } from '@/lib/airtable';

export async function GET(request: Request) {
  try {
    // Parse pagination parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const all = searchParams.get('all') === 'true';

    const result = await getCommercialProperties({ page, limit, all });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching commercial properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch commercial properties' },
      { status: 500 }
    );
  }
}
