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

    // Handle different error responses
    if (!response.ok) {
      switch (response.status) {
        case 400:
          return NextResponse.json(
            { success: false, message: data.message || 'Email is required' },
            { status: 400 }
          );
        case 404:
          return NextResponse.json(
            { success: false, message: data.message || 'No user found with this email' },
            { status: 404 }
          );
        case 500:
          return NextResponse.json(
            { success: false, message: data.message || 'Failed to send OTP email. Please try again later.' },
            { status: 500 }
          );
        default:
          return NextResponse.json(
            { 
              success: false, 
              message: data.message || "Password reset request failed"
            },
            { status: response.status }
          );
      }
    }

    // Success response
    return NextResponse.json({
      success: data.success || true,
      message: data.message || "OTP sent successfully. Please check your email."
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    
    // Handle timeout errors
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { success: false, message: 'Request timeout. Please try again.' },
        { status: 408 }
      );
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { success: false, message: 'Unable to connect to the server. Please try again.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error"
      },
      { status: 500 }
    );
  }
}