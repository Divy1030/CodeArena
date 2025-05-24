import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function POST(
  request: NextRequest,
  { params }: { params: { contestId: string; problemId: string } }
) {
  try {
    const { contestId, problemId } = params;
    
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
                 request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Call backend API
    const backendUrl = `${endpoints.problem.submit}/${contestId}/${problemId}`;
    console.log('Submitting solution to:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });

    // const contentType = response.headers.get('content-type');
    // if (!contentType || !contentType.includes('application/json')) {
    //   const textResponse = await response.text();
    //   console.error('Non-JSON response:', textResponse);
    //   return NextResponse.json(
    //     { success: false, message: 'Backend returned non-JSON response', backend: textResponse },
    //     { status: 500 }
    //   );
    // }

    const data = await response.json();
    console.log("Data received from backend:", data);

    return NextResponse.json({
      success: response.ok,
      message: response.ok ? 'Solution submitted successfully' : (data.message || 'Failed to submit solution'),
      data: data.data || data,
      statusCode: response.status
    });
  } catch (error) {
    console.error('Error submitting solution:', error);
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