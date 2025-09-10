import Link from "next/link";

export default function CheckoutEmpty() {
    return (
        <div className="py-10 px-6 flex items-center justify-center">
            <div className="max-w-md border p-6 rounded-lg shadow-sm text-center">
                <h2 className="text-lg font-semibold mb-2">Tidak Ada Item Checkout</h2>
                <p className="text-sm mb-4">
                    Kami tidak menemukan data keranjang untuk dilanjutkan ke checkout.
                    Silakan kembali ke halaman cart dan pilih terlebih dahulu.
                </p>
                <Link
                    href="/keranjang"
                    className="inline-block bg-primary hover:bg-primary/70 text-white text-sm font-semibold py-2 px-4 rounded transition"
                >
                    Kembali ke Keranjang
                </Link>
            </div>
        </div>
    )
}