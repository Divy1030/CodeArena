import { NextRequest, NextResponse } from 'next/server';
import endpoints from '@/libs/api';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required field
        if (!body.idToken) {
            return NextResponse.json(
                { success: false, message: 'Google ID token is required' },
                { status: 400 }
            );
        }

        // Send the ID token to your backend
        const response = await fetch(endpoints.auth.googleLogin, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken: body.idToken }),
            credentials: 'include', // Ensure cookies are included in the request
        });

        let data;
        const contentType = response.headers.get('Content-Type') || '';
        if (contentType.includes('application/json')) {
            data = await response.json();
        } else {
            console.error('Unexpected response content type:', contentType);
            throw new Error('Invalid response format from backend');
        }
        console.log('Backend Google login response:', data);

        const cookieHeader = response.headers.get('set-cookie');

        if (cookieHeader) {
            console.log('Cookies received from backend:', cookieHeader);

            const accessTokenMatch = cookieHeader.match(/accessToken=([^;]+)/);
            const refreshTokenMatch = cookieHeader.match(/refreshToken=([^;]+)/);

            const accessToken = accessTokenMatch?.[1] ?? null;
            const refreshToken = refreshTokenMatch?.[1] ?? null;

            if (accessToken && refreshToken) {
                if (!data.data) data.data = {};
                data.data.accessToken = accessToken;
                data.data.refreshToken = refreshToken;
            }
        }

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: data.message || 'Google login failed' },
                { status: response.status }
            );
        }

        const nextResponse = NextResponse.json({
            success: data.success,
            message: data.message,
            data: data.data,
        });

        // Forward cookies from backend to client
        if (cookieHeader) {
            cookieHeader.split(',').forEach(cookie => {
                const [cookiePart] = cookie.split(';');
                if (cookiePart) {
                    const [name, value] = cookiePart.split('=');
                    nextResponse.cookies.set(name.trim(), value.trim(), {
                        path: '/', // Ensure the cookie is accessible across the app
                        httpOnly: true, // Secure the cookie
                    });
                    nextResponse.cookies.set(name.trim(), value.trim());
                }
            });
        }

        return nextResponse;
    } catch (error) {
        console.error('Google Login error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}