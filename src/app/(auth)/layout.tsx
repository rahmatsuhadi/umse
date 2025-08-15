import { Navbar } from "@/components/shared/Navbar";
import { Metadata } from "next";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="bg-[#f8f9fa] min-h-screen">
            <Navbar/>
            {children}
        </div>
    );
}

export const metadata: Metadata = {
    title: "Sleman Mart",
    description: "Markeplace UMKM",
};