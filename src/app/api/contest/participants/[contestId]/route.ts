import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';
import "server-only";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contestId: string }> }
) {
  try {
    // Wait for params since it's a Promise
    const { contestId } = await params;
    
    if (!contestId) {
      return NextResponse.json(
        { success: false, message: 'Contest ID is required' },
        { status: 400 }
      );
    }

    // Get token from cookies or authorization header
    const token = request.cookies.get('accessToken')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Call backend API
    const response = await fetch(`${endpoints.contest.getContestParticipants}/${contestId}/participants`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      cache: "no-store",
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
    // console.log("Participants response:", data);
    
    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to fetch participants',
          details: data
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      participants: data.data,
    });
  } catch (error) {
    console.error('Error fetching participants:', error);
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