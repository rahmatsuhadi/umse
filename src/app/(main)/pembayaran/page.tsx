"use client"
import Link from "next/link";
import React, { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import Image from "next/image";



type CheckoutStep = "checkout" | "payment" | "confirmation" | "success";

const steps = [
    { key: "checkout", label: "Checkout" },
    { key: "payment", label: "Pembayaran" },
    { key: "confirmation", label: "Konfirmasi" },
    { key: "success", label: "Berhasil" },
];


export default function CheckoutPage({ }: { params: Promise<{ storeId: string }> }) {
    const [step, setStep] = useState<CheckoutStep>("checkout");
    const currentStepIndex = steps.findIndex(s => s.key === step);

    const animationVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    const handleNextStep = () => {
        switch (step) {
            case "checkout": setStep("payment"); break;
            case "payment": setStep("confirmation"); break;
            case "confirmation": setStep("success"); break;
            default: break;
        }
    };

    return (
        <div className="bg-gray-50 font-jakarta">
            {/* header */}

            <header className="bg-white shadow-md sticky top-0 z-40 md:px-10">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center gap-2">
                                <Image
                                    src="/slemanmartlogo.png"
                                    alt="Slemanmart Logo"
                                    width={80}
                                    height={80}
                                />
                            </Link>
                        </div>

                        <nav className="hidden md:flex items-center space-x-2 text-sm">
                            <Link href="/" className="text-gray-600 hover:text-primary">Beranda</Link>
                            <i className="fas fa-chevron-right text-gray-400 text-xs"></i>

                            <Link href="/keranjang" className="text-gray-600 hover:text-primary">Keranjang</Link>

                            {steps.slice(0, currentStepIndex + 1).map((s, index) => (
                                <React.Fragment key={index}>
                                    <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
                                    <span className={s.key === step ? "text-primary font-medium" : "text-gray-600"}>
                                        {s.label}
                                    </span>
                                </React.Fragment>
                            ))}
                        </nav>

                        <Link href="/keranjang" className="text-gray-600 hover:text-primary">
                            <i className="fas fa-arrow-left mr-2"></i>Kembali
                        </Link>
                    </div>
                </div>
            </header>


            {/* main content */}

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto ">

                    <StepIndicator currentStep={step} />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            variants={animationVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                        >


                            {step == "checkout" ? (
                                <div id="orderSection" className="bg-white rounded-lg shadow-md mb-6">
                                    <div className="p-6 border-b border-gray-200">
                                        <h3 className="text-lg font-bold text-gray-800">Detail Pesanan</h3>
                                        <p className="text-sm text-gray-600">Lengkapi informasi pengiriman</p>
                                    </div>

                                    <div className="p-6">
                                        {/* <!-- Store Info --> */}
                                        <div
                                            className="bg-primary-light/20 bg-opacity-20 border border-primary-dark rounded-lg p-4 mb-6"
                                        >
                                            <div className="flex items-center">
                                                <i className="fas fa-store text-primary text-xl mr-3"></i>
                                                <div>
                                                    <h4 className="font-bold text-gray-800">Warung Bu Sari</h4>
                                                    <p className="text-sm text-gray-600">
                                                        Jl. Kaliurang KM 10, Sleman
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* <!-- Order Items --> */}
                                        <div className="mb-6">
                                            <h4 className="font-bold text-gray-800 mb-4">Item Pesanan</h4>
                                            <div className="space-y-4">
                                                <div className="flex items-center bg-gray-50 rounded-lg p-4">
                                                    <div
                                                        className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-4"
                                                    >
                                                        <i className="fas fa-image text-gray-400"></i>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h5 className="font-medium text-gray-800">Gudeg Komplit</h5>
                                                        <p className="text-sm text-gray-600">
                                                            Dengan ayam, telur, dan krecek
                                                        </p>
                                                        <p className="text-sm text-primary font-bold mt-1">
                                                            Rp 25.000 x 2
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-800">Rp 50.000</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center bg-gray-50 rounded-lg p-4">
                                                    <div
                                                        className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-4"
                                                    >
                                                        <i className="fas fa-image text-gray-400"></i>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h5 className="font-medium text-gray-800">Es Teh Manis</h5>
                                                        <p className="text-sm text-gray-600">Minuman segar</p>
                                                        <p className="text-sm text-primary font-bold mt-1">
                                                            Rp 5.000 x 2
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-800">Rp 10.000</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* <!-- Order Summary --> */}
                                            <div className="border-t border-gray-200 pt-4 mt-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-gray-600">Subtotal</span>
                                                    <span className="font-medium">Rp 60.000</span>
                                                </div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-gray-600">Ongkos Kirim</span>
                                                    <span className="font-medium">Rp 2.000</span>
                                                </div>
                                                <div
                                                    className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-2"
                                                >
                                                    <span>Total</span>
                                                    <span className="text-primary">Rp 62.000</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* <!-- Shipping Address --> */}
                                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2"
                                                >Nama Penerima *</label>
                                                <input
                                                    type="text"
                                                    id="recipientName"
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                                    placeholder="Nama lengkap penerima"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2"
                                                >Nomor Telepon *</label>
                                                <input
                                                    type="tel"
                                                    id="recipientPhone"
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                                    placeholder="08xxxxxxxxxx"
                                                    required
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2"
                                                >Alamat Lengkap *</label>
                                                <textarea
                                                    id="fullAddress"
                                                    rows={3}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                                    placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                                                    required
                                                ></textarea>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2"
                                                >Kota/Kabupaten *</label>
                                                <select
                                                    id="citySelect"
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                                    required
                                                >
                                                    <option value="">Pilih kota/kabupaten</option>
                                                    <option value="sleman">Sleman</option>
                                                    <option value="yogyakarta">Yogyakarta</option>
                                                    <option value="bantul">Bantul</option>
                                                    <option value="gunungkidul">Gunung Kidul</option>
                                                    <option value="kulonprogo">Kulon Progo</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2"
                                                >Kode Pos</label>
                                                <input
                                                    type="text"
                                                    id="postalCode"
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                                    placeholder="55xxx"
                                                />
                                            </div>
                                        </div>

                                        {/* <!-- Notes --> */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2"
                                            >Catatan untuk Penjual (Opsional)</label>
                                            <textarea
                                                id="notes"
                                                rows={3}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                                placeholder="Contoh: Kirim sore hari, jangan gunakan kantong plastik hitam"
                                            ></textarea>
                                        </div>

                                        <button
                                            onClick={() => handleNextStep()}
                                            // onclick="proceedToPayment()"
                                            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark transition duration-300"
                                        >
                                            <i className="fas fa-credit-card mr-2"></i>Lanjut ke Pembayaran
                                        </button>
                                    </div>
                                </div>
                            ) :
                                step == "payment" ? (
                                    <div
                                        id="paymentSection"
                                        className="bg-white rounded-lg shadow-md mb-6"
                                    >
                                        <div className="p-6 border-b border-gray-200">
                                            <h3 className="text-lg font-bold text-gray-800">Pembayaran</h3>
                                            <p className="text-sm text-gray-600">
                                                Scan QRIS untuk menyelesaikan pembayaran
                                            </p>
                                        </div>

                                        <div className="p-6">
                                            <div className="text-center mb-6">
                                                {/* <!-- QR Code --> */}
                                                <div
                                                    className="bg-white border-2 border-gray-200 rounded-lg p-8 inline-block mb-4"
                                                >
                                                    <div
                                                        className="w-64 h-64 bg-gray-100 flex items-center justify-center rounded-lg"
                                                    >
                                                        {/* <!-- QR Code Pattern --> */}
                                                        <div className="grid grid-cols-8 gap-1">
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>

                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>

                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>

                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>

                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>

                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>

                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>

                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                            <div className="w-6 h-6 bg-black rounded-sm"></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <h4 className="text-lg font-bold text-gray-800 mb-2">
                                                    Scan QRIS untuk Pembayaran
                                                </h4>
                                                <p className="text-gray-600 mb-4">
                                                    Total yang harus dibayar:
                                                    <span id="totalPayment" className="font-bold text-primary"
                                                    >Rp 62.000</span>
                                                </p>

                                                {/* <!-- Payment Instructions --> */}
                                                <div
                                                    className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left"
                                                >
                                                    <h5 className="font-bold text-blue-800 mb-2">Cara Pembayaran:</h5>
                                                    <ol className="text-sm text-blue-700 space-y-1">
                                                        <li>1. Buka aplikasi mobile banking atau e-wallet Anda</li>
                                                        <li>{`2. Pilih menu "Scan QR" atau "QRIS"`}</li>
                                                        <li>3. Arahkan kamera ke QR code di atas</li>
                                                        <li>4. Masukkan nominal sesuai total pembayaran</li>
                                                        <li>5. Konfirmasi dan selesaikan pembayaran</li>
                                                        <li>6. Simpan bukti pembayaran untuk konfirmasi</li>
                                                    </ol>
                                                </div>

                                                {/* <!-- Payment Timer --> */}
                                                <div
                                                    className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6"
                                                >
                                                    <div className="flex items-center justify-center">
                                                        <i className="fas fa-clock text-orange-500 mr-2"></i>
                                                        <span className="text-orange-700"
                                                        >Selesaikan pembayaran dalam:
                                                        </span>
                                                        <span id="countdown" className="font-bold text-orange-800 ml-2"
                                                        >14:59</span>
                                                    </div>
                                                </div>

                                                <button onClick={() => handleNextStep()}
                                                    className="bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition duration-300">
                                                    <i className="fas fa-check mr-2"></i>Sudah Bayar? Konfirmasi
                                                    Sekarang
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                ) : step == "confirmation" ? (
                                    <div
                                        id="confirmationSection"
                                        className="bg-white rounded-lg shadow-md mb-6 "
                                    >
                                        <div className="p-6 border-b border-gray-200">
                                            <h3 className="text-lg font-bold text-gray-800">
                                                Konfirmasi Pembayaran
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Upload bukti pembayaran untuk menyelesaikan pesanan
                                            </p>
                                        </div>

                                        <div className="p-6">
                                            <form id="confirmationForm" >
                                                {/* <!-- Payment Proof Upload --> */}
                                                <div className="mb-6">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2"
                                                    >Bukti Pembayaran *</label>
                                                    <div
                                                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition duration-300"
                                                    >
                                                        <input
                                                            type="file"
                                                            id="paymentProof"
                                                            accept="image/*"
                                                            className="hidden"
                                                            // onchange="handleFileUpload(this)"
                                                            required
                                                        />
                                                        <div
                                                            id="uploadArea"
                                                            className="cursor-pointer"
                                                        // onclick="document.getElementById('paymentProof').click()"
                                                        >
                                                            <i
                                                                className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"
                                                            ></i>
                                                            <p className="text-gray-600 mb-2">
                                                                Klik untuk upload bukti pembayaran
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Format: JPG, PNG, PDF (Max 5MB)
                                                            </p>
                                                        </div>
                                                        <div id="filePreview" className="hidden">
                                                            <img alt="image-payment"
                                                                id="previewImage"
                                                                className="max-w-full h-32 object-contain mx-auto mb-2 rounded"
                                                            />
                                                            <p id="fileName" className="text-sm text-gray-600"></p>
                                                            <button
                                                                type="button"
                                                                // onclick="removeFile()"
                                                                className="text-red-500 hover:text-red-700 text-sm mt-2"
                                                            >
                                                                <i className="fas fa-trash mr-1"></i>Hapus
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* <!-- Payment Details --> */}
                                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2"
                                                        >Nama Pengirim *</label>
                                                        <input
                                                            type="text"
                                                            id="senderName"
                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                                            placeholder="Nama sesuai rekening/e-wallet"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2"
                                                        >Nominal yang Dibayar *</label>
                                                        <input
                                                            type="number"
                                                            id="paidAmount"
                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                                            placeholder="62000"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2"
                                                        >Metode Pembayaran *</label>
                                                        <select
                                                            id="paymentMethod"
                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                                            required
                                                        >
                                                            <option value="">Pilih metode pembayaran</option>
                                                            <option value="dana">DANA</option>
                                                            <option value="gopay">GoPay</option>
                                                            <option value="ovo">OVO</option>
                                                            <option value="linkaja">LinkAja</option>
                                                            <option value="shopeepay">ShopeePay</option>
                                                            <option value="bca">BCA Mobile</option>
                                                            <option value="mandiri">Mandiri Online</option>
                                                            <option value="bni">BNI Mobile Banking</option>
                                                            <option value="bri">BRI Mobile</option>
                                                            <option value="other">Lainnya</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2"
                                                        >Tanggal & Waktu Pembayaran *</label>
                                                        <input
                                                            type="datetime-local"
                                                            id="paymentDateTime"
                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                {/* <!-- Additional Notes --> */}
                                                <div className="mb-6">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2"
                                                    >Catatan Tambahan (Opsional)</label>
                                                    <textarea
                                                        id="additionalNotes"
                                                        rows={3}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                                        placeholder="Catatan tambahan terkait pembayaran"
                                                    ></textarea>
                                                </div>

                                                {/* <!-- Terms Agreement --> */}
                                                <div className="mb-6">
                                                    <label className="flex items-start">
                                                        <input
                                                            type="checkbox"
                                                            id="termsAgreement"
                                                            className="mt-1 w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                                                            required
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">
                                                            Saya menyatakan bahwa informasi yang saya berikan adalah
                                                            benar dan akurat. Saya memahami bahwa pembayaran akan
                                                            diverifikasi oleh penjual sebelum pesanan diproses.
                                                            <Link href="#" className="text-primary hover:text-primary-dark"
                                                            >Syarat & Ketentuan</Link>
                                                        </span>
                                                    </label>
                                                </div>

                                                <button
                                                    onClick={() => handleNextStep()}
                                                    className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark transition duration-300"
                                                >
                                                    <i className="fas fa-paper-plane mr-2"></i>Kirim Konfirmasi
                                                    Pembayaran
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        id="successMessage"
                                        className="bg-white rounded-lg shadow-md p-6 text-center"
                                    >
                                        <div className="mb-6">
                                            <div
                                                className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4"
                                            >
                                                <i className="fas fa-check-circle text-green-600 text-4xl"></i>
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                                Pesanan Berhasil Dibuat!
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                Terima kasih atas pesanan Anda. Konfirmasi pembayaran telah
                                                dikirim ke penjual.
                                            </p>
                                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                                <p className="text-sm text-gray-600 mb-2">Nomor Pesanan:</p>
                                                <p id="orderNumber" className="text-lg font-bold text-primary">
                                                    #SLM-2025-001
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Link href={"/pesanan"} className="mb-2">
                                                <button type="button"
                                                    className="w-full bg-primary mb-2 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark transition duration-300">
                                                    <i className="fas fa-eye mr-2"></i>Lacak Pesanan
                                                </button>
                                            </Link>
                                            <Link href={"/"}>
                                                <button type="button"
                                                    className="w-full border border-primary text-primary py-3 px-6 rounded-lg font-medium hover:bg-primary hover:text-white transition duration-300"
                                                >
                                                    <i className="fas fa-shopping-bag mr-2"></i>Belanja Lagi
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                )
                            }
                        </motion.div>
                    </AnimatePresence>


                    {/* <!-- Step 1: Order Details --> */}

                </div>
            </div>
        </div>
    )
}



// Komponen terpisah untuk progress bar agar lebih rapi
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
