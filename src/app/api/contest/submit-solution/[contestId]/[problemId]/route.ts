import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { contestId: string; problemId: string } }) {
  try {
    const { contestId, problemId } = params;
    const body = await req.json();

    // Forward cookies for authentication
    const cookie = req.headers.get("cookie") || "";

    // Call your backend endpoint (adjust URL as needed)
    const backendRes = await fetch(`${process.env.BACKEND_URL}/api/contest/submitSolution/${contestId}/${problemId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie,
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = await backendRes.json();

    return NextResponse.json(data, { status: backendRes.status });
  } catch (err) {
    console.error('Submit solution error:', err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}