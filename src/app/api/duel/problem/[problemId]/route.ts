import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.code-arena.tech';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ problemId: string }> }
) {
  try {
    const { problemId } = await params;

    if (!problemId) {
      return NextResponse.json(
        { success: false, message: 'problemId is required' },
        { status: 400 }
      );
    }

    // Get token from cookies or authorization header
    const token = request.cookies.get('accessToken')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Try multiple possible backend endpoints for fetching problem
    const endpoints = [
      `${API_BASE_URL}/api/v1/problems/${problemId}`,
      `${API_BASE_URL}/api/v1/problem/${problemId}`,
      `${API_BASE_URL}/api/v1/duel/problem/${problemId}`,
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          cache: "no-store",
        });

        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            return NextResponse.json(data);
          }
        }
      } catch {
        // Try next endpoint
        continue;
      }
    }

    // If no endpoint worked, return a helpful error
    return NextResponse.json(
      { 
        success: false, 
        message: 'Problem endpoint not available. The backend needs to expose a /api/v1/problems/:problemId endpoint for duel problems.',
        problemId,
      },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching duel problem:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
