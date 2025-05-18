import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';
import "server-only";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ contestId: string, moderatorId: string }> }
) {
  try {
    // Wait for params since it's now a Promise
    const { contestId, moderatorId } = await params;
    
    if (!contestId || !moderatorId) {
      return NextResponse.json(
        { success: false, message: 'Contest ID and Moderator ID are required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Get token from cookies or authorization header
    const token = request.cookies.get('accessToken')?.value ||
                 request.headers.get('Authorization')?.replace('Bearer ', '') ||
                 request.headers.get('x-access-token');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token found in request' },
        { status: 401 }
      );
    }

    console.log(`Editing moderator ${moderatorId} for contest ${contestId}`);

    // Call backend API to edit moderator
    const response = await fetch(`${endpoints.contest.editModerator}/${contestId}/${moderatorId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      cache: 'no-store'
    });

    // Check if the response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      // Handle non-JSON response
      const textResponse = await response.text();
      console.error("Non-JSON response received:", textResponse);
      return NextResponse.json(
        { 
          success: false, 
          message: "Server returned an invalid response format" 
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("Edit moderator response:", data);

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || "Failed to update moderator",
          details: data
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || "Moderator updated successfully"
    });
  } catch (error) {
    console.error('Edit moderator error details:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}