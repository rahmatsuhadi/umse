"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Order } from "@/types";
import Image from "next/image";
import CountdownTimer from "./CountDownPayment";
import { formatDate } from "@/lib/format-date";
import { CheckoutStep } from "@/components/checkouts/lib";
import { animationVariants } from "@/components/checkouts/CheckoutItemPageStep";
import { Clock, CheckCircle, Smartphone, QrCode, AlertCircle } from "lucide-react";

export default function PaymentStep({
  currentStep: step,
  order,
  onConfirmation,
}: {
  order: Order;
  onConfirmation: () => void;
  currentStep: CheckoutStep;
}) {
  const allowedStatuses = ["unpaid", "partially_paid", "rejected", "expired"];

  const now = new Date();
  const paid_expired_at = new Date(order.payment_due_at);
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
        <div id="paymentSection" className="mb-6">
          {isAllowed && !isPaymentExpired ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* QRIS Card */}
              <div className="checkout-card flex flex-col h-full lg:col-span-7">
                <div className="checkout-header-section">
                  <div className="checkout-header-icon-box">
                    <QrCode className="w-5 h-5 text-[var(--terracotta)]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Pembayaran QRIS</h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Scan/Unduh kode QR di bawah untuk menyelesaikan pembayaran</p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex flex-col items-center h-full justify-between gap-4">
                    {/* QR Code Frame */}
                    <div className="relative mb-3">
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--terracotta)]/10 to-transparent rounded-2xl blur-xl" />
                      <div className="relative bg-white border-2 border-[var(--cream-dark)] rounded-2xl p-5 shadow-lg">
                        <div className="w-60 h-60 flex items-center justify-center rounded-xl overflow-hidden bg-white">
                          <Image
                            src={order.store.qris_url}
                            width={240}
                            height={240}
                            alt="Order QRIS"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                      {/* Corner accents */}
                      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[var(--terracotta)] rounded-tl-md" />
                      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[var(--terracotta)] rounded-tr-md" />
                      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[var(--terracotta)] rounded-bl-md" />
                      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[var(--terracotta)] rounded-br-md" />
                    </div>

                    <div className="text-center">
                      <h4 className="text-base font-bold text-[var(--text-primary)] mb-1">
                        Scan QRIS untuk Pembayaran
                      </h4>
                      <p className="text-[var(--text-muted)] text-xs font-semibold">
                        Total yang harus dibayar
                      </p>
                    </div>

                    <div className="bg-[var(--cream)] border border-[var(--cream-dark)] rounded-2xl px-6 py-3 mb-4 shadow-inner">
                      <span id="totalPayment" className="text-2xl font-extrabold text-[var(--terracotta)] tracking-tight">
                        {order.total.formatted}
                      </span>
                    </div>

                    {/* Countdown */}
                    <div className="w-full bg-[var(--cream)] border border-[var(--saffron-light)]/40 rounded-2xl p-3.5 mb-4 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-[var(--saffron)]/10 rounded-lg flex items-center justify-center">
                          <Clock className="w-4 h-4 text-[var(--saffron)]" />
                        </div>
                        <span className="text-[var(--text-secondary)] text-xs font-semibold">Batas pembayaran:</span>
                      </div>
                      <span id="countdown" className="text-xs">
                        <CountdownTimer targetDate={order.payment_due_at} />
                      </span>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={onPaymentSubmit}
                      className="w-full bg-[var(--terracotta)] text-white py-3.5 px-6 rounded-2xl font-bold transition-all duration-300 shadow-md shadow-[var(--terracotta)]/25 hover:bg-[var(--terracotta-dark)] hover:shadow-lg hover:shadow-[var(--terracotta)]/35 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Sudah Bayar? Konfirmasi Sekarang
                    </button>
                  </div>
                </div>
              </div>

              {/* Cara Pembayaran */}
              <div className="checkout-card flex flex-col h-full lg:col-span-5">
                <div className="checkout-header-section">
                  <div className="checkout-header-icon-box">
                    <Smartphone className="w-5 h-5 text-[var(--terracotta)]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Cara Pembayaran</h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Ikuti petunjuk langkah pembayaran di bawah ini</p>
                  </div>
                </div>
                <ol className="space-y-4">
                  {[
                    "Buka aplikasi mobile banking atau e-wallet Anda",
                    'Pilih menu "Scan QR" atau "QRIS"',
                    "Arahkan kamera ke QR code di atas",
                    "Masukkan nominal sesuai total pembayaran",
                    "Konfirmasi dan selesaikan pembayaran",
                    "Simpan bukti pembayaran untuk konfirmasi",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[var(--cream)] text-[var(--terracotta)] border border-[var(--cream-dark)] rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                        {i + 1}
                      </span>
                      <span className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed mt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <div className="checkout-card text-center p-8">
              <div className="w-16 h-16 bg-[var(--cream)] border border-[var(--cream-dark)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-[var(--text-muted)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                {isPaymentExpired ? "Waktu Pembayaran Habis" : "Pembayaran Tidak Tersedia"}
              </h3>
              {isPaymentExpired ? (
                <p className="text-[var(--text-secondary)] text-sm font-medium leading-relaxed">
                  Pembayaran sudah melewati batas waktu yang ditentukan pada{" "}
                  <span className="font-bold text-[var(--terracotta)]">
                    {formatDate(order.payment_due_at)}
                  </span>
                  . Pembayaran tidak dapat dilakukan.
                </p>
              ) : (
                <p className="text-[var(--text-secondary)] text-sm font-medium leading-relaxed">
                  Status pesanan Anda saat ini{" "}
                  <span className="font-bold text-[var(--terracotta)]">{order.payment_status}</span>.
                  Pembayaran tidak tersedia untuk status ini.
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
