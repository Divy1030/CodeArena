import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function POST(request: NextRequest) {
  try {
    console.log("FRONTEND API ROUTE - Starting code execution");
    
    // Parse request body with error handling
    let body;
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
    if (!body.code || !body.language || !body.testCases || !Array.isArray(body.testCases)) {
      console.error("FRONTEND API ROUTE - Missing required fields");
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
    
    // Transform the request body
    const transformedBody = {
      ...body,
      testCases: body.testCases.map((tc: any) => ({
        input: tc.input,
        output: tc.expectedOutput || tc.output // Handle both formats
      }))
    };
    
    console.log("FRONTEND API ROUTE - API endpoint URL:", endpoints.code.run);
    console.log("FRONTEND API ROUTE - Transformed request body:", JSON.stringify(transformedBody).substring(0, 200) + "...");
    
    try {
      // Call backend API
      const response = await fetch(endpoints.code.run, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(transformedBody),
      });
      
      console.log("FRONTEND API ROUTE - Response status:", response.status);
      
      if (!response.ok) {
        console.error(`FRONTEND API ROUTE - Backend API returned error ${response.status}`);
      }
      
      let responseData;
      try {
        responseData = await response.json();
        console.log("FRONTEND API ROUTE - Response data:", JSON.stringify(responseData).substring(0, 200) + "...");
      } catch (jsonError) {
        console.error("FRONTEND API ROUTE - Failed to parse response as JSON:", jsonError);
        return NextResponse.json(
          { success: false, message: 'Invalid response from backend' },
          { status: 500 }
        );
      }
      
      // Transform backend response to match frontend expectations
      const transformedResponse = {
        success: response.ok,
        message: response.ok ? 'Code run successfully' : (responseData.message || 'Failed to run code'),
        data: responseData.data,
        statusCode: response.status
      };
      
      console.log("FRONTEND API ROUTE - Transformed response:", JSON.stringify(transformedResponse).substring(0, 200) + "...");
      
      return NextResponse.json(transformedResponse);
    } catch (fetchError) {
      console.error("FRONTEND API ROUTE - Fetch error:", fetchError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to connect to backend API',
          details: fetchError instanceof Error ? fetchError.message : String(fetchError)
        },
        { status: 500 }
      );
    }
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