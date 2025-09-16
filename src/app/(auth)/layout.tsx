import { Navbar } from "@/components/shared/Navbar";
import { TOKEN_COOKIE_NAME } from "@/lib/token-service";
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
        redirect('/');
    }

    return (
        <div className="bg-[#f8f9fa] min-h-screen">
            <Navbar />
            {children}
        </div>
    );
}

export const metadata: Metadata = {
    title: "Sleman Mart",
    description: "Markeplace UMKM",
};