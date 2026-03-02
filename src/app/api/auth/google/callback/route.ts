import { NextResponse } from "next/server";

function resolveGoogleRedirectUri() {
    const raw = process.env.GOOGLE_REDIRECT_URI;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!raw) return null;
    if (raw.includes("${APP_URL}")) {
        return raw.replace("${APP_URL}", appUrl);
    }
    if (raw.startsWith("/")) {
        return `${appUrl}${raw}`;
    }
    return raw;
}

export async function POST(req: Request) {
    try {
        const { code } = await req.json();

        if (!code) {
            return NextResponse.json({ message: "Code parameter is missing" }, { status: 400 });
        }

        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = resolveGoogleRedirectUri();
        const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000/api";

        if (!clientId || !clientSecret || !redirectUri) {
            console.error("Missing Google API credentials.");
            return NextResponse.json(
                { message: "Server configuration error" },
                { status: 500 }
            );
        }

        // 1. Exchange authorization code for access token
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            }).toString(),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error("Google Token Exchange Error:", tokenData);
            return NextResponse.json(
                { message: "Failed to exchange authorization code with Google", error: tokenData },
                { status: tokenResponse.status }
            );
        }

        const accessToken = tokenData.access_token;

        // 2. Send the access token to the Laravel Backend
        const backendResponse = await fetch(`${backendApiUrl}/auth/google`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                access_token: accessToken,
            }),
        });

        const backendData = await backendResponse.json();

        if (!backendResponse.ok) {
            console.error("Backend Authentication Error:", backendData);
            return NextResponse.json(
                { message: backendData.message || "Backend authentication failed", error: backendData.error },
                { status: backendResponse.status }
            );
        }

        // 3. Return the application token and user data to the client callback explicitly
        return NextResponse.json({
            token: backendData.data.token,
            user: backendData.data.user,
            message: backendData.message
        });

    } catch (error: unknown) {
        console.error("Google Auth Callback Error:", error);
        return NextResponse.json(
            { message: "An unexpected error occurred during Google authentication." },
            { status: 500 }
        );
    }
}
