import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClerkClient } from '@clerk/nextjs/server';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

type AgentRequest = {
  id: string;
  fullName: string;
  email: string;
  agencyName: string;
  status: string;
  userId: string;
  submittedAt: string;
  notes: string;
  createdTime: string;
};

export async function GET() {
  try {
    // Verify user is authenticated and is admin
    const { userId } = await auth.protect();

    const user = await clerkClient.users.getUser(userId);
    const userRole = user.unsafeMetadata?.role as string;

    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (!apiKey || !baseId) {
      return NextResponse.json(
        { error: 'Missing Airtable configuration' },
        { status: 500 }
      );
    }

    // Fetch agent requests from Airtable
    const airtableUrl = `https://api.airtable.com/v0/${baseId}/AgentRequests`;
    const response = await fetch(airtableUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Airtable API error:', response.status, errorData);
      return NextResponse.json(
        { error: 'Failed to fetch agent requests' },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Transform Airtable data to our format
    const agentRequests: AgentRequest[] = data.records.map((record: any) => ({
      id: record.id,
      fullName: record.fields['Full Name'] || '',
      email: record.fields['Email'] || '',
      agencyName: record.fields['Agency Name'] || '',
      status: record.fields['Status'] || 'Pending',
      userId: record.fields['User ID'] || '',
      submittedAt: record.fields['Submitted At'] || '',
      notes: record.fields['Notes'] || '',
      createdTime: record.createdTime,
    }));

    return NextResponse.json({
      success: true,
      agentRequests,
    });
  } catch (error) {
    console.error('Error fetching agent requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
