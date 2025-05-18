import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Use the endpoint from api.ts
    const response = await fetch(endpoints.auth.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password
      }),
    });

    const data = await response.json();
    console.log('Backend login response:', data);

    // Extract cookies from the response
    const cookieHeader = response.headers.get('set-cookie');
    
    if (cookieHeader) {
      console.log('Cookies received from backend:', cookieHeader);
      
      // Extract tokens from cookies
      const accessTokenMatch = cookieHeader.match(/accessToken=([^;]+)/);
      const refreshTokenMatch = cookieHeader.match(/refreshToken=([^;]+)/);
      
      const accessToken = accessTokenMatch ? accessTokenMatch[1] : null;
      const refreshToken = refreshTokenMatch ? refreshTokenMatch[1] : null;
      
      if (accessToken && refreshToken) {
        console.log('Extracted tokens from cookies');
        
        // Add tokens to the response data
        if (!data.data) data.data = {};
        data.data.accessToken = accessToken;
        data.data.refreshToken = refreshToken;
      }
    }

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Login failed" },
        { status: response.status }
      );
    }

    // Create a response object
    const nextResponse = NextResponse.json({
      success: data.success,
      message: data.message,
      data: data.data
    });

    // Forward the cookies from the backend to the client
    if (cookieHeader) {
      // Parse and set individual cookies
      cookieHeader.split(',').forEach(cookie => {
        const [cookiePart] = cookie.split(';');
        if (cookiePart) {
          const [name, value] = cookiePart.split('=');
          if (name && value) {
            // Add each cookie to the response
            nextResponse.cookies.set(name.trim(), value.trim());
          }
        }
      });
    }

    return nextResponse;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}