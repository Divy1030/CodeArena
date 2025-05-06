import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('Proxying forgot password request to backend:', body.email);

    // Make a request to your backend API
    const response = await fetch(endpoints.auth.forgotPassword, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email
      }),
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000)
    });

    const data = await response.json();
    console.log('Backend forgot password response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || "Password reset request failed",
          details: data
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: data.success,
      message: data.message || "Password reset instructions sent to your email"
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}