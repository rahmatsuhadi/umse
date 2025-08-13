
import { NavbarDashboard } from "@/components/shared/HeaderNav";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "Dashboard - Sleman Mart",
    description: "Markeplace UMKM",
};

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <NavbarDashboard/>
            {children}
        </>
    );
}
