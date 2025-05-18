// import { NextRequest, NextResponse } from 'next/server';
// import endpoints from '@/libs/api';
// import "server-only";

// export async function GET(request: NextRequest) {
//   try {
//     // Extract query params
//     const { searchParams } = new URL(request.url);
//     const contestId = searchParams.get('contestId');
//     const problemId = searchParams.get('problemId');

//     if (!contestId || !problemId) {
//       return NextResponse.json(
//         { success: false, message: 'contestId and problemId are required' },
//         { status: 400 }
//       );
//     }

//     // Get token from cookies or authorization header
//     const token = request.cookies.get('accessToken')?.value ||
//                   request.headers.get('authorization')?.replace('Bearer ', '');

//     if (!token) {
//       return NextResponse.json(
//         { success: false, message: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     // Build backend URL with query params
//     const backendUrl = `${endpoints.problem.getProblemById}?contestId=${contestId}&problemId=${problemId}`;

//     // Proxy the request to the backend
//     const response = await fetch(backendUrl, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       cache: "no-store",
//     });

//     const contentType = response.headers.get("content-type");
//     if (!contentType || !contentType.includes("application/json")) {
//       const textResponse = await response.text();
//       console.error("Non-JSON response received:", textResponse);
//       return NextResponse.json(
//         { success: false, message: "Server returned an invalid response format" },
//         { status: 500 }
//       );
//     }

//     const data = await response.json();

//     return NextResponse.json(data, { status: response.status });
//   } catch (error) {
//     console.error('Error fetching problem:', error);
//     return NextResponse.json(
//       { success: false, message: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';
import "server-only";

export async function GET(
  request: NextRequest,
  { params }: { params: { contestId: string; problemId: string } }
) {
  try {
    const { contestId, problemId } = params;

    if (!contestId || !problemId) {
      return NextResponse.json(
        { success: false, message: 'contestId and problemId are required' },
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

    // Build backend URL with path params
    const backendUrl = `${endpoints.problem.getProblemById}/${contestId}/${problemId}`;

    // Proxy the request to the backend
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching problem:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}