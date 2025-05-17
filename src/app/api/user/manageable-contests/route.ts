import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function GET(request: NextRequest) {
  try {
    // Extract token from cookies or authorization header ONLY - remove localStorage reference
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                 request.cookies.get('accessToken')?.value ||
                 request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if the endpoint is defined
    if (!endpoints.user?.getManageableContests) {
      console.error("API endpoint not defined:", "endpoints.user.getManageableContests");
      return NextResponse.json(
        { success: false, message: "API configuration error" },
        { status: 500 }
      );
    }

    // Make the API call with proper error handling
    console.log("Calling API:", endpoints.user.getManageableContests);
    const response = await fetch(endpoints.user.getManageableContests, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    // Check content type first
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error("Non-JSON response received:", textResponse);
      
      return NextResponse.json(
        { 
          success: false, 
          message: "Server returned an invalid response format",
          details: textResponse.substring(0, 200) // Show first 200 chars for debugging
        },
        { status: 500 }
      );
    }

    // Now we know it's JSON, we can parse it
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || "Failed to fetch manageable contests",
          details: data
        },
        { status: response.status }
      );
    }

    // Return data with the expected contests format
    return NextResponse.json({
      success: true,
      message: 'Manageable contests fetched successfully',
      contests: data.data, // Make sure this matches what ManageableContests.tsx expects
    });
  } catch (error) {
    console.error('Error fetching manageable contests:', error);
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