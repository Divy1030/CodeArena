import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies, authorization header, or localStorage
    const token = request.cookies.get('accessToken')?.value ||
                 request.headers.get('Authorization')?.replace('Bearer ', '') ||
                 request.headers.get('x-access-token');
    
    if (!token) {
      console.log('No token found in request');
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token found in request' },
        { status: 401 }
      );
    }

    console.log('Fetching user profile with token:', token.substring(0, 10) + '...');

    // Call backend API using the getUserData endpoint
    const response = await fetch(endpoints.user.getUserData, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store'
    });

    const data = await response.json();
    console.log('Backend user profile response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch user data" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: data.success,
      message: data.message,
      data: data.data
    });
  } catch (error) {
    console.error('Get user data error details:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}