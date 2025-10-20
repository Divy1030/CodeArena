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
    console.log('Using endpoint:', endpoints.user.changePassword);

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

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Check if response is HTML (error page) instead of JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('Non-JSON response received:', textResponse.substring(0, 200));
      
      return NextResponse.json(
        { success: false, message: 'Server returned an error page instead of JSON. Check if the endpoint exists.' },
        { status: 500 }
      );
    }

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