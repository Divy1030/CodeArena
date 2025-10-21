import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

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

    // Handle different error responses
    if (!response.ok) {
      switch (response.status) {
        case 400:
          return NextResponse.json(
            { success: false, message: data.message || 'Both email and password are required' },
            { status: 400 }
          );
        case 401:
          return NextResponse.json(
            { success: false, message: data.message || 'Incorrect password. Please try again.' },
            { status: 401 }
          );
        case 404:
          return NextResponse.json(
            { success: false, message: data.message || 'No user found with this email' },
            { status: 404 }
          );
        case 500:
          return NextResponse.json(
            { success: false, message: data.message || 'An error occurred during login. Please try again.' },
            { status: 500 }
          );
        default:
          return NextResponse.json(
            { success: false, message: data.message || 'Login failed' },
            { status: response.status }
          );
      }
    }

    // Create a response object
    const nextResponse = NextResponse.json({
      success: data.success || true,
      message: data.message || 'User logged in successfully',
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
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { success: false, message: 'Unable to connect to the server. Please try again.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}