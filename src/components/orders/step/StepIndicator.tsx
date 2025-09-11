import { CheckoutStep } from "@/components/checkouts/lib";


export // Komponen terpisah untuk progress bar agar lebih rapi
    const StepIndicator = ({ currentStep }: { currentStep: CheckoutStep }) => {
        const steps = ["checkout", "payment", "confirmation"];
        const stepIndex = steps.indexOf(currentStep);

        // Fungsi untuk menentukan kelas CSS lingkaran step
        const getStepClass = (index: number) => {
            if (currentStep === 'success') return 'bg-green-500 text-white'; // Semua hijau saat sukses
            if (index < stepIndex) return 'bg-green-500 text-white'; // Sudah lewat: hijau
            if (index === stepIndex) return 'bg-primary text-white scale-110 shadow-lg'; // Step saat ini: primary
            return 'bg-gray-200 text-gray-500'; // Belum sampai: abu-abu
        };

        // Fungsi untuk menentukan kelas CSS garis penghubung
        const getLineClass = (index: number) => {
            if (currentStep === 'success') return 'bg-green-500'; // Semua hijau saat sukses
            if (index < stepIndex) return 'bg-green-500'; // Sudah lewat: hijau
            return 'bg-gray-200'; // Belum sampai: abu-abu
        };

        // Fungsi untuk menentukan kelas CSS teks judul step
        const getTextClass = (index: number) => {
            if (currentStep === 'success') return 'text-gray-800'; // Semua solid saat sukses
            if (index === stepIndex) return 'text-primary'; // Step saat ini: primary
            if (index < stepIndex) return 'text-gray-800'; // Sudah lewat: solid
            return 'text-gray-500'; // Belum sampai: abu-abu
        }

        return (
            <div className="mb-8">
                <div className="flex items-center justify-center">
                    {/* Step 1 */}
                    <div className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-medium transition-all duration-300 ${getStepClass(0)}`}>
                            {currentStep === 'success' || stepIndex > 0 ? <i className="fas fa-check"></i> : <span>1</span>}
                        </div>
                        <div className="hidden sm:block ml-3 mr-8">
                            <p className={`text-sm font-medium transition-colors duration-300 ${getTextClass(0)}`}>Detail Pesanan</p>
                            <p className="text-xs text-gray-500">Alamat & Pengiriman</p>
                        </div>
                    </div>
                    <div className={`w-16 h-1 mx-4 transition-colors duration-300 ${getLineClass(0)}`}></div>

                    {/* Step 2 */}
                    <div className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-medium transition-all duration-300 ${getStepClass(1)}`}>
                            {currentStep === 'success' || stepIndex > 1 ? <i className="fas fa-check"></i> : <span>2</span>}
                        </div>
                        <div className="hidden sm:block ml-3 mr-8">
                            <p className={`text-sm font-medium transition-colors duration-300 ${getTextClass(1)}`}>Pembayaran</p>
                            <p className="text-xs text-gray-400">QRIS Payment</p>
                        </div>
                    </div>
                    <div className={`w-16 h-1 mx-4 transition-colors duration-300 ${getLineClass(1)}`}></div>

                    {/* Step 3 */}
                    <div className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-medium transition-all duration-300 ${getStepClass(2)}`}>
                            {currentStep === 'success' || stepIndex > 2 ? <i className="fas fa-check"></i> : <span>3</span>}
                        </div>
                        <div className="hidden sm:block ml-3">
                            {/* Teks berubah saat proses sukses */}
                            {currentStep === 'success' ? (
                                <>
                                    <p className={`text-sm font-medium transition-colors duration-300 ${getTextClass(2)}`}>Selesai</p>
                                    <p className="text-xs text-gray-500">Pesanan berhasil</p>
                                </>
                            ) : (
                                <>
                                    <p className={`text-sm font-medium transition-colors duration-300 ${getTextClass(2)}`}>Konfirmasi</p>
                                    <p className="text-xs text-gray-400">Upload Bukti</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };
