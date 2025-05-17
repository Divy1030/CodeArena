import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function PUT(
  request: NextRequest,
  { params }: { params: { contestId: string, moderatorId: string } }
) {
  try {
    const { contestId, moderatorId } = params;
    const body = await request.json();
    
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

    // Call backend API to edit moderator
    // Note that in your contest.routes.ts, the PUT route is defined with just contestId
    // but we're adding moderatorId to the URL here to match your controller function
    const response = await fetch(`${endpoints.contest.editModerator}/${contestId}/${moderatorId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to update moderator" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || "Moderator updated successfully"
    });
  } catch (error) {
    console.error('Edit moderator error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}