"use client"

import { useRouter } from "next/navigation"
import { Button } from "../ui/button"

export default function ButtonGoBack() {
    const router = useRouter()
    return (
        <Button onClick={() => router.back()} size="lg" className="bg-primary hover:bg-primary/50">
            {/* <Link href="/"> */}
            Kembali ke Beranda
            {/* </Link> */}
        </Button>
    )
}