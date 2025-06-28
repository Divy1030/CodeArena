import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';
import "server-only";

// Define interface for moderator data
interface Moderator {
  id: string;
  username: string;
  profilePicture?: string | null;
  role: string;
}

// Define interface for backend response data
interface BackendResponseData {
  moderators: Moderator[];
}

interface BackendResponse {
  data: BackendResponseData;
  message?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contestId: string }> }
) {
  try {
    // Wait for params since it's now a Promise
    const { contestId } = await params;
    
    if (!contestId) {
      return NextResponse.json(
        { success: false, message: 'Contest ID is required' },
        { status: 400 }
      );
    }
    
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

    console.log('Fetching moderators for contest:', contestId);

    // Call backend API to get moderators
    const response = await fetch(`${endpoints.contest.moderators}/${contestId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    // Check if the response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      // Handle non-JSON response
      const textResponse = await response.text();
      console.error("Non-JSON response received:", textResponse);
      return NextResponse.json(
        { 
          success: false, 
          message: "Server returned an invalid response format" 
        },
        { status: 500 }
      );
    }

    const data: BackendResponse = await response.json();
    console.log("Get moderators response:", data);

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || "Failed to fetch moderators",
          details: data
        },
        { status: response.status }
      );
    }

    // Process profile pictures - ensure they have valid URLs
    const moderators = data.data.moderators.map((mod: Moderator) => ({
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
    console.error('Get moderators error details:', error);
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