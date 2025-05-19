import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.code || !body.language || !body.testCases || !Array.isArray(body.testCases)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields: code, language, and testCases array are required' 
        },
        { status: 400 }
      );
    }

    // Get token from cookies or authorization header
    const token = request.cookies.get('accessToken')?.value || 
                 request.headers.get('Authorization')?.replace('Bearer ', '') ||
                 request.headers.get('authorization')?.replace('Bearer ', '');
    
    // Call backend API
    const response = await fetch(`${endpoints.code.runAllTestCases}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body),
    });

    console.log("Execute API response status:", response.status);
    
    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error("Non-JSON response received:", textResponse.substring(0, 500));
      return NextResponse.json(
        { 
          success: false, 
          message: 'Backend returned non-JSON response',
          details: textResponse.substring(0, 500)
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("Execute API response data:", data);

    return NextResponse.json({
      success: response.ok,
      message: response.ok ? 'Code executed successfully' : (data.message || 'Failed to execute code'),
      data: data.data,
      statusCode: response.status
    });
  } catch (error) {
    console.error('Error executing code:', error);
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