import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

// Define interfaces for type safety
interface TestCase {
  input: string;
  expectedOutput?: string;
  output?: string;
}

interface RequestBody {
  code: string;
  language: string;
  testCases: TestCase[];
}

interface BackendTestCaseResult {
  input?: string;
  expectedOutput?: string;
  actualOutput?: string;
  output?: string;
  passed?: boolean;
  status?: string;
  stderr?: string | null;
  time?: string;
  memory?: number;
}

interface BackendResponseData {
  results?: BackendTestCaseResult[];
  score?: number;
  passedTests?: number;
  totalTests?: number;
}

interface BackendResponse {
  data?: BackendResponseData;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log("FRONTEND API EXECUTE ROUTE - Starting code execution for all test cases");
    
    // Parse request body with error handling
    let body: RequestBody;
    try {
      body = await request.json();
      console.log("FRONTEND API EXECUTE ROUTE - Request body parsed successfully");
    } catch (parseError) {
      console.error("FRONTEND API EXECUTE ROUTE - Failed to parse request body:", parseError);
      return NextResponse.json(
        { success: false, message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    console.log("FRONTEND API EXECUTE ROUTE - Original request body:", body);
    
    // Validate required fields
    if (!body.code || !body.language || !body.testCases || !Array.isArray(body.testCases)) {
      console.error("FRONTEND API EXECUTE ROUTE - Missing required fields");
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
    
    // Transform the request body - make sure we use expectedOutput for the execute-all endpoint
    const transformedBody = {
      ...body,
      testCases: body.testCases.map((tc: TestCase) => ({
        input: tc.input,
        output: tc.expectedOutput || tc.output // Make sure we send expectedOutput
      }))
    };
    
    console.log("FRONTEND API EXECUTE ROUTE - API endpoint URL:", endpoints.code.runAllTestCases);
    console.log("FRONTEND API EXECUTE ROUTE - Transformed request body:", JSON.stringify(transformedBody).substring(0, 200) + "...");
    
    try {
      // Call backend API
      const response = await fetch(endpoints.code.runAllTestCases, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(transformedBody),
      });
      
      console.log("FRONTEND API EXECUTE ROUTE - Response status:", response.status);
      
      if (!response.ok) {
        console.error(`FRONTEND API EXECUTE ROUTE - Backend API returned error ${response.status}`);
      }
      
      let responseData: BackendResponse;
      try {
        responseData = await response.json();
        console.log("FRONTEND API EXECUTE ROUTE - Response data:", JSON.stringify(responseData).substring(0, 200) + "...");
      } catch (jsonError) {
        console.error("FRONTEND API EXECUTE ROUTE - Failed to parse response as JSON:", jsonError);
        return NextResponse.json(
          { success: false, message: 'Invalid response from backend' },
          { status: 500 }
        );
      }
      
      // Transform backend response to match frontend expectations
      // Note the specific format here to match what the submit function expects
      const transformedResponse = {
        success: response.ok,
        message: response.ok ? 'Code executed successfully' : (responseData.message || 'Failed to execute code'),
        data: {
          results: responseData.data?.results?.map((tc: BackendTestCaseResult, idx: number) => ({
            testCase: idx + 1,
            input: tc.input || body.testCases[idx]?.input || '',
            expectedOutput: tc.expectedOutput || body.testCases[idx]?.expectedOutput || '',
            actualOutput: tc.actualOutput || tc.output || '',
            passed: tc.passed || tc.status === 'Accepted',
            stderr: tc.stderr || null,
            status: tc.status || (tc.passed ? 'Accepted' : 'Wrong Answer'),
            time: tc.time || '0.00',
            memory: tc.memory || 0
          })) || [],
          allPassed: responseData.data?.score === 100,
          score: responseData.data?.score || 0,
          passedTests: responseData.data?.passedTests || 0,
          totalTests: responseData.data?.totalTests || 0
        },
        statusCode: response.status
      };
      
      console.log("FRONTEND API EXECUTE ROUTE - Transformed response:", JSON.stringify(transformedResponse).substring(0, 200) + "...");
      
      return NextResponse.json(transformedResponse);
    } catch (fetchError) {
      console.error("FRONTEND API EXECUTE ROUTE - Fetch error:", fetchError);
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
    console.error('FRONTEND API EXECUTE ROUTE - Unhandled error:', error);
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