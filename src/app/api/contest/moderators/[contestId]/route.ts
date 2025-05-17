import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { contestId: string } }
) {
  try {
    const contestId = params.contestId;
    
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

    // Call backend API to get moderators
    const response = await fetch(`${endpoints.contest.moderators}/${contestId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch moderators" },
        { status: response.status }
      );
    }

    // Process profile pictures - ensure they have valid URLs
    const moderators = data.data.moderators.map((mod: any) => ({
      id: mod.id,
      username: mod.username,
      profilePicture: mod.profilePicture || null,
      role: mod.role
    }));

    return NextResponse.json({
      success: true,
      moderators
    });
  } catch (error) {
    console.error('Get moderators error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}