import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClerkClient } from '@clerk/nextjs/server';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

type ApprovalData = {
  action: 'approve' | 'reject';
};

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify user is authenticated and is admin
    const { userId: adminUserId } = await auth.protect();
    
    const adminUser = await clerkClient.users.getUser(adminUserId);
    const adminRole = adminUser.unsafeMetadata?.role as string;
    
    if (adminRole !== 'admin') {
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

    const { action }: ApprovalData = await request.json();
    const recordId = params.id;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    // First, get the agent request record to extract the user ID
    const getUrl = `https://api.airtable.com/v0/${baseId}/AgentRequests/${recordId}`;
    const getResponse = await fetch(getUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!getResponse.ok) {
      return NextResponse.json(
        { error: 'Agent request not found' },
        { status: 404 }
      );
    }

    const recordData = await getResponse.json();
    const targetUserId = recordData.fields['User ID'];

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'No user ID found in agent request' },
        { status: 400 }
      );
    }

    // Update the status in Airtable
    const newStatus = action === 'approve' ? 'Approved' : 'Rejected';
    const airtableUrl = `https://api.airtable.com/v0/${baseId}/AgentRequests/${recordId}`;
    
    const airtableResponse = await fetch(airtableUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          'Status': newStatus,
        },
      }),
    });

    if (!airtableResponse.ok) {
      const errorData = await airtableResponse.text();
      console.error('Airtable API error:', airtableResponse.status, errorData);
      return NextResponse.json(
        { error: 'Failed to update agent request status' },
        { status: 500 }
      );
    }

    // If approved, update the user's role in Clerk
    if (action === 'approve') {
      try {
        await clerkClient.users.updateUserMetadata(targetUserId, {
          unsafeMetadata: {
            role: 'agent',
          },
        });
      } catch (clerkError) {
        console.error('Error updating user role in Clerk:', clerkError);
        // Still return success since Airtable was updated, but log the issue
        return NextResponse.json({
          success: true,
          message: 'Agent request approved in Airtable, but failed to update user role. Please update manually.',
          status: newStatus,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: action === 'approve' 
        ? 'Agent request approved and user role updated to agent'
        : 'Agent request rejected',
      status: newStatus,
    });

  } catch (error) {
    console.error('Error processing agent request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}