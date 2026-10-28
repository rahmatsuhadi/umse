"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Order } from "@/types";
import CountdownTimer from "./CountDownPayment";
import { formatDate } from "@/lib/format-date";
import { CheckoutStep } from "@/components/checkouts/lib";
import { animationVariants } from "@/components/checkouts/CheckoutItemPageStep";
import {
  Clock,
  CheckCircle2,
  Smartphone,
  QrCode,
  AlertCircle,
  Loader2,
  RefreshCw,
  Download,
  Copy,
  Truck,
  Package,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { StepIndicator } from "@/components/orders/step/StepIndicator";
import { useCallback, useEffect, useMemo, useState } from "react";
import QRCode from "react-qr-code";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { useOrderPaymentStatus, useRegenerateQris } from "@/features/order/hooks";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

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
  onConfirmation?: () => void;
  currentStep: CheckoutStep;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Cek apakah metode pembayaran adalah COD
  const isCod = useMemo(() => {
    const method = order.payment_method?.toLowerCase();
    const service = order.shipping_service?.toLowerCase();
    const serviceType = order.shipping_service_type?.toLowerCase();
    return (
      method === "cash_on_delivery" ||
      method === "cod" ||
      service === "cod" ||
      serviceType === "cod"
    );
  }, [order.payment_method, order.shipping_service, order.shipping_service_type]);

  // Cek apakah item yang di-checkout adalah jasa
  const isServiceOrder = useMemo(() => {
    if (order.items && order.items.length > 0) {
      return order.items.every((item) => {
        const type = item.product?.type?.toLowerCase();
        return type === "service" || type === "jasa";
      });
    }
    return (
      order.requires_shipping_payment === false ||
      (!order.shipping_service && Number(order.shipping_cost?.value ?? 0) === 0)
    );
  }, [order.items, order.requires_shipping_payment, order.shipping_service, order.shipping_cost]);

  // Cek apakah order memerlukan tagihan ongkir via QRIS (Card 2)
  // Tidak ditampilkan jika item adalah Jasa atau metode pembayaran adalah COD
  const requiresShippingPayment = useMemo(() => {
    if (isServiceOrder || isCod) {
      return false;
    }
    if (typeof order.requires_shipping_payment === "boolean") {
      return order.requires_shipping_payment;
    }
    return Number(order.shipping_cost?.value ?? 0) > 0 || Boolean(order.shipping_service);
  }, [isServiceOrder, isCod, order.requires_shipping_payment, order.shipping_cost, order.shipping_service]);

  // Hook Polling Realtime Status Pembayaran (tiap 2.5 detik)
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const { data: pollResponse } = useOrderPaymentStatus(order.id, {
    enabled: !showSuccessModal,
    refetchInterval: 2500,
  });

  const pollData = pollResponse?.data;

  // Status pembayaran terkini (reaktif dari polling realtime atau order awal)
  const isBpdPaid = useMemo(() => {
    if (pollData?.bpd_paid !== undefined) return pollData.bpd_paid;
    if (order.is_order_paid !== undefined) return order.is_order_paid;
    return order.payment_status === "paid";
  }, [pollData?.bpd_paid, order.is_order_paid, order.payment_status]);

  const isShippingPaid = useMemo(() => {
    if (!requiresShippingPayment) return true;
    if (pollData?.shipping_paid !== undefined) return pollData.shipping_paid;
    if (order.is_shipping_paid !== undefined) return order.is_shipping_paid;
    return (
      order.shipping_payment_status?.toLowerCase() === "paid" ||
      order.shipping_payment_status === "paid"
    );
  }, [requiresShippingPayment, pollData?.shipping_paid, order.is_shipping_paid, order.shipping_payment_status]);

  const isFullyPaid = useMemo(() => {
    if (pollData?.is_fully_paid !== undefined) return pollData.is_fully_paid;
    if (order.is_fully_paid !== undefined) return order.is_fully_paid;
    return isBpdPaid && (!requiresShippingPayment || isShippingPaid);
  }, [pollData?.is_fully_paid, order.is_fully_paid, isBpdPaid, requiresShippingPayment, isShippingPaid]);

  // Trigger auto redirect saat semua tagihan lunas atau status pesanan processing
  useEffect(() => {
    if (isCod) return; // Order COD dibayar tunai di tempat saat barang diterima, jangan trigger modal lunas QRIS
    const isProcessing = pollData?.order_status === "processing" || order.status === "processing";
    const shouldTrigger = pollData?.should_redirect || isFullyPaid || isProcessing;

    if (shouldTrigger && !showSuccessModal) {
      setShowSuccessModal(true);
      setRedirectCountdown(3);

      const interval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            const redirectUrl = "/pesanan?status=processing";
            router.replace(redirectUrl);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [pollData?.should_redirect, pollData?.order_status, isFullyPaid, order.status, showSuccessModal, router]);

  // Regenerate QRIS mutation
  const { mutate: regenerateQrisMutate, isPending: isRegenerating } = useRegenerateQris(order.id);

  // Waktu kadaluarsa BPD
  const now = new Date();
  const bpdExpiryDate = order.payment_expired_at || order.payment_due_at;
  const isBpdExpired = bpdExpiryDate ? new Date(bpdExpiryDate) <= now : false;

  // Waktu kadaluarsa Ongkir (QRIS Bank BPD DIY)
  const shippingExpiryDate = order.shipping_payment_expired_at || order.payment_due_at;
  const isShippingExpired = shippingExpiryDate ? new Date(shippingExpiryDate) <= now : false;

  const [qrisData, setQrisData] = useState<QrisResponseData | null>(null);
  const [shippingQrString, setShippingQrString] = useState<string | null>(null);
  const [isLoadingQris, setIsLoadingQris] = useState<boolean>(false);
  const [qrisError, setQrisError] = useState<string | null>(null);

  // QR Strings
  const effectiveBpdQrString = order.qr_string || qrisData?.qr_string || null;
  const effectiveShippingQrString =
    shippingQrString ||
    order.shipping_qr_string ||
    order.payment_shipping?.shipping_qr_string ||
    order.payment_shipping?.qr_string ||
    null;

  // Auto-attempt regenerate QRIS Bank BPD DIY untuk ongkir jika order butuh shipping dan belum ada QR string
  const [hasAttemptedShippingQris, setHasAttemptedShippingQris] = useState(false);
  useEffect(() => {
    if (
      requiresShippingPayment &&
      !isShippingPaid &&
      !effectiveShippingQrString &&
      !isRegenerating &&
      !hasAttemptedShippingQris
    ) {
      setHasAttemptedShippingQris(true);
      regenerateQrisMutate(
        { type: "kiriminaja" },
        {
          onSuccess: (res) => {
            if (res?.data?.shipping_qr_string) {
              setShippingQrString(res.data.shipping_qr_string);
            }
          },
        }
      );
    }
  }, [
    requiresShippingPayment,
    isShippingPaid,
    effectiveShippingQrString,
    isRegenerating,
    hasAttemptedShippingQris,
    regenerateQrisMutate,
  ]);

  const fetchBpdQris = useCallback(async () => {
    if (order.qr_string) return;

    const nmid = order.store?.nmid;
    setIsLoadingQris(true);
    setQrisError(null);

    try {
      // Gunakan subtotal untuk barang, atau total untuk jasa / COD
      const amountVal = requiresShippingPayment
        ? order.subtotal?.value ?? Number(order.subtotal?.amount ?? 0)
        : order.total?.value ?? Number(order.total?.amount ?? 0);

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
  }, [order.qr_string, order.store?.nmid, order.subtotal, order.total, order.order_number, requiresShippingPayment]);

  useEffect(() => {
    if (!order.qr_string && !qrisData?.qr_string) {
      fetchBpdQris();
    }
  }, [fetchBpdQris, order.qr_string, qrisData?.qr_string]);

  // Download QR code helper
  const downloadQrCode = (svgId: string, filenamePrefix: string) => {
    const svg = document.getElementById(svgId);
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
        downloadLink.download = `${filenamePrefix}-${order.order_number || "qris"}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
        toast.success("QRIS berhasil diunduh!");
      };
    } catch {
      toast.error("Gagal mengunduh QRIS.");
    }
  };

  const copyQrString = (str: string | null) => {
    if (str) {
      navigator.clipboard.writeText(str);
      toast.success("String QRIS berhasil disalin!");
    }
  };

  const allowedStatuses = ["unpaid", "partially_paid", "rejected", "expired", "awaiting_payment"];
  const isAllowed = allowedStatuses.includes(order.payment_status) || order.status === "awaiting_payment";

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
        {/* Modal Popup Sukses Pembayaran & Auto-Redirect */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border-2 border-emerald-500 transform animate-scale-up">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce" />
              </div>
              <span className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 inline-block mb-2">
                Pembayaran Lunas
              </span>
              <h3 className="text-xl font-extrabold text-[var(--text-primary)]">
                Pembayaran Berhasil Diverifikasi!
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                Seluruh tagihan pesanan Anda ({requiresShippingPayment ? "Produk & Ongkos Kirim" : isServiceOrder ? "Produk Jasa" : "Produk Pesanan"}) telah diverifikasi lunas secara otomatis oleh sistem.
              </p>


              <button
                type="button"
                onClick={() => router.replace("/pesanan?status=processing")}
                className="mt-5 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Lihat Pesanan Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div id="paymentSection" className="mb-6">
          {isAllowed ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Kolom Kiri: Kartu QRIS (1 Card jika Jasa, 2 Card jika Barang) */}
              <div className="flex flex-col h-full lg:col-span-7 space-y-6">
                <StepIndicator currentStep={step} />

                {/* Banner Status Realtime Dual Pembayaran */}
                {requiresShippingPayment && (
                  <div className="p-4 bg-[var(--cream)] border border-[var(--cream-dark)] rounded-2xl flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-white border border-[var(--cream-dark)] flex items-center justify-center text-[var(--terracotta)]">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[var(--text-primary)]">
                          Alur Pembayaran 2 QRIS
                        </h4>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          Produk (QRIS BPD DIY Toko) + Ongkir (QRIS BPD DIY)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                          isFullyPaid
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : isBpdPaid || isShippingPaid
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}
                      >
                        {isFullyPaid
                          ? "2/2 Tagihan Lunas"
                          : isBpdPaid || isShippingPaid
                          ? "1/2 Tagihan Lunas"
                          : "0/2 Tagihan Lunas"}
                      </span>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* CARD 1: TAGIHAN PRODUK (QRIS BANK BPD DIY)              */}
                {/* ========================================================= */}
                <div className={`checkout-card flex flex-col flex-1 transition-all ${isBpdPaid ? "border-emerald-500 bg-emerald-50/20" : ""}`}>
                  <div className="checkout-header-section justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="checkout-header-icon-box">
                        <Package className="w-5 h-5 text-[var(--terracotta)]" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                          {requiresShippingPayment ? "1. Tagihan Produk" : "Tagihan Pesanan"}
                        </h3>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          {isServiceOrder ? "Pembayaran layanan jasa" : requiresShippingPayment ? "Khusus pembayaran barang/pesanan" : "Pembayaran produk pesanan"}
                        </p>
                      </div>
                    </div>
                    {/* Status Badge BPD */}
                    {isBpdPaid ? (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        LUNAS
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Belum Dibayar
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex flex-col items-center gap-4">
                    {/* Tampilan jika sudah Lunas */}
                    {isBpdPaid ? (
                      <div className="w-full py-8 px-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-center flex flex-col items-center justify-center gap-2">
                        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-1">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h4 className="text-base font-extrabold text-emerald-900">
                          Tagihan Produk Telah Lunas
                        </h4>
                        <p className="text-xs text-emerald-700 max-w-xs">
                          Pembayaran tagihan produk telah terverifikasi secara otomatis oleh sistem.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* QR Code Frame BPD */}
                        <div className="relative">
                          <div className="relative bg-white border-2 border-[var(--cream-dark)] rounded-2xl p-4 shadow-md">
                            <div className="w-52 h-52 flex flex-col items-center justify-center overflow-hidden bg-white">
                              {isLoadingQris ? (
                                <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                                  <Loader2 className="w-7 h-7 animate-spin text-[var(--terracotta)]" />
                                  <span className="text-xs font-semibold text-[var(--text-primary)]">
                                    Menyiapkan QRIS BPD DIY...
                                  </span>
                                </div>
                              ) : effectiveBpdQrString ? (
                                <QRCode
                                  id="bpd-qris-svg"
                                  size={196}
                                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                  value={effectiveBpdQrString}
                                  viewBox="0 0 256 256"
                                />
                              ) : qrisError ? (
                                <div className="flex flex-col items-center justify-center gap-1.5 p-3 text-center">
                                  <AlertCircle className="w-6 h-6 text-amber-500" />
                                  <span className="text-xs font-semibold text-[var(--text-primary)]">
                                    Gagal memuat QRIS
                                  </span>
                                  <button
                                    type="button"
                                    onClick={fetchBpdQris}
                                    className="mt-1 flex items-center gap-1 px-2.5 py-1 bg-[var(--cream)] hover:bg-[var(--cream-dark)] text-xs font-semibold text-[var(--terracotta)] rounded-lg border border-[var(--cream-dark)]"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                    Coba Lagi
                                  </button>
                                </div>
                              ) : (
                                <div className="text-xs text-gray-400">QRIS Tidak Tersedia</div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Download & Copy Buttons */}
                        {effectiveBpdQrString && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => downloadQrCode("bpd-qris-svg", "QRIS-Produk-BPD")}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[var(--cream-dark)] hover:border-[var(--terracotta)] text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--terracotta)] rounded-lg shadow-2xs transition-all"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Unduh QR Produk
                            </button>
                            <button
                              type="button"
                              onClick={() => copyQrString(effectiveBpdQrString)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[var(--cream-dark)] hover:border-[var(--terracotta)] text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--terracotta)] rounded-lg shadow-2xs transition-all"
                              title="Salin String QRIS"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              Salin Kode
                            </button>
                          </div>
                        )}

                        {/* Nominal Tagihan Produk */}
                        <div className="text-center w-full">
                          <span className="text-[11px] text-[var(--text-muted)] font-semibold block">
                            Nominal Tagihan Produk
                          </span>
                          <span className="text-xl font-extrabold text-[var(--terracotta)] tracking-tight">
                            {requiresShippingPayment ? order.subtotal?.formatted || order.total.formatted : order.total.formatted}
                          </span>
                        </div>

                        {/* Tombol Regenerate QRIS jika expired */}
                        {isBpdExpired && (
                          <div className="w-full p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
                            <span className="text-[11px] text-rose-700 font-medium">
                              QRIS Produk Kadaluarsa
                            </span>
                            <button
                              type="button"
                              disabled={isRegenerating}
                              onClick={() => regenerateQrisMutate({ type: "bpd" })}
                              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                            >
                              {isRegenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                              Generate Ulang QRIS
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* ========================================================= */}
                {/* CARD 2: TAGIHAN ONGKIR (QRIS BANK BPD DIY)                */}
                {/* (Hanya Ditampilkan Jika Produk Barang / Memerlukan Ongkir)*/}
                {/* ========================================================= */}
                {requiresShippingPayment && (
                  <div className={`checkout-card flex flex-col flex-1 transition-all ${isShippingPaid ? "border-emerald-500 bg-emerald-50/20" : ""}`}>
                    <div className="checkout-header-section justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <div className="checkout-header-icon-box" style={{ background: "var(--cream)" }}>
                          <Truck className="w-5 h-5 text-emerald-700" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                            2. Tagihan Ongkir (QRIS Bank BPD DIY)
                          </h3>
                          <p className="text-[11px] text-[var(--text-muted)]">
                            Layanan kurir {order.shipping_service?.toUpperCase()} - {order.shipping_service_type}
                          </p>
                        </div>
                      </div>
                      {/* Status Badge Shipping */}
                      {isShippingPaid ? (
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          LUNAS
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Belum Dibayar
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex flex-col items-center gap-4">
                      {/* Tampilan jika sudah Lunas */}
                      {isShippingPaid ? (
                        <div className="w-full py-8 px-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-center flex flex-col items-center justify-center gap-2">
                          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-1">
                            <CheckCircle2 className="w-8 h-8" />
                          </div>
                          <h4 className="text-base font-extrabold text-emerald-900">
                            Tagihan Ongkos Kirim Telah Lunas
                          </h4>
                          <p className="text-xs text-emerald-700 max-w-xs">
                            Pembayaran ongkir via QRIS Bank BPD DIY telah terverifikasi secara otomatis oleh sistem.
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* QR Code Frame Shipping */}
                          <div className="relative">
                            <div className="relative bg-white border-2 border-emerald-200 rounded-2xl p-4 shadow-md">
                              <div className="w-52 h-52 flex flex-col items-center justify-center overflow-hidden bg-white">
                                {effectiveShippingQrString ? (
                                  <QRCode
                                    id="shipping-bpd-qris-svg"
                                    size={196}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    value={effectiveShippingQrString}
                                    viewBox="0 0 256 256"
                                  />
                                ) : (
                                  <div className="flex flex-col items-center justify-center gap-2 p-3 text-center">
                                    {isRegenerating ? (
                                      <>
                                        <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
                                        <span className="text-xs font-semibold text-[var(--text-primary)]">
                                          Menyiapkan QRIS Bank BPD DIY...
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <AlertCircle className="w-7 h-7 text-amber-500" />
                                        <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
                                          QRIS Ongkir belum siap
                                        </span>
                                        <button
                                          type="button"
                                          disabled={isRegenerating}
                                          onClick={() =>
                                            regenerateQrisMutate(
                                              { type: "kiriminaja" },
                                              {
                                                onSuccess: (res) => {
                                                  if (res?.data?.shipping_qr_string) {
                                                    setShippingQrString(res.data.shipping_qr_string);
                                                  }
                                                },
                                              }
                                            )
                                          }
                                          className="mt-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                                        >
                                          <RefreshCw className="w-3 h-3" />
                                          Muat QRIS Ongkir
                                        </button>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Download & Copy Buttons */}
                          {effectiveShippingQrString && (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => downloadQrCode("shipping-bpd-qris-svg", "QRIS-Ongkir-BPD-DIY")}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[var(--cream-dark)] hover:border-emerald-600 text-[11px] font-semibold text-[var(--text-secondary)] hover:text-emerald-700 rounded-lg shadow-2xs transition-all"
                              >
                                <Download className="w-3.5 h-3.5" />
                                Unduh QR Ongkir
                              </button>
                              <button
                                type="button"
                                onClick={() => copyQrString(effectiveShippingQrString)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[var(--cream-dark)] hover:border-emerald-600 text-[11px] font-semibold text-[var(--text-secondary)] hover:text-emerald-700 rounded-lg shadow-2xs transition-all"
                                title="Salin String QRIS Ongkir"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                Salin Kode
                              </button>
                            </div>
                          )}

                          {/* Nominal Tagihan Ongkir */}
                          <div className="text-center w-full">
                            <span className="text-[11px] text-[var(--text-muted)] font-semibold block">
                              Nominal Ongkos Kirim ({order.shipping_service?.toUpperCase()})
                            </span>
                            <span className="text-xl font-extrabold text-emerald-700 tracking-tight">
                              {order.shipping_cost?.formatted || "Rp 0"}
                            </span>
                          </div>

                          {/* Tombol Regenerate QRIS Ongkir jika expired */}
                          {isShippingExpired && (
                            <div className="w-full p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
                              <span className="text-[11px] text-rose-700 font-medium">
                                QRIS Ongkir Kadaluarsa
                              </span>
                              <button
                                type="button"
                                disabled={isRegenerating}
                                onClick={() =>
                                  regenerateQrisMutate(
                                    { type: "kiriminaja" },
                                    {
                                      onSuccess: (res) => {
                                        if (res?.data?.shipping_qr_string) {
                                          setShippingQrString(res.data.shipping_qr_string);
                                        }
                                      },
                                    }
                                  )
                                }
                                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                              >
                                {isRegenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                                Generate Ulang QRIS
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Kolom Kanan: Ringkasan Total, Countdown & Panduan Pembayaran */}
              <div className="flex flex-col h-full lg:col-span-5 space-y-6">
                {/* Total Ringkasan Pembayaran */}
                <div className="checkout-card flex flex-col">
                  <div className="checkout-header-section">
                    <div className="checkout-header-icon-box">
                      <ShieldCheck className="w-5 h-5 text-[var(--terracotta)]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[var(--text-primary)]">
                        Ringkasan Pembayaran
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">
                        {order.order_number}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs text-[var(--text-secondary)]">
                      <span>Tagihan Produk</span>
                      <span className="font-bold">
                        {requiresShippingPayment ? order.subtotal?.formatted || order.total.formatted : order.total.formatted}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs text-[var(--text-secondary)]">
                      <span>Diskon Produk</span>
                      <span className="font-bold">
                        - 1200
                      </span>
                    </div>

                    {requiresShippingPayment && (
                      <div className="flex justify-between items-center text-xs text-[var(--text-secondary)]">
                        <span>Ongkos Kirim</span>
                        <span className="font-bold text-emerald-700">
                          {order.shipping_cost?.formatted || "Rp 0"}
                        </span>
                      </div>
                    )}

                    <div className="h-[1px] bg-[var(--cream-dark)] my-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[var(--text-primary)]">
                        Total Seluruh Pembayaran
                      </span>
                      <span className="text-lg font-extrabold text-[var(--terracotta)]">
                        {order.total.formatted}
                      </span>
                    </div>

                    {/* Countdown Timer */}
                    <div className="w-full bg-[var(--cream)] border border-[var(--saffron-light)]/40 rounded-xl p-3 flex items-center justify-between shadow-xs mt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-[var(--saffron)]/10 rounded-lg flex items-center justify-center">
                          <Clock className="w-4 h-4 text-[var(--saffron)]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[var(--text-secondary)] text-[11px] font-semibold">
                            Batas Waktu:
                          </span>
                          {bpdExpiryDate && (
                            <span className="text-[10px] text-[var(--text-muted)]">
                              {formatDate(bpdExpiryDate)}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-bold">
                        <CountdownTimer targetDate={bpdExpiryDate} />
                      </span>
                    </div>

                    {/* Tombol Cek Status Pembayaran */}
                    <button
                      type="button"
                      onClick={async () => {
                        toast.info("Memeriksa status pembayaran...");
                        await Promise.all([
                          queryClient.invalidateQueries({ queryKey: ["orders", order.id] }),
                          queryClient.invalidateQueries({ queryKey: ["orders", order.id, "payment-status"] }),
                        ]);
                        if (onConfirmation) {
                          onConfirmation();
                        }
                      }}
                      className="checkout-btn-full mt-4"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Cek Status Pembayaran
                    </button>
                  </div>
                </div>

                {/* Cara Pembayaran */}
                <div className="checkout-card flex flex-col flex-1">
                  <div className="checkout-header-section">
                    <div className="checkout-header-icon-box">
                      <Smartphone className="w-5 h-5 text-[var(--terracotta)]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[var(--text-primary)]">
                        Cara Pembayaran
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">
                        Panduan scan QRIS pembayaran
                      </p>
                    </div>
                  </div>
                  <ol className="p-4 space-y-3.5">
                    {[
                      "Buka aplikasi mobile banking (BPD DIY / Bank Lain) atau e-wallet (GoPay, OVO, Dana, ShopeePay)",
                      requiresShippingPayment
                        ? "Pindai QRIS Tagihan 1 dan selesaikan pembayaran."
                        : "Pindai kode QRIS di samping.",
                      requiresShippingPayment
                        ? "Pindai QRIS Tagihan 2 dan selesaikan pembayaran."
                        : "Selesaikan pembayaran sesuai nominal yang tertera.",
                      "Setelah pembayaran berhasil, status pada layar ini otomatis berubah menjadi LUNAS.",
                      "Sistem akan langsung mengalihkan Anda ke halaman pesanan saat tagihan telah lunas.",
                    ].map((inst, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="flex-shrink-0 w-5 h-5 bg-[var(--cream)] text-[var(--terracotta)] border border-[var(--cream-dark)] rounded-full flex items-center justify-center text-[10px] font-bold">
                          {i + 1}
                        </span>
                        <span className="text-xs text-[var(--text-secondary)] leading-relaxed mt-0.5">
                          {inst}
                        </span>
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
                Pembayaran Tidak Tersedia
              </h3>
              <p className="text-[var(--text-secondary)] text-sm font-medium leading-relaxed">
                Status pesanan Anda saat ini adalah{" "}
                <span className="font-bold text-[var(--terracotta)]">{order.payment_status}</span>.
                Pembayaran QRIS tidak dapat dilakukan untuk status ini.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
