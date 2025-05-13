import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.newPassword) {
      return NextResponse.json(
        { success: false, message: 'Email and new password are required' },
        { status: 400 }
      );
    }

    // Call backend API
    const response = await fetch(endpoints.auth.updatePassword, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email,
        newPassword: body.newPassword
      }),
    });

    const data = await response.json();
    console.log('Update password response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Password update failed" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: data.success,
      message: data.message || "Password updated successfully",
      data: data.data
    });
  } catch (error) {
    console.error('Update password error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}