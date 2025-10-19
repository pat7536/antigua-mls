import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { userId } = await auth();
    const { id } = await context.params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const list = await prisma.favoritesList.findFirst({
      where: {
        id,
        userId,
      },
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
        { error: 'Favorites list not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ list });
  } catch (error) {
    console.error('Error fetching favorites list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites list' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { userId } = await auth();
    const { id } = await context.params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description } = body;

    const existingList = await prisma.favoritesList.findFirst({
      where: { id, userId },
    });

    if (!existingList) {
      return NextResponse.json(
        { error: 'Favorites list not found' },
        { status: 404 }
      );
    }

    const list = await prisma.favoritesList.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
      },
      include: {
        properties: true,
        _count: {
          select: { properties: true },
        },
      },
    });

    return NextResponse.json({ list });
  } catch (error) {
    console.error('Error updating favorites list:', error);
    return NextResponse.json(
      { error: 'Failed to update favorites list' },
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

    const existingList = await prisma.favoritesList.findFirst({
      where: { id, userId },
    });

    if (!existingList) {
      return NextResponse.json(
        { error: 'Favorites list not found' },
        { status: 404 }
      );
    }

    await prisma.favoritesList.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting favorites list:', error);
    return NextResponse.json(
      { error: 'Failed to delete favorites list' },
      { status: 500 }
    );
  }
}
