import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.code || !body.language || !body.testCases) {
      return NextResponse.json(
        { success: false, message: 'Code, language, and testCases are required' },
        { status: 400 }
      );
    }

    // Log for debugging
    console.log('Using API endpoint:', endpoints.code.execute);
    console.log('Request payload:', {
      code: body.code.substring(0, 50) + '...',  // Log only part of the code for brevity
      language: body.language,
      testCasesCount: body.testCases.length
    });

    // Use the endpoint from api.ts instead of hardcoding it
    const response = await fetch(endpoints.code.execute, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: body.code,
        language: body.language,
        testCases: body.testCases.map((tc: any) => ({ 
          input: tc.input, 
          output: tc.expectedOutput 
        }))
      }),
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data structure:', JSON.stringify(data).substring(0, 200) + '...');

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Code execution failed" },
        { status: response.status }
      );
    }

    // Check the structure of the data and adapt accordingly
    if (data && data.data && data.data.testCases) {
      // Handle nested structure where testCases is inside data
      return NextResponse.json({
        success: data.success,
        message: data.message,
        data: {
          allPassed: data.data.success || data.success,
          results: data.data.testCases.map((tc: any) => ({
            testCase: tc.testCase || 1,
            input: tc.input || '',
            expectedOutput: tc.expectedOutput || tc.output || '',
            actualOutput: tc.actualOutput || '',
            passed: tc.passed || false,
            stderr: null,
            status: tc.status || 'Unknown',
            time: tc.time || '0.000',
            memory: tc.memory || 0
          }))
        }
      });
    } else if (data && data.testCases) {
      // Handle flat structure where testCases is at the root
      return NextResponse.json({
        success: data.success,
        message: data.message,
        data: {
          allPassed: data.success,
          results: data.testCases.map((tc: any) => ({
            testCase: tc.testCase || 1,
            input: tc.input || '',
            expectedOutput: tc.expectedOutput || tc.output || '',
            actualOutput: tc.actualOutput || '',
            passed: tc.passed || false,
            stderr: null,
            status: tc.status || 'Unknown',
            time: tc.time || '0.000',
            memory: tc.memory || 0
          }))
        }
      });
    } else {
      // Fallback for unexpected response structure
      console.error('Unexpected API response structure:', data);
      return NextResponse.json({
        success: false,
        message: 'Unable to interpret execution results',
        data: {
          allPassed: false,
          results: body.testCases.map((tc: any, index: number) => ({
            testCase: index + 1,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: 'Execution result unavailable',
            passed: false,
            stderr: null,
            status: 'Error',
            time: '0.000',
            memory: 0
          }))
        }
      });
    }
  } catch (error) {
    console.error('Code execution error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + String(error) },
      { status: 500 }
    );
  }
}