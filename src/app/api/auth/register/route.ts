import { apiClient } from "@/lib/api-client";
import { User } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const captchaToken = formData.get("captchaToken") as string | null;

    if (!captchaToken) {
      return NextResponse.json(
        { message: "Captcha token diperlukan" },
        { status: 400 }
      );
    }

    try {
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
            message: "Verifikasi reCAPTCHA tidak valid. Silakan coba lagi.",
          },
          { status: 400 }
        );
      }
    } catch (captchaErr) {
      console.error("[register:recaptchaError]", captchaErr);
      return NextResponse.json(
        { message: "Gagal memverifikasi reCAPTCHA. Pastikan koneksi internet aktif." },
        { status: 400 }
      );
    }

    formData.delete("captchaToken");
    const backendRes = await apiClient<{ data?: { user: User; token: string }; message?: string }>(
      `/auth/register`,
      {
        method: "POST",
        body: formData,
      }
    );
    return NextResponse.json(backendRes, { status: 200 });
  } catch (error) {
    console.error("[register:routeError]", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message || "Pastikan kredensial Anda benar" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Terjadi kesalahan internal pada server saat pendaftaran" },
      { status: 500 }
    );
  }
}
