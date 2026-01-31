import { NextRequest, NextResponse } from 'next/server';

// Use deployed backend for code execution (requires Redis)
const DEPLOYED_API_URL = 'https://api.code-arena.tech';

// Define interfaces for type safety
interface TestCase {
  input: string;
  expectedOutput: string;
}

interface RequestBody {
  code: string;
  language: string;
  testCases: TestCase[];
}

export async function POST(request: NextRequest) {
  try {
    console.log("FRONTEND API ROUTE - Starting code execution");
    
    // Parse request body with error handling
    let body: RequestBody;
    try {
      body = await request.json();
      console.log("FRONTEND API ROUTE - Request body parsed successfully");
    } catch (parseError) {
      console.error("FRONTEND API ROUTE - Failed to parse request body:", parseError);
      return NextResponse.json(
        { success: false, message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    console.log("FRONTEND API ROUTE - Original request body:", body);
    
    // Validate required fields
    if (!body.code || !body.language || !Array.isArray(body.testCases)) {
      console.error("FRONTEND API ROUTE - Missing required fields");
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields: code, language, and testCases' 
        },
        { status: 400 }
      );
    }

    // Get token from cookies or authorization header
    const token = request.cookies.get('accessToken')?.value || 
                 request.headers.get('Authorization')?.replace('Bearer ', '') ||
                 request.headers.get('authorization')?.replace('Bearer ', '');
    
    // Call DEPLOYED backend API to start code execution (uses Redis)
    const response = await fetch(`${DEPLOYED_API_URL}/api/v1/code/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        code: body.code,
        language: body.language.toLowerCase(),
        testCases: body.testCases
      }),
    });
    
    console.log("FRONTEND API ROUTE - Response status:", response.status);
    
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to run code' },
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
    console.error('FRONTEND API ROUTE - Unhandled error:', error);
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