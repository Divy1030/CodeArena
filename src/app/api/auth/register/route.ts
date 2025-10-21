import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.username || !body.email || !body.password) {
      return NextResponse.json(
        { success: false, message: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    // Call backend API
    const response = await fetch(endpoints.auth.register, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: body.username,
        email: body.email,
        password: body.password
      }),
    });

    const data = await response.json();
    console.log('Backend register response:', data);

    // Handle different response statuses
    if (!response.ok) {
      // Handle specific error cases based on status codes
      switch (response.status) {
        case 400:
          return NextResponse.json(
            { success: false, message: data.message || 'Invalid input data' },
            { status: 400 }
          );
        case 409:
          return NextResponse.json(
            { success: false, message: data.message || 'User already exists with this email or username' },
            { status: 409 }
          );
        case 500:
          return NextResponse.json(
            { success: false, message: data.message || 'Failed to send OTP email. Please try again later.' },
            { status: 500 }
          );
        default:
          return NextResponse.json(
            { success: false, message: data.message || 'Registration failed' },
            { status: response.status }
          );
      }
    }

    // Success response
    return NextResponse.json({
      success: data.success || true,
      message: data.message || 'OTP sent successfully. Please check your email.',
      data: data.data || null
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle network errors or fetch failures
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { success: false, message: 'Unable to connect to the server. Please try again.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}