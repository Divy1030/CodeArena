import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';
import "server-only";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ contestId: string; problemId: string }> }
) {
  try {
    // Wait for params since it's now a Promise
    const { contestId, problemId } = await params;
    
    if (!contestId || !problemId) {
      return NextResponse.json(
        { success: false, message: 'contestId and problemId are required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['score', 'solutionCode', 'languageUsed', 'timeOccupied', 'memoryOccupied', 'timeGivenOnSolution'];
    for (const field of requiredFields) {
      if (body[field] === undefined) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Get token from cookies or authorization header
    const token = request.cookies.get('accessToken')?.value || 
                 request.headers.get('Authorization')?.replace('Bearer ', '') ||
                 request.headers.get('authorization')?.replace('Bearer ', '') ||
                 request.headers.get('x-access-token');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token found in request' },
        { status: 401 }
      );
    }

    // Call backend API
    const backendUrl = `${endpoints.problem.submit}/${contestId}/${problemId}`;
    console.log('Submitting solution to contest:', contestId, 'problem:', problemId);

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    // Check content type before trying to parse JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('Non-JSON response received:', textResponse);
      return NextResponse.json(
        { success: false, message: 'Backend returned non-JSON response', details: textResponse.substring(0, 500) },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("Submit solution response:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || 'Failed to submit solution',
          details: data
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || 'Solution submitted successfully',
      data: data.data || data
    });
  } catch (error) {
    console.error('Submit solution error details:', error);
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