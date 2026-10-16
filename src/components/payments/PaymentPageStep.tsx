"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Order } from "@/types";
import Image from "next/image";
import CountdownTimer from "./CountDownPayment";
import { formatDate } from "@/lib/format-date";
import { CheckoutStep } from "@/components/checkouts/lib";
import { animationVariants } from "@/components/checkouts/CheckoutItemPageStep";
import {
  Clock,
  CheckCircle,
  Smartphone,
  QrCode,
  AlertCircle,
  Loader2,
  RefreshCw,
  Download,
  Copy,
} from "lucide-react";
import { StepIndicator } from "@/components/orders/step/StepIndicator";
import { useCallback, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

interface QrisResponseData {
  nmid: string;
  terminal_label: string;
  amount: string;
  type?: string | null;
  invoice_id: string;
  callback_url: string;
  qr_string: string;
  expired_time: string;
  created_at: string;
}

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
  const paymentExpiryDate = order.payment_expired_at || order.payment_due_at;
  const paid_expired_at = new Date(paymentExpiryDate);
  const isAllowed = allowedStatuses.includes(order.payment_status);
  const isPaymentExpired = paid_expired_at <= now;

  const [qrisData, setQrisData] = useState<QrisResponseData | null>(null);
  const [isLoadingQris, setIsLoadingQris] = useState<boolean>(false);
  const [qrisError, setQrisError] = useState<string | null>(null);

  // Gunakan qr_string yang sudah tersimpan di order, atau dari respons API
  const effectiveQrString = order.qr_string || qrisData?.qr_string || null;

  const fetchBpdQris = useCallback(async () => {
    // Jika qr_string sudah tersedia di order, tidak perlu hit API lagi
    if (order.qr_string) {
      return;
    }

    const nmid = order.store?.nmid;

    setIsLoadingQris(true);
    setQrisError(null);

    try {
      const amountVal = order.total.value ?? Number(order.total.amount) ?? 0;
      const res = await apiClient<{ data: QrisResponseData; message: string; status: string }>(
        "/qris/create",
        {
          method: "POST",
          body: JSON.stringify({
            nmid,
            amount: String(amountVal),
            invoice_id: order.order_number,
          }),
        }
      );

      if (res?.data?.qr_string) {
        setQrisData(res.data);
      } else {
        throw new Error(res.message || "Gagal mendapatkan kode QRIS dari Bank BPD DIY.");
      }
    } catch (err: unknown) {
      console.error("[BPD QRIS Error]:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "Gagal membuat QRIS Bank BPD DIY.";
      setQrisError(errorMessage);
    } finally {
      setIsLoadingQris(false);
    }
  }, [order.qr_string, order.store?.nmid, order.total, order.order_number]);

  useEffect(() => {
    // Lakukan hit createQris hanya jika qr_string belum ada di database
    if (!order.qr_string && !qrisData?.qr_string) {
      fetchBpdQris();
    }
  }, [fetchBpdQris, order.qr_string, qrisData?.qr_string]);

  const downloadQrCode = () => {
    const svg = document.getElementById("bpd-qris-svg");
    if (!svg) {
      toast.error("Kode QR tidak ditemukan.");
      return;
    }

    try {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new window.Image();
      img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));

      img.onload = () => {
        canvas.width = 440;
        canvas.height = 440;
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, 440, 440);
          ctx.drawImage(img, 20, 20, 400, 400);
        }
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `QRIS-${order.order_number || "bpd"}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
        toast.success("QRIS berhasil diunduh!");
      };
    } catch {
      toast.error("Gagal mengunduh QRIS.");
    }
  };

  const copyQrString = () => {
    const str = effectiveQrString;
    if (str) {
      navigator.clipboard.writeText(str);
      toast.success("String QRIS berhasil disalin!");
    }
  };

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
              <div className="flex flex-col h-full lg:col-span-7 space-y-6">
                {/* Step Indicator — sejajar dengan informasi wizard */}
                <StepIndicator currentStep={step} />

                <div className="checkout-card flex flex-col flex-1">
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
                      <div className="relative mb-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--terracotta)]/10 to-transparent rounded-2xl blur-xl" />
                        <div className="relative bg-white border-2 border-[var(--cream-dark)] rounded-2xl p-5 shadow-lg">
                          <div className="w-60 h-60 flex flex-col items-center justify-center rounded-xl overflow-hidden bg-white">
                            {isLoadingQris ? (
                              <div className="flex flex-col items-center justify-center gap-3 p-4 text-center">
                                <Loader2 className="w-8 h-8 animate-spin text-[var(--terracotta)]" />
                                <span className="text-xs font-semibold text-[var(--text-primary)]">
                                  Menghubungkan ke Bank BPD DIY...
                                </span>
                                <span className="text-[11px] text-[var(--text-muted)]">
                                  Menyiapkan QRIS Dinamis
                                </span>
                              </div>
                            ) : effectiveQrString ? (
                              <div className="flex flex-col items-center justify-center p-2">
                                <QRCode
                                  id="bpd-qris-svg"
                                  size={216}
                                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                  value={effectiveQrString}
                                  viewBox="0 0 256 256"
                                />
                              </div>
                            ) : qrisError ? (
                              <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                                <AlertCircle className="w-8 h-8 text-amber-500" />
                                <span className="text-xs font-semibold text-[var(--text-primary)]">
                                  Gagal memuat QRIS BPD
                                </span>
                                <span className="text-[10px] text-[var(--text-muted)] line-clamp-2">
                                  {qrisError}
                                </span>
                                <button
                                  type="button"
                                  onClick={fetchBpdQris}
                                  className="mt-1 flex items-center gap-1.5 px-3 py-1.5 bg-[var(--cream)] hover:bg-[var(--cream-dark)] text-xs font-semibold text-[var(--terracotta)] rounded-lg transition-colors border border-[var(--cream-dark)]"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" />
                                  Coba Lagi
                                </button>
                              </div>
                            ) : order.store?.qris_url ? (
                              <Image
                                src={order.store.qris_url}
                                width={240}
                                height={240}
                                alt="Order QRIS"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                                <QrCode className="w-10 h-10 text-[var(--text-muted)] opacity-40" />
                                <span className="text-xs text-[var(--text-muted)]">
                                  QRIS tidak tersedia
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Corner accents */}
                        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[var(--terracotta)] rounded-tl-md" />
                        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[var(--terracotta)] rounded-tr-md" />
                        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[var(--terracotta)] rounded-bl-md" />
                        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[var(--terracotta)] rounded-br-md" />
                      </div>

                      {/* Download / Copy Action Buttons */}
                      {effectiveQrString && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={downloadQrCode}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[var(--cream-dark)] hover:border-[var(--terracotta)] text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--terracotta)] rounded-lg shadow-sm transition-all"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Unduh QR Code
                          </button>
                          <button
                            type="button"
                            onClick={copyQrString}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[var(--cream-dark)] hover:border-[var(--terracotta)] text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--terracotta)] rounded-lg shadow-sm transition-all"
                            title="Salin String EMVCo QRIS"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            Salin Kode
                          </button>
                        </div>
                      )}

                      {/* BPD DIY Merchant Info */}
                      {(order.store?.nmid || qrisData?.nmid) && (
                        <div className="text-center px-4 py-2 bg-[var(--cream)]/60 border border-[var(--cream-dark)] rounded-xl w-full max-w-xs">
                          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[var(--text-primary)]">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>QRIS Dinamis Bank BPD DIY</span>
                          </div>
                          <div className="text-[10px] text-[var(--text-muted)] mt-0.5 flex items-center justify-center gap-2">
                            <span>NMID: <strong className="text-[var(--text-primary)]">{order.store?.nmid || qrisData?.nmid}</strong></span>
                            {(qrisData?.invoice_id || order.order_number) && (
                              <span>• Inv: <strong className="text-[var(--text-primary)]">{qrisData?.invoice_id || order.order_number}</strong></span>
                            )}
                          </div>
                        </div>
                      )}

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
                      <div className="w-full bg-[var(--cream)] border border-[var(--saffron-light)]/40 rounded-2xl p-3.5 mb-4 flex items-center justify-between shadow-sm" style={{ paddingRight: "15px" }}>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-[var(--saffron)]/10 rounded-lg flex items-center justify-center">
                            <Clock className="w-4 h-4 text-[var(--saffron)]" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[var(--text-secondary)] text-xs font-semibold">Batas pembayaran:</span>
                            {paymentExpiryDate && (
                              <span className="text-[10px] text-[var(--text-muted)]">
                                {formatDate(paymentExpiryDate)}
                              </span>
                            )}
                          </div>
                        </div>
                        <span id="countdown" className="text-xs">
                          <CountdownTimer targetDate={paymentExpiryDate} />
                        </span>
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={onPaymentSubmit}
                        className="checkout-btn-full"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Sudah Bayar? Konfirmasi Sekarang
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cara Pembayaran */}
              <div className="flex flex-col h-full lg:col-span-5 space-y-6">
                <div className="checkout-card flex flex-col flex-1">
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
                      <li key={i} className="flex items-start gap-3" style={{ padding: "5px 0 5px 0" }}>
                        <span className="flex-shrink-0 w-6 h-6 bg-[var(--cream)] text-[var(--terracotta)] border border-[var(--cream-dark)] rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                          {i + 1}
                        </span>
                        <span className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed mt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
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
