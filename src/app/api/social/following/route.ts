import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function GET(request: NextRequest) {
  try {
    console.log('=== Social: Following API Route ===');
    
    const token = request.cookies.get('accessToken')?.value ||
                 request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token found' },
        { status: 401 }
      );
    }

    const response = await fetch(endpoints.social.following, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to get following' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message,
      data: data.data
    });
  } catch (error) {
    console.error('Error in following API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}