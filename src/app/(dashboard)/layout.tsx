import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
    title: "Dashboard - Sleman Mart",
    description: "Markeplace UMKM",
};

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const cookieStore = cookies();
    const headersList = await headers();
    const token = (await cookieStore).get("slm-token"); 
    
    // Redirect jika tidak ada token
    if (!token) {

        const redirectUrl = `/masuk`;
        redirect(redirectUrl); // arahkan ke halaman login
    }

    return (
        <>
            {children}
        </>
    );
}
