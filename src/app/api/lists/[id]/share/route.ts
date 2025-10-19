import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { nanoid } from 'nanoid';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { userId } = await auth();
    const { id } = await context.params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the list belongs to the user
    const existingList = await prisma.favoritesList.findFirst({
      where: { id, userId },
    });

    if (!existingList) {
      return NextResponse.json(
        { error: 'Favorites list not found' },
        { status: 404 }
      );
    }

    // Generate a share UUID if it doesn't exist
    let shareUuid = existingList.shareUuid;
    if (!shareUuid) {
      shareUuid = nanoid(12); // 12 characters for a clean, unguessable URL

      await prisma.favoritesList.update({
        where: { id },
        data: { shareUuid },
      });
    }

    return NextResponse.json({ shareUuid });
  } catch (error) {
    console.error('Error generating share link:', error);
    return NextResponse.json(
      { error: 'Failed to generate share link' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { userId } = await auth();
    const { id } = await context.params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the list belongs to the user
    const existingList = await prisma.favoritesList.findFirst({
      where: { id, userId },
    });

    if (!existingList) {
      return NextResponse.json(
        { error: 'Favorites list not found' },
        { status: 404 }
      );
    }

    // Remove the share UUID to disable sharing
    await prisma.favoritesList.update({
      where: { id },
      data: { shareUuid: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error disabling share link:', error);
    return NextResponse.json(
      { error: 'Failed to disable share link' },
      { status: 500 }
    );
  }
}
