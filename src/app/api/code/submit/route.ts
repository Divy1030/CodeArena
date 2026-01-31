import { NextRequest, NextResponse } from 'next/server';

// Use deployed backend for code execution (requires Redis)
const DEPLOYED_API_URL = 'https://api.code-arena.tech';

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface RequestBody {
  code: string;
  language: string;
  testCases: TestCase[];
  problemId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    
    // Validate required fields
    if (!body.code || !body.language || !body.problemId || !Array.isArray(body.testCases)) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: code, language, problemId, and testCases' },
        { status: 400 }
      );
    }

    // Get token from cookies or authorization header
    const token = request.cookies.get('accessToken')?.value || 
                 request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Call DEPLOYED backend API to submit code (uses Redis)
    const response = await fetch(`${DEPLOYED_API_URL}/api/v1/code/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        code: body.code,
        language: body.language.toLowerCase(),
        testCases: body.testCases,
        problemId: body.problemId
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to submit code' },
        { status: response.status }
      );
    }

    // Return jobId to client
    return NextResponse.json({
      success: true,
      data: data.data, // Contains { jobId: "..." }
      message: data.message
    });
  } catch (error) {
    console.error('Error submitting code:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}