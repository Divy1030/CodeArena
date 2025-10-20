import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get token from cookies or authorization header
    const token = request.cookies.get('accessToken')?.value ||
                 request.headers.get('Authorization')?.replace('Bearer ', '') || 
                 localStorage.getItem('token'); // Add localStorage as fallback
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token found' },
        { status: 401 }
      );
    }

    // Add debug logging
    console.log('Attempting to create password with token:', token.substring(0, 10) + '...');

    // Validate required fields
    if (!body.newPassword) {
      return NextResponse.json(
        { success: false, message: 'New password is required' },
        { status: 400 }
      );
    }

    // Validate password length
    if (body.newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Call backend API
    const response = await fetch(endpoints.user.createPassword, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        newPassword: body.newPassword
      }),
    });

    const data = await response.json();
    console.log('Backend create password response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to create password" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: data.success,
      message: data.message || "Password created successfully",
      data: data.data
    });
  } catch (error) {
    console.error('Create password error details:', error);
    return NextResponse.json(
      { success: false, message: 'Error creating password: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}