

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";



export const metadata: Metadata = {
    title: "Sleman Mart",
    description: "Markeplace UMKM",
};

export default function ProductLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div>

           <div className="">
             <header className="bg-white shadow-md md:px-10 sticky top-0">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex-shrink-0">
                            <Link href="/" className="text-2xl font-bold text-primary" >
                                <Image alt="logo-sleman-mart" src={"/slemanmartlogo.png"} height={80} width={80} />
                                {/* Sleman<span className="text-sm font-semibold">Store</span> */}
                            </Link>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <Link href="/" className="text-primary hover:text-primary-dark text-sm sm:text-base flex items-center">
                                <i className="fas fa-arrow-left mr-1"></i>
                                <span className="hidden sm:inline">Kembali ke Produk</span>
                                <span className="sm:hidden">Kembali</span>
                            </Link>
                            <Link href="/" className="text-primary hover:text-primary-dark text-sm sm:text-base flex items-center">
                                <i className="fas fa-home mr-1"></i>
                                <span className="hidden sm:inline">Beranda</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>


            {/* ===== Breadcrumb ===== */}
           </div>
            {children}
        </div>

    );
}
