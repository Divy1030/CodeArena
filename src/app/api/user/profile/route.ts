import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function GET(request: NextRequest) {
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
    const response = await fetch(endpoints.user.profile, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    console.log('Backend user profile response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to get user profile" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: data.success,
      message: data.message,
      data: data.data
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}