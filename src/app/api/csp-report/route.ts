import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    console.log("CSP report received:", JSON.stringify(body, null, 2));

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("Error parsing CSP report:", err);
    return new NextResponse(null, { status: 400 });
  }
}
