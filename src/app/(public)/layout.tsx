

import type { Metadata } from "next";


export const metadata: Metadata = {
    title: {
        default: "Slemanmart - Platform Digital UMKM Sleman",
        template: '%s | Slemanmart'
    },
    description: "Temukan produk dan layanan terbaik dari UMKM di Kabupaten Sleman melalui platform digital DISKOPUKM",
    keywords: ['UMKM Sleman', 'Slemanmart', 'Marketplace Sleman', 'Produk Lokal Sleman'],
};

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>
    );
}
