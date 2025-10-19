import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getResidentialProperties, getCommercialProperties } from '@/lib/airtable';

type RouteContext = {
  params: Promise<{ shareUuid: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { shareUuid } = await context.params;

    // Get the shared list from database
    const list = await prisma.favoritesList.findUnique({
      where: { shareUuid },
      include: {
        properties: {
          orderBy: [
            { sortOrder: 'asc' },
            { id: 'asc' }
          ]
        }
      }
    });

    if (!list) {
      return NextResponse.json(
        { error: 'Shared list not found or not publicly available' },
        { status: 404 }
      );
    }

    // Get all properties from Airtable
    const [residential, commercial] = await Promise.all([
      getResidentialProperties({ all: true }),
      getCommercialProperties({ all: true })
    ]);

    const allProperties = [...residential.properties, ...commercial.properties];

    // Filter to only properties in this list
    const listPropertyIds = list.properties.map(p => p.propertyId);
    const filteredProperties = allProperties.filter(property => 
      listPropertyIds.includes(property.id as string)
    );

    // Sort according to the list's sort order
    const sortedProperties = filteredProperties.sort((a, b) => {
      const aListItem = list.properties.find(p => p.propertyId === a.id);
      const bListItem = list.properties.find(p => p.propertyId === b.id);
      
      const aSortOrder = aListItem?.sortOrder || 0;
      const bSortOrder = bListItem?.sortOrder || 0;
      
      return aSortOrder - bSortOrder;
    });

    // Add notes to properties
    const propertiesWithNotes = sortedProperties.map(property => {
      const listItem = list.properties.find(p => p.propertyId === property.id);
      return {
        ...property,
        note: listItem?.note || null
      };
    });

    return NextResponse.json({ 
      properties: propertiesWithNotes,
      list: {
        id: list.id,
        title: list.title,
        description: list.description,
        _count: { properties: list.properties.length }
      }
    });
  } catch (error) {
    console.error('Error fetching shared list properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shared list properties' },
      { status: 500 }
    );
  }
}