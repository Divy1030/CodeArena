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
    console.log('Attempting to change password with token:', token.substring(0, 10) + '...');

    // Validate required fields
    if (!body.oldPassword || !body.newPassword) {
      return NextResponse.json(
        { success: false, message: 'Old password and new password are required' },
        { status: 400 }
      );
    }

    // Call backend API
    const response = await fetch(endpoints.user.changePassword, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        oldPassword: body.oldPassword,
        newPassword: body.newPassword
      }),
    });

    const data = await response.json();
    console.log('Backend change password response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to change password" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: data.success,
      message: data.message || "Password changed successfully",
      data: data.data
    });
  } catch (error) {
    console.error('Change password error details:', error);
    return NextResponse.json(
      { success: false, message: 'Error changing password: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}