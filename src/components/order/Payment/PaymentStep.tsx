
"use client"
import { AnimatePresence, motion } from "framer-motion";
import { animationVariants } from "../step/animate";
import { CheckoutStep } from "../step/steps";
import { Order } from "@/types";
import Image from "next/image";


export default function PaymentStep({ currentStep: step, order, onConfirmation }: { order:Order, onConfirmation: () => void, currentStep: CheckoutStep }) {

    const onPaymentSubmit = () => {
        console.log("TESTING")
        onConfirmation()
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={step}
                variants={animationVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
            >
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
                                    <Image 
                                    src={order.store.qris_url}
                                    width={500}
                                    height={500}
                                    alt="Order Qris"
                                    />
                                </div>
                            </div>

                            <h4 className="text-lg font-bold text-gray-800 mb-2">
                                Scan QRIS untuk Pembayaran
                            </h4>
                            <p className="text-gray-600 mb-4">
                                Total yang harus dibayar:
                                <span id="totalPayment" className="font-bold text-primary"
                                >{order.total.formatted}</span>
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
                            {/* <div
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
                            </div> */}

                            <button onClick={() => onPaymentSubmit()}
                                className="bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition duration-300">
                                <i className="fas fa-check mr-2"></i>Sudah Bayar? Konfirmasi
                                Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}