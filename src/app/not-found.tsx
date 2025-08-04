import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 p-4 text-center">
            <div className="flex flex-col items-center gap-4">
                <FileQuestion className="h-24 w-24 text-pink-300" strokeWidth={1} />
                <h1 className="text-6xl font-bold text-pink-600">404</h1>
                <h2 className="text-2xl font-semibold text-slate-800">Halaman Tidak Ditemukan</h2>
                <p className="max-w-md text-slate-600">
                    Maaf, kami tidak dapat menemukan halaman yang Anda cari. Mungkin halaman tersebut telah dihapus atau URL-nya salah.
                </p>
                <div className="mt-4">
                    <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-700">
                        <Link href="/">Kembali ke Beranda</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}