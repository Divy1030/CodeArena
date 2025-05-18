import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function POST(
  request: NextRequest
) {
  try {
    // Get token from cookies or authorization header
    const token = request.cookies.get('accessToken')?.value ||
                 request.headers.get('Authorization')?.replace('Bearer ', '') ||
                 request.headers.get('x-access-token');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token found in request' },
        { status: 401 }
      );
    }

    // Get the form data from the request
    const formData = await request.formData();
    
    // Forward the request to the backend
    const response = await fetch(endpoints.user.uploadProfilePicture, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to upload profile picture',
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      profilePicture: data.data.profilePicture
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}