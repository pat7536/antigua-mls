import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const lists = await prisma.favoritesList.findMany({
      where: { userId },
      include: {
        properties: true,
        _count: {
          select: { properties: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ lists });
  } catch (error) {
    console.error('Error fetching favorites lists:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch favorites lists',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description } = body;

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const list = await prisma.favoritesList.create({
      data: {
        userId,
        title: title.trim(),
        description: description?.trim() || null,
      },
      include: {
        properties: true,
        _count: {
          select: { properties: true },
        },
      },
    });

    return NextResponse.json({ list }, { status: 201 });
  } catch (error) {
    console.error('Error creating favorites list:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create favorites list',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
