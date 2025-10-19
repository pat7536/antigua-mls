import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type RouteContext = {
  params: Promise<{ shareUuid: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { shareUuid } = await context.params;

    const list = await prisma.favoritesList.findUnique({
      where: { shareUuid },
      include: {
        properties: {
          orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        },
        _count: {
          select: { properties: true },
        },
      },
    });

    if (!list) {
      return NextResponse.json(
        { error: 'Shared list not found or not publicly available' },
        { status: 404 }
      );
    }

    // Don't expose the userId in public responses
    const { userId: _userId, ...publicList } = list;

    return NextResponse.json({ list: publicList });
  } catch (error) {
    console.error('Error fetching public favorites list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shared list' },
      { status: 500 }
    );
  }
}
