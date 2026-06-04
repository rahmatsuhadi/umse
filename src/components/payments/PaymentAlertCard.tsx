import { AlertTriangle, Lightbulb, Info } from "lucide-react";

export function RejectedCardPayment({ reason }: { reason: string }) {
    return (
        <div className="bg-[#FFF5F5] border border-red-200 rounded-[20px] p-5 mb-4 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                    <h4 className="font-bold text-red-900 mb-1">
                        Bukti Pembayaran Sebelumnya Ditolak
                    </h4>
                    <p className="text-red-800 text-sm leading-relaxed" id="rejectionReason">
                        {reason ||
                            "Bukti pembayaran tidak jelas. Nominal yang tertera tidak sesuai dengan total pesanan. Mohon upload ulang bukti pembayaran yang lebih jelas."}
                    </p>
                </div>
            </div>
        </div>
    );
}

export function ComparationCardPayment() {
    return (
        <div className="bg-[var(--cream)] border border-[var(--saffron)]/30 rounded-[20px] p-5 mb-4 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-[var(--saffron)]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-4 h-4 text-[var(--saffron)]" />
                </div>
                <div>
                    <h4 className="font-bold text-[var(--text-primary)] mb-1">
                        Tips untuk Upload yang Berhasil
                    </h4>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                        Pastikan bukti pembayaran baru Anda mengatasi masalah yang
                        disebutkan dalam alasan penolakan di atas. Periksa kembali
                        kejelasan foto, nominal, dan informasi lainnya sebelum mengirim.
                    </p>
                </div>
            </div>
        </div>
    );
}

export function PaymentGuideLinePayment() {
    const guidelines = [
        "Pastikan foto/screenshot jelas dan tidak buram",
        "Nominal pembayaran harus sesuai dengan total pesanan",
        "Tanggal dan waktu transaksi harus terlihat",
        "Nama penerima/merchant harus sesuai",
        "Format file: JPG, PNG (maksimal 5MB)",
    ];

    return (
        <div className="bg-[var(--cream)] border border-[var(--cream-dark)] rounded-[20px] p-5 mb-4 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-white border border-[var(--cream-dark)] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Info className="w-4 h-4 text-[var(--terracotta)]" />
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-[var(--text-primary)] mb-2">
                        Panduan Upload Bukti Pembayaran
                    </h4>
                    <ul className="space-y-1.5">
                        {guidelines.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-[var(--text-secondary)] text-sm font-medium">
                                <span className="text-[var(--terracotta)] mt-0.5">•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}