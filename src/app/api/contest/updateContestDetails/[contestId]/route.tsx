import { NextRequest, NextResponse } from "next/server";

// Adjust this import to your backend API base URL
const BACKEND_API_BASE = process.env.BACKEND_API_BASE || "http://localhost:5000";

export async function POST(req: NextRequest, { params }: { params: { contestId: string } }) {
  try {
    const body = await req.json();
    const contestId = params.contestId;

    // Forward the request to your backend controller
    const backendRes = await fetch(`${BACKEND_API_BASE}/api/contest/updateContestDetails/${contestId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward cookies or auth headers if needed
        // "Authorization": req.headers.get("authorization") || "",
        // "Cookie": req.headers.get("cookie") || "",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}