import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function GET(request: NextRequest) {
  try {
    // Call backend API
    const response = await fetch(endpoints.contest.getAllContests, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${request.cookies.get('accessToken')?.value || ''}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to fetch contests',
          details: data
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contests fetched successfully',
      data: data.data
    });
  } catch (error) {
    console.error('Error fetching contests:', error);
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