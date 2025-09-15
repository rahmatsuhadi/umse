import ButtonGoBack from '@/components/shared/ButtonGoBack'
import { FileQuestion } from 'lucide-react'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "404 - Halaman Tidak Ditemukan | Sleman Mart",
    description: "Maaf, halaman yang Anda cari tidak ditemukan. Silakan periksa kembali URL atau kembali ke beranda Sleman Mart.",
    robots: {
        index: false, // Jangan indeks halaman 404
        follow: false,
    },
    openGraph: {
        title: "404 - Halaman Tidak Ditemukan | Sleman Mart",
        description: "Maaf, halaman yang Anda cari tidak ditemukan di Sleman Mart.",
        url: `${process.env.APP_URL}/404`,
        siteName: "Sleman Mart",
        images: [
            {
                url: `${process.env.APP_URL}/slemanmartlogo.png`,
                width: 800,
                height: 600,
                alt: "Sleman Mart Logo",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary",
        title: "404 - Halaman Tidak Ditemukan | Sleman Mart",
        description: "Halaman yang Anda cari tidak ditemukan. Kembali ke beranda Sleman Mart.",
        images: [`${process.env.APP_URL}/slemanmartlogo.png`],
    },
};

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 text-center">
            <div className="flex flex-col items-center gap-4">
                <FileQuestion className="h-24 w-24 text-primary" strokeWidth={1} />
                <h1 className="text-6xl font-bold text-primary">404</h1>
                <h2 className="text-2xl font-semibold text-slate-800">Halaman Tidak Ditemukan</h2>
                <p className="max-w-md text-slate-600">
                    Maaf, kami tidak dapat menemukan halaman yang Anda cari. Mungkin halaman tersebut telah dihapus atau URL-nya salah.
                </p>
                <div className="mt-4">
                    <ButtonGoBack />
                </div>
            </div>
        </div>
    )
}