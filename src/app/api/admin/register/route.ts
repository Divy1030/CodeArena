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
    const response = await fetch(endpoints.admin.register, {
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
    console.log('Admin register response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Admin registration failed" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: data.success,
      message: data.message || "Admin registered successfully! Please check your email for verification.",
      data: data.data
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}