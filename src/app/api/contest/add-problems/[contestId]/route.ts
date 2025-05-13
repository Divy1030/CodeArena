import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';
import "server-only";

export async function POST(
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

    // Get the problem data from the request body
    const problemData = await request.json();

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
    const response = await fetch(`${endpoints.contest.addProblems}/${contestId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(problemData),
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
    
    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to add problem to contest',
          details: data
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Problem added to contest successfully',
      data: data.data
    });
  } catch (error) {
    console.error('Error adding problem to contest:', error);
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