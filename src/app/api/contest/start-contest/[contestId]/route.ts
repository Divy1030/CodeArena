import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';
import "server-only";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contestId: string }> }
) {
  try {
    // Wait for params since it's now a Promise
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
    const response = await fetch(`${endpoints.contest.startContest}/${contestId}`, {
      method: 'GET',  // Changed from POST to GET to match your backend
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
    console.log("Start contest response:", data);

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to start contest',
          details: data
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contest started successfully',
      data: data.data
    });
  } catch (error) {
    console.error('Error starting contest:', error);
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