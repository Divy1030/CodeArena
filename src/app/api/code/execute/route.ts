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

    // Use the endpoint from api.ts
    const response = await fetch(endpoints.code.execute, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: body.code,
        language: body.language,
        testCases: body.testCases
      }),
    });

    const data = await response.json();
    console.log('Code execution response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Code execution failed" },
        { status: response.status }
      );
    }

    // Pass through the actual response structure from the backend
    return NextResponse.json({
      success: data.success,
      message: data.message,
      data: data.data || data // Handle different response structures
    });
  } catch (error) {
    console.error('Code execution error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}