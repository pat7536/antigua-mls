import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { userId } = await auth();
    const { id: listId } = await context.params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { propertyId, note } = body;

    if (!propertyId || typeof propertyId !== 'string') {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Verify the list belongs to the user
    const list = await prisma.favoritesList.findFirst({
      where: { id: listId, userId },
    });

    if (!list) {
      return NextResponse.json(
        { error: 'Favorites list not found' },
        { status: 404 }
      );
    }

    // Check if property is already in the list
    const existingProperty = await prisma.favoritesListProperty.findUnique({
      where: {
        favoritesListId_propertyId: {
          favoritesListId: listId,
          propertyId,
        },
      },
    });

    if (existingProperty) {
      return NextResponse.json(
        { error: 'Property already in list' },
        { status: 409 }
      );
    }

    // Get the next sort order
    const maxSortOrder = await prisma.favoritesListProperty.aggregate({
      where: { favoritesListId: listId },
      _max: { sortOrder: true },
    });

    const property = await prisma.favoritesListProperty.create({
      data: {
        favoritesListId: listId,
        propertyId,
        note: note?.trim() || null,
        sortOrder: (maxSortOrder._max.sortOrder || 0) + 1,
      },
    });

    return NextResponse.json({ property }, { status: 201 });
  } catch (error) {
    console.error('Error adding property to favorites list:', error);
    return NextResponse.json(
      { error: 'Failed to add property to favorites list' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { userId } = await auth();
    const { id: listId } = await context.params;
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Verify the list belongs to the user
    const list = await prisma.favoritesList.findFirst({
      where: { id: listId, userId },
    });

    if (!list) {
      return NextResponse.json(
        { error: 'Favorites list not found' },
        { status: 404 }
      );
    }

    const deletedProperty = await prisma.favoritesListProperty.deleteMany({
      where: {
        favoritesListId: listId,
        propertyId,
      },
    });

    if (deletedProperty.count === 0) {
      return NextResponse.json(
        { error: 'Property not found in list' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing property from favorites list:', error);
    return NextResponse.json(
      { error: 'Failed to remove property from favorites list' },
      { status: 500 }
    );
  }
}
