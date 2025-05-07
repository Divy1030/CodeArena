import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies or authorization header
    const token = request.cookies.get('accessToken')?.value ||
                 request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Call backend API
    const response = await fetch(endpoints.auth.logout, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    console.log('Backend logout response:', data);

    // Create a response that clears cookies
    const nextResponse = NextResponse.json({
      success: data.success,
      message: data.message || 'Logged out successfully',
      data: null
    });

    // Clear cookies
    nextResponse.cookies.delete('accessToken');
    nextResponse.cookies.delete('refreshToken');

    return nextResponse;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}