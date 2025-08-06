import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import type { AdminPropertyFields } from '@/types/adminProperty';

const AUTHORIZED_EMAILS = ['pat7536@gmail.com', 'ross.caribbeankeys@gmail.com'];

type CreatePropertyRequest = {
  property: Partial<AdminPropertyFields>;
  mainImageUrls: string[];
  galleryImageUrls: string[];
};

type AirtableAttachment = {
  url: string;
};

export async function POST(request: Request) {
  try {
    // Check authentication
    const { userId } = await auth.protect();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user details from Clerk
    const user = await (await clerkClient()).users.getUser(userId);
    const userEmail = user.primaryEmailAddress?.emailAddress;

    // Check if user is authorized
    if (!userEmail || !AUTHORIZED_EMAILS.includes(userEmail)) {
      return NextResponse.json(
        { error: 'Access denied. You are not authorized to add properties.' },
        { status: 403 }
      );
    }

    // Get Airtable configuration
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = 'Admin Properties';

    if (!apiKey || !baseId) {
      return NextResponse.json(
        { error: 'Missing Airtable configuration' },
        { status: 500 }
      );
    }

    // Parse request body
    const { property, mainImageUrls, galleryImageUrls }: CreatePropertyRequest =
      await request.json();

    // Validate required fields
    if (!property.Title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Convert image URLs to Airtable attachments
    const mainImageAttachments: AirtableAttachment[] = mainImageUrls.map(
      (url) => ({ url })
    );
    const galleryImageAttachments: AirtableAttachment[] = galleryImageUrls.map(
      (url) => ({ url })
    );

    // Prepare Airtable record data
    const recordData = {
      fields: {
        ...property,
        // Add image attachments if they exist
        ...(mainImageAttachments.length > 0 && {
          'Main Image': mainImageAttachments,
        }),
        ...(galleryImageAttachments.length > 0 && {
          Images: galleryImageAttachments,
        }),
      },
    };

    // Create record in Airtable
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recordData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Airtable API error details:', {
        status: response.status,
        error: errorData,
        url: url,
        tableName: tableName,
        recordData: recordData,
      });
      return NextResponse.json(
        {
          error: `Failed to create property: ${response.status} - ${errorData}`,
        },
        { status: response.status }
      );
    }

    const createdRecord = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Property created successfully',
      record: {
        id: createdRecord.id,
        fields: createdRecord.fields,
        createdTime: createdRecord.createdTime,
      },
    });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to create property',
      },
      { status: 500 }
    );
  }
}
