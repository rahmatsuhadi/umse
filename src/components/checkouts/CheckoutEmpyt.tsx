import Link from "next/link";

export default function CheckoutEmpty() {
  return (
    <div className="py-16 px-4 flex items-center justify-center min-h-[50vh]">
      <div className="max-w-md w-full bg-white border border-gray-100 p-8 md:p-10 rounded-3xl shadow-sm text-center">
        <div className="w-20 h-20 bg-orange-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-orange-50/40">
          <i className="fas fa-shopping-basket text-3xl"></i>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Tidak Ada Item Checkout</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-xs mx-auto">
          Kami tidak menemukan data keranjang untuk dilanjutkan ke checkout.
          Silakan kembali ke halaman keranjang dan pilih item belanja Anda terlebih dahulu.
        </p>
        <Link
          href="/keranjang"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-sm font-bold py-3.5 px-6 rounded-xl hover:shadow-lg hover:shadow-orange-500/10 active:scale-[0.98] transition-all duration-200 w-full"
        >
          <i className="fas fa-arrow-left text-xs"></i>
          <span>Kembali ke Keranjang</span>
        </Link>
      </div>
    </div>
  );
}