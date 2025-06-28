import { NextRequest, NextResponse } from "next/server";
import endpoints from "@/libs/api";
import "server-only";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ contestId: string }> }
) {
  try {
    // Wait for params since it's now a Promise
    const { contestId } = await params;

    if (!contestId) {
      return NextResponse.json(
        { success: false, message: "Contest ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Get token from cookies or authorization header
    const token =
      request.cookies.get("accessToken")?.value ||
      request.headers.get("Authorization")?.replace("Bearer ", "") ||
      request.headers.get("x-access-token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No token found in request" },
        { status: 401 }
      );
    }

    console.log("Adding moderator to contest:", contestId);

    // Forward the request to your backend controller endpoint
    const response = await fetch(
      `${endpoints.contest.addModerators}/${contestId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error("Non-JSON response received:", textResponse);
      return NextResponse.json(
        {
          success: false,
          message: "Server returned an invalid response format",
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("Add moderator response:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to add moderator",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Moderator added successfully",
      data: data.data,
    });
  } catch (error) {
    console.error("Add moderator error details:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}