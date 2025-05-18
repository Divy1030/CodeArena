import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.otp) {
      return NextResponse.json(
        { success: false, message: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Call backend API
    const response = await fetch(endpoints.auth.verifyResetPasswordOtp, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email,
        otp: body.otp
      }),
    });

    const data = await response.json();
    console.log('Verify reset password OTP response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "OTP verification failed" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: data.success,
      message: data.message || "OTP verified successfully",
      data: data.data
    });
  } catch (error) {
    console.error('Verify reset password OTP error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}