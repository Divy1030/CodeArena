import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate basic required fields
    if (!body.title || !body.startTime || !body.endTime || !body.duration) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields' 
        },
        { status: 400 }
      );
    }

    // Call backend API
    const response = await fetch(endpoints.contest.createContest, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${request.cookies.get('accessToken')?.value || ''}`
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to create contest',
          details: data
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contest created successfully',
      data: data.data
    });
  } catch (error) {
    console.error('Error creating contest:', error);
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