import Link from "next/link";

export default function CartHeader() {
    return (
        <header className="bg-white shadow-md sticky top-0">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-800">Keranjang Belanja</h1>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <Link href="/" className="text-primary hover:text-primary-dark text-sm sm:text-base">
                            <i className="fas fa-arrow-left mr-1"></i>
                            <span className="hidden sm:inline">Kembali Belanja</span>
                            <span className="sm:hidden">Belanja</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>

    )
}