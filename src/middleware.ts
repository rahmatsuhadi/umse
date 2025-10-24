// middleware.ts
import { NextResponse } from "next/server";

export function middleware(req: Request) {
  // Generate nonce (Edge runtime-safe)
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  const nonce = Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const origin = new URL(req.url).origin;
  const reportEndpoint = `${origin}/api/csp-report`;

  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' https://cdn.ckeditor.com https://cdnjs.cloudflare.com`,
    `style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.ckeditor.com`,
    `img-src 'self' data: https:`,
    `font-src 'self' data: https://cdnjs.cloudflare.com`,
    `connect-src 'self' https:`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `report-uri ${reportEndpoint}`,
  ].join("; ");

  const res = NextResponse.next();

  // Sementara pakai Report-Only (tidak memblokir skrip tapi kirim laporan)
  // res.headers.set("Content-Security-Policy-Report-Only", csp);
  res.headers.set("Content-Security-Policy", csp);

  // Optional: kirim metadata ke browser
  res.headers.set(
    "Report-To",
    JSON.stringify({
      group: "csp-endpoint",
      max_age: 10886400,
      endpoints: [{ url: reportEndpoint }],
      include_subdomains: true,
    })
  );

  // Kirim nonce ke layout agar inline script aman
  res.headers.set("x-nonce", nonce);

  return res;
}

// Aktifkan middleware di semua route
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
