import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard - Sleman Mart",
  description: "Markeplace UMKM",
};

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("slm-token");

  // Redirect jika tidak ada token
  if (!token?.value) {
    const redirectUrl = `/masuk`;
    redirect(redirectUrl); // arahkan ke halaman login
  }

  return <>{children}</>;
}
