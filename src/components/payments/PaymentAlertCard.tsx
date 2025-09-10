export function RejectedCardPayment({reason}:{reason:string}) {
    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
                <i className="fas fa-exclamation-triangle text-red-500 mr-3 mt-1"></i>
                <div>
                    <h4 className="font-medium text-red-800 mb-2">
                        Bukti Pembayaran Sebelumnya Ditolak
                    </h4>
                    <p className="text-red-700 text-sm" id="rejectionReason">
                        {reason || `
                        Bukti pembayaran tidak jelas. Nominal yang tertera tidak sesuai
                        dengan total pesanan. Mohon upload ulang bukti pembayaran yang
                        lebih jelas.`}
                    </p>
                </div>
            </div>
        </div>
    )
}


export function ComparationCardPayment() {
    return (
        <div
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
        >
            <h4 className="font-medium text-yellow-800 mb-2">
                <i className="fas fa-lightbulb mr-2"></i>Tips untuk Upload yang
                Berhasil
            </h4>
            <p className="text-yellow-700 text-sm">
                Pastikan bukti pembayaran baru Anda mengatasi masalah yang
                disebutkan dalam alasan penolakan di atas. Periksa kembali
                kejelasan foto, nominal, dan informasi lainnya sebelum
                mengirim.
            </p>
        </div>
    )
}

export function PaymentGuideLinePayment() {
    return (
        <div
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
        >
            <h4 className="font-medium text-blue-800 mb-2">
                <i className="fas fa-info-circle mr-2"></i>Panduan Upload Bukti
                Pembayaran
            </h4>
            <ul className="text-blue-700 text-sm space-y-1">
                <li>• Pastikan foto/screenshot jelas dan tidak buram</li>
                <li>
                    • Nominal pembayaran harus sesuai dengan total pesanan (Rp
                    45.000)
                </li>
                <li>• Tanggal dan waktu transaksi harus terlihat</li>
                <li>• Nama penerima/merchant harus sesuai</li>
                <li>• Format file: JPG, PNG, atau PDF (maksimal 5MB)</li>
            </ul>
        </div>
    )
}