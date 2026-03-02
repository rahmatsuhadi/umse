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

export async function GET() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = resolveGoogleRedirectUri();

    if (!clientId || !redirectUri) {
        console.error("Missing Google Auth Environment Variables");
        return NextResponse.json(
            { message: "Server misconfiguration. Missing Google Auth env." },
            { status: 500 }
        );
    }

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

    // Build standard Google OAuth 2.0 query parameters
    authUrl.searchParams.append("client_id", clientId);
    authUrl.searchParams.append("redirect_uri", redirectUri);
    authUrl.searchParams.append("response_type", "code");
    // Required scopes for authentication
    authUrl.searchParams.append("scope", "openid email profile");
    authUrl.searchParams.append("access_type", "offline");
    authUrl.searchParams.append("prompt", "consent");

    // Redirect users to Google's consent screen
    return NextResponse.redirect(authUrl.toString());
}
