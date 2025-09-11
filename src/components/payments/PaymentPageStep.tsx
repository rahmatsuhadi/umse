
"use client"
import { AnimatePresence, motion } from "framer-motion";
import { Order } from "@/types";
import Image from "next/image";
import CountdownTimer from "./CountDownPayment";
import { formatDate } from "@/lib/format-date";
import { CheckoutStep } from "@/components/checkouts/lib";
import { animationVariants } from "@/components/checkouts/CheckoutItemPageStep";


export default function PaymentStep({
  currentStep: step,
  order,
  onConfirmation,
}: {
  order: Order;
  onConfirmation: () => void;
  currentStep: CheckoutStep;
}) {
  const allowedStatuses = ["unpaid", "partially_paid", 'rejected', 'expired'];

  const now = new Date();

  const paid_expired_at = new Date(order.payment_due_at); // Convert payment_due_at to Date object

  const isAllowed = allowedStatuses.includes(order.payment_status);

  const isPaymentExpired = paid_expired_at <= now;

  const onPaymentSubmit = () => {
    onConfirmation();
  };

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
           {isAllowed && !isPaymentExpired ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800">Pembayaran</h3>
                <p className="text-sm text-gray-600">
                  Scan QRIS untuk menyelesaikan pembayaran
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="text-center mb-6">
                  {/* QRIS */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-8 inline-block mb-4">
                    <div className="w-64 h-64 bg-gray-100 flex items-center justify-center rounded-lg">
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
                    Total yang harus dibayar:{" "}
                    <span id="totalPayment" className="font-bold text-primary">
                      {order.total.formatted}
                    </span>
                  </p>

                  {/* Instruksi */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                    <h5 className="font-bold text-blue-800 mb-2">
                      Cara Pembayaran:
                    </h5>
                    <ol className="text-sm text-blue-700 space-y-1">
                      <li>1. Buka aplikasi mobile banking atau e-wallet Anda</li>
                      <li>{`2. Pilih menu "Scan QR" atau "QRIS"`}</li>
                      <li>3. Arahkan kamera ke QR code di atas</li>
                      <li>4. Masukkan nominal sesuai total pembayaran</li>
                      <li>5. Konfirmasi dan selesaikan pembayaran</li>
                      <li>6. Simpan bukti pembayaran untuk konfirmasi</li>
                    </ol>
                  </div>

                  {/* Timer */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center">
                      <i className="fas fa-clock text-orange-500 mr-2"></i>
                      <span className="text-orange-700">
                        Selesaikan pembayaran dalam:
                      </span>
                      <span id="countdown" className="font-bold text-orange-800 ml-2">
                        <CountdownTimer targetDate={order.payment_due_at} />
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={onPaymentSubmit}
                    className="bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition duration-300"
                  >
                    <i className="fas fa-check mr-2"></i>Sudah Bayar? Konfirmasi Sekarang
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Jika pembayaran tidak tersedia atau sudah lewat
            <div className="p-6 text-center text-gray-600">
              <i className="fas fa-info-circle text-blue-500 text-2xl mb-2"></i>
              {isPaymentExpired ? (
                <p>
                  Pembayaran sudah melewati batas waktu yang ditentukan pada{" "}
                  <span className="font-semibold">{formatDate(order.payment_due_at)}</span>.
                  Pembayaran tidak dapat dilakukan.
                </p>
              ) : (
                <p>
                  Status pesanan Anda saat ini{" "}
                  <span className="font-semibold">{order.payment_status}</span>.
                </p>
              )}
              <p>Pembayaran tidak tersedia untuk status ini.</p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}