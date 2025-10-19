import { NextResponse } from 'next/server';
import { getResidentialProperties } from '@/lib/airtable';

export async function GET(request: Request) {
  try {
    // Parse pagination parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const all = searchParams.get('all') === 'true';

    const result = await getResidentialProperties({ page, limit, all });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching residential properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch residential properties' },
      { status: 500 }
    );
  }
}
