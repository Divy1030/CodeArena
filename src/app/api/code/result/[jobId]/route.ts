import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    // Await params before accessing properties
    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Get token from cookies or authorization header
    const token = request.cookies.get('accessToken')?.value || 
                 request.headers.get('Authorization')?.replace('Bearer ', '');

    // Poll result from backend
    const response = await fetch(endpoints.code.getResult(jobId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch result' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      message: data.message
    });
  } catch (error) {
    console.error('Error fetching result:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}