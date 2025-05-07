import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function POST(
  request: NextRequest,
  { params }: { params: { contestId: string } }
) {
  try {
    const contestId = params.contestId;
    
    if (!contestId) {
      return NextResponse.json(
        { success: false, message: 'Contest ID is required' },
        { status: 400 }
      );
    }

    // Call backend API
    const response = await fetch(`${endpoints.contest.joinContest}/${contestId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${request.cookies.get('accessToken')?.value || ''}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to join contest',
          details: data
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the contest',
      data: data.data
    });
  } catch (error) {
    console.error('Error joining contest:', error);
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