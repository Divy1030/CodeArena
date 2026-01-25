// client/src/app/api/contest/leaderboard/[contestId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contestId: string }> }
) {
  try {
    const { contestId } = await params;

    if (!contestId) {
      return NextResponse.json(
        { success: false, message: 'Contest ID is required' },
        { status: 400 }
      );
    }

    const token = request.cookies.get('accessToken')?.value || 
                 request.headers.get('Authorization')?.replace('Bearer ', '');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/problem/get-leaderboard/${contestId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch leaderboard' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      message: data.message
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}