import { NextRequest, NextResponse } from "next/server";
import endpoints from "@/libs/api";
import "server-only";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ contestId: string; problemId: string }> }
) {
  try {
    // Wait for params since it's now a Promise
    const { contestId, problemId } = await params;
    
    if (!contestId || !problemId) {
      return NextResponse.json(
        { success: false, message: 'Contest ID and Problem ID are required' },
        { status: 400 }
      );
    }

    // Get token from cookies or authorization header
    const token = request.cookies.get('accessToken')?.value || 
                  request.cookies.get('token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Make the API call
    const response = await fetch(`${endpoints.contest.deleteProblem}/${contestId}/${problemId}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to delete problem',
          details: data
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Problem deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting problem:', error);
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