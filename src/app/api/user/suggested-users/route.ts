import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function GET(request: NextRequest) {
  try {
    console.log('=== Frontend API Route Called ===');
    console.log('Request URL:', request.url);
    
    // Get token from cookies or authorization header
    const token = request.cookies.get('accessToken')?.value ||
                 request.headers.get('Authorization')?.replace('Bearer ', '') ||
                 request.headers.get('authorization')?.replace('Bearer ', '');
    
    console.log('Token found:', token ? 'Yes' : 'No');
    console.log('Token preview:', token?.substring(0, 20) + '...');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token found' },
        { status: 401 }
      );
    }

    const backendUrl = endpoints.user.suggestedUsers;
    console.log('Calling backend URL:', backendUrl);

    // Call backend API
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    console.log('Backend response status:', response.status);
    console.log('Backend response headers:', Object.fromEntries(response.headers.entries()));

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('Non-JSON response received:');
      console.error('Content-Type:', contentType);
      console.error('Response preview:', textResponse.substring(0, 500));
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Backend returned non-JSON response',
          details: {
            status: response.status,
            contentType,
            preview: textResponse.substring(0, 200)
          }
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log('Backend response data:', data);

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to get suggested users',
          details: data
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || 'Suggested users retrieved successfully',
      data: data.data
    });
  } catch (error) {
    console.error('Get suggested users error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
