import { apiClient } from "@/lib/api-client";
import { User } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { phone_number, password, captchaToken } = await req.json();

  if (!phone_number || !password) {
    return NextResponse.json(
      { message: "Phone Number dan password diperlukan." },
      { status: 400 }
    );
  }

  if (!captchaToken) {
    return NextResponse.json(
      { message: "Captcha token diperlukan" },
      { status: 400 }
    );
  }

  const verifyRes = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY!,
        response: captchaToken,
      }),
    }
  );

  const verifyData = await verifyRes.json();
  if (!verifyData.success) {
    return NextResponse.json(
      {
        message: "Captcha Tidak valid",
      },
      { status: 400 }
    );
  }

  try {
    const backendRes = await apiClient<{ data: { user: User; token: string } }>(
      `/auth/login`,
      {
        method: "POST",
        body: JSON.stringify({ phone_number, password }),
      }
    );
    return NextResponse.json(backendRes, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message || "Pastikan kredensial Anda benar" },
        { status: 400 }
      );
    }
  }
}
