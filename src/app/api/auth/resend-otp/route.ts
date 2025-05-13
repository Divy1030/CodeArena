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

    // We don't have a direct resend OTP endpoint, so we'll use the forgot password endpoint
    // which will generate a new OTP
    const response = await fetch(endpoints.auth.forgotPassword, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email
      }),
    });

    const data = await response.json();
    console.log('Resend OTP response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to resend verification code" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code resent. Please check your email.",
      data: null
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}