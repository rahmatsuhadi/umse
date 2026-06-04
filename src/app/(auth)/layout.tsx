import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("slm-token");

  if (token?.value) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}

export const metadata: Metadata = {
  title: "Sleman Mart",
  description: "Markeplace UMKM",
};
