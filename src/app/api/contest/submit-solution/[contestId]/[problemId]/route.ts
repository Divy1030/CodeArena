import { NextRequest, NextResponse } from "next/server";
import "server-only";

export async function POST(
  req: NextRequest, 
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

    const body = await req.json();

    // Get token from cookies or authorization header
    const token = req.cookies.get('accessToken')?.value ||
                 req.headers.get('Authorization')?.replace('Bearer ', '') ||
                 req.headers.get('x-access-token');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token found in request' },
        { status: 401 }
      );
    }

    console.log('Submitting solution for contest:', contestId, 'problem:', problemId);

    // Call your backend endpoint
    const backendRes = await fetch(
      `${process.env.BACKEND_URL}/api/contest/submitSolution/${contestId}/${problemId}`, 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    // Check if the response is JSON
    const contentType = backendRes.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await backendRes.text();
      console.error("Non-JSON response received:", textResponse);
      return NextResponse.json(
        { 
          success: false, 
          message: "Server returned an invalid response format" 
        },
        { status: 500 }
      );
    }

    const data = await backendRes.json();
    console.log("Submit solution response:", data);

    if (!backendRes.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || 'Failed to submit solution',
          details: data
        },
        { status: backendRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || 'Solution submitted successfully',
      data: data.data
    });
  } catch (error) {
    console.error('Submit solution error details:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}