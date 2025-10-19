import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

type AgentRequestData = {
  fullName: string;
  email: string;
  agencyName: string;
  licenseNumber: string;
  phoneNumber: string;
  additionalNotes?: string;
  // File upload will be handled separately
};

export async function POST(request: Request) {
  try {
    // Verify user is authenticated
    const { userId } = await auth.protect();

    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (!apiKey || !baseId) {
      return NextResponse.json(
        { error: 'Missing Airtable configuration' },
        { status: 500 }
      );
    }

    // Parse request body
    const formData: AgentRequestData = await request.json();

    // Validate required fields
    const { fullName, email, agencyName, licenseNumber, phoneNumber } =
      formData;
    if (!fullName || !email || !agencyName || !licenseNumber || !phoneNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Start with minimal fields to test - some fields might be configured as select instead of text
    const airtableRecord = {
      fields: {
        'Full Name': fullName,
        Email: email,
        'Agency Name': agencyName,
        Status: 'Pending',
        'User ID': userId,
        Notes: `License: ${licenseNumber}, Phone: ${phoneNumber}, Additional: ${formData.additionalNotes || 'None'}`,
      },
    };

    // Submit to AgentRequests table
    const airtableUrl = `https://api.airtable.com/v0/${baseId}/AgentRequests`;
    const response = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(airtableRecord),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Airtable API error:', response.status, errorData);
      return NextResponse.json(
        { error: 'Failed to submit agent request' },
        { status: 500 }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Agent request submitted successfully',
      recordId: result.id,
    });
  } catch (error) {
    console.error('Error submitting agent request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
