import { CheckoutStep } from "@/components/checkouts/lib";

export const StepIndicator = ({ currentStep }: { currentStep: CheckoutStep | "cart" }) => {
    const steps = ["cart", "checkout", "payment", "confirmation"];
    const stepIndex = steps.indexOf(currentStep as string);

    // Fungsi untuk menentukan style lingkaran step
    const getStepStyle = (index: number): React.CSSProperties => {
        if (currentStep === 'success') {
            return {
                background: "#10B981",
                color: "white",
                boxShadow: "0 0 0 4px rgba(16,185,129,0.15), 0 4px 10px rgba(16,185,129,0.2)",
                border: "none",
            };
        }
        if (index < stepIndex) {
            return {
                background: "#10B981",
                color: "white",
                boxShadow: "0 0 0 4px rgba(16,185,129,0.15), 0 4px 10px rgba(16,185,129,0.2)",
                border: "none",
            };
        }
        if (index === stepIndex) {
            return {
                background: "var(--terracotta, #F7620A)",
                color: "white",
                transform: "scale(1.1)",
                boxShadow: "0 0 0 4px rgba(247,98,10,0.15), 0 4px 12px rgba(247,98,10,0.3)",
                border: "none",
                fontWeight: 700,
            };
        }
        return {
            background: "white",
            color: "var(--text-muted, #6B4C2A)",
            border: "2px solid var(--cream-dark, #F0D5C2)",
        };
    };

    // Fungsi untuk menentukan style garis penghubung
    const getLineStyle = (index: number): React.CSSProperties => {
        if (currentStep === 'success') return { background: "#10B981" };
        if (index < stepIndex) return { background: "#10B981" };
        return { background: "var(--cream-dark, #F0D5C2)" };
    };

    // Fungsi untuk menentukan style teks judul step
    const getTitleStyle = (index: number): React.CSSProperties => {
        const base = { fontSize: "14px", transition: "all 0.3s" };
        if (currentStep === 'success') {
            return { ...base, color: "var(--text-primary, #1A1008)", fontWeight: 700 };
        }
        if (index === stepIndex) {
            return { ...base, color: "var(--terracotta, #F7620A)", fontWeight: 800 };
        }
        if (index < stepIndex) {
            return { ...base, color: "var(--text-secondary, #4A3728)", fontWeight: 700 };
        }
        return { ...base, color: "var(--text-muted, #6B4C2A)", fontWeight: 600 };
    };

    const getSubStyle = (index: number): React.CSSProperties => {
        const base = { fontSize: "11px", transition: "all 0.3s", marginTop: "2px" };
        if (currentStep === 'success' || index < stepIndex) {
            return { ...base, color: "var(--text-muted, #6B4C2A)" };
        }
        if (index === stepIndex) {
            return { ...base, color: "var(--brown-light, #9B7B5A)", fontWeight: 500 };
        }
        return { ...base, color: "var(--text-muted, #6B4C2A)", opacity: 0.7 };
    };

    return (
        <div 
            style={{
                background: "white",
                borderRadius: "24px",
                border: "1.5px solid var(--cream-dark, #F0D5C2)",
                boxShadow: "0 4px 20px rgba(44,24,16,0.06)",
                padding: "20px 24px",
                marginBottom: "32px"
            }}
        >
            <div className="flex items-center justify-center max-w-3xl mx-auto flex-wrap md:flex-nowrap gap-y-4">
                {/* Step 1: Keranjang */}
                <div className="flex items-center">
                    <div 
                        className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 flex-shrink-0 text-sm font-bold"
                        style={getStepStyle(0)}
                    >
                        {currentStep === 'success' || stepIndex > 0 ? <i className="fas fa-check text-xs"></i> : <span>1</span>}
                    </div>
                    <div className="hidden md:block ml-3">
                        <p style={getTitleStyle(0)}>Keranjang</p>
                        <p style={getSubStyle(0)}>Produk Pilihan</p>
                    </div>
                </div>
                <div 
                    className="flex-grow h-[2px] min-w-[20px] max-w-[60px] md:max-w-[80px] mx-2 md:mx-4 rounded-full transition-all duration-300"
                    style={getLineStyle(0)}
                ></div>

                {/* Step 2: Detail Pesanan */}
                <div className="flex items-center">
                    <div 
                        className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 flex-shrink-0 text-sm font-bold"
                        style={getStepStyle(1)}
                    >
                        {currentStep === 'success' || stepIndex > 1 ? <i className="fas fa-check text-xs"></i> : <span>2</span>}
                    </div>
                    <div className="hidden md:block ml-3">
                        <p style={getTitleStyle(1)}>Detail Pesanan</p>
                        <p style={getSubStyle(1)}>Alamat & Pengiriman</p>
                    </div>
                </div>
                <div 
                    className="flex-grow h-[2px] min-w-[20px] max-w-[60px] md:max-w-[80px] mx-2 md:mx-4 rounded-full transition-all duration-300"
                    style={getLineStyle(1)}
                ></div>

                {/* Step 3: Pembayaran */}
                <div className="flex items-center">
                    <div 
                        className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 flex-shrink-0 text-sm font-bold"
                        style={getStepStyle(2)}
                    >
                        {currentStep === 'success' || stepIndex > 2 ? <i className="fas fa-check text-xs"></i> : <span>3</span>}
                    </div>
                    <div className="hidden md:block ml-3">
                        <p style={getTitleStyle(2)}>Pembayaran</p>
                        <p style={getSubStyle(2)}>QRIS Payment</p>
                    </div>
                </div>
                <div 
                    className="flex-grow h-[2px] min-w-[20px] max-w-[60px] md:max-w-[80px] mx-2 md:mx-4 rounded-full transition-all duration-300"
                    style={getLineStyle(2)}
                ></div>

                {/* Step 4: Konfirmasi */}
                <div className="flex items-center">
                    <div 
                        className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 flex-shrink-0 text-sm font-bold"
                        style={getStepStyle(3)}
                    >
                        {currentStep === 'success' || stepIndex > 3 ? <i className="fas fa-check text-xs"></i> : <span>4</span>}
                    </div>
                    <div className="hidden md:block ml-3">
                        {currentStep === 'success' ? (
                            <>
                                <p style={getTitleStyle(3)}>Selesai</p>
                                <p style={{ ...getSubStyle(3), color: "#10B981", fontWeight: 600 }}>Pesanan Berhasil</p>
                            </>
                        ) : (
                            <>
                                <p style={getTitleStyle(3)}>Konfirmasi</p>
                                <p style={getSubStyle(3)}>Upload Bukti</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
