"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
    const router = useRouter()
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
                    <Button onClick={() => router.back()} size="lg" className="bg-primary hover:bg-primary/50">
                        {/* <Link href="/"> */}
                        Kembali ke Beranda
                        {/* </Link> */}
                    </Button>
                </div>
            </div>
        </div>
    )
}