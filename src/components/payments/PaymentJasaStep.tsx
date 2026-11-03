"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Order } from "@/types";
import CountdownTimer from "./CountDownPayment";
import { formatDate } from "@/lib/format-date";
import { CheckoutStep } from "@/components/checkouts/lib";
import { animationVariants } from "@/components/checkouts/CheckoutItemPageStep";
import { getCleanItemNames } from "@/lib/product-helper";
import {
  Clock,
  CheckCircle2,
  Smartphone,
  AlertCircle,
  Loader2,
  RefreshCw,
  Download,
  Copy,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Wrench,
  Store as StoreIcon,
  Phone,
  MapPin,
  FileText,
  MessageSquare,
  Calendar,
  Link as LinkIcon,
  ExternalLink,
  Send,
  XCircle,
  Check,
  Edit3,
} from "lucide-react";
import { StepIndicator } from "@/components/orders/step/StepIndicator";
import { useCallback, useEffect, useMemo, useState } from "react";
import QRCode from "react-qr-code";
import Image from "next/image";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { useOrderPaymentStatus, useRegenerateQris } from "@/features/order/hooks";
import { submitServiceRequest, submitServiceDecision } from "@/features/order/api";
import { useUser } from "@/features/auth/hooks";
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

interface PaymentJasaStepProps {
  order: Order;
  onConfirmation?: () => void;
  currentStep?: CheckoutStep;
}

export default function PaymentJasaStep({
  order: initialOrder,
  onConfirmation,
  currentStep = "payment",
}: PaymentJasaStepProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: userResponse } = useUser();
  const currentUser = userResponse?.data;

  const [order, setOrder] = useState<Order>(initialOrder);

  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  // Form states untuk customer request
  const todayStr = new Date().toISOString().split("T")[0];
  const [deadlineDate, setDeadlineDate] = useState<string>(
    order.service_deadline ? order.service_deadline.split("T")[0] : todayStr
  );
  const [deadlineTime, setDeadlineTime] = useState<string>(
    order.service_deadline && order.service_deadline.includes("T")
      ? order.service_deadline.split("T")[1].slice(0, 5)
      : "17:00"
  );
  const [requestDetails, setRequestDetails] = useState<string>(order.service_request_details || "");
  const [referenceUrl, setReferenceUrl] = useState<string>(order.service_reference_url || "");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isEditingRequest, setIsEditingRequest] = useState(false);

  // Modal tolak pesanan oleh UMKM
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isDeciding, setIsDeciding] = useState(false);

  // Status transaksi layanan jasa
  // 1. pending_submission: Customer belum submit form deadline & request
  // 2. pending_confirmation: Customer sudah submit, menunggu UMKM review & konfirmasi
  // 3. confirmed: UMKM telah mengonfirmasi, QRIS DITAMPILKAN
  // 4. rejected: Pesanan jasa ditolak
  const serviceStatus = useMemo(() => {
    if (order.status === "cancelled" || order.service_status === "rejected") {
      return "rejected";
    }
    if (order.service_status === "confirmed") {
      return "confirmed";
    }
    if (order.service_status === "pending_confirmation" || order.service_deadline) {
      return "pending_confirmation";
    }
    return "pending_submission";
  }, [order.service_status, order.service_deadline, order.status]);

  const isServiceConfirmed = serviceStatus === "confirmed";
  const isServiceRejected = serviceStatus === "rejected";
  const hasSubmittedRequest = serviceStatus === "pending_confirmation" || serviceStatus === "confirmed";

  // Cek apakah user saat ini adalah pemilik toko (UMKM)
  const userCheck = currentUser as unknown as {
    id?: string;
    store?: { id?: string };
    seller?: { id?: string };
  } | null;
  const storeCheck = order.store as unknown as {
    id?: string;
    owner_id?: string;
    owner?: { id?: string; user_id?: string };
    user?: { id?: string };
  } | null;

  const isStoreOwner = Boolean(
    currentUser &&
      (order.store_id === userCheck?.store?.id ||
        order.store?.id === userCheck?.store?.id ||
        order.store?.owner_id === userCheck?.seller?.id ||
        order.store?.owner_id === currentUser.id ||
        storeCheck?.owner?.user_id === currentUser.id ||
        storeCheck?.user?.id === currentUser.id ||
        storeCheck?.owner?.id === currentUser.id)
  );

  // Polling Realtime Status Pembayaran (hanya aktif JIKA sudah dikonfirmasi & belum modal sukses)
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const { data: pollResponse } = useOrderPaymentStatus(order.id, {
    enabled: isServiceConfirmed && !showSuccessModal,
    refetchInterval: 2500,
  });

  const pollData = pollResponse?.data;

  // Status pembayaran BPD
  const isBpdPaid = useMemo(() => {
    if (pollData?.bpd_paid !== undefined) return pollData.bpd_paid;
    if (order.is_order_paid !== undefined) return order.is_order_paid;
    return order.payment_status === "paid";
  }, [pollData?.bpd_paid, order.is_order_paid, order.payment_status]);

  const isFullyPaid = useMemo(() => {
    if (pollData?.is_fully_paid !== undefined) return pollData.is_fully_paid;
    if (order.is_fully_paid !== undefined) return order.is_fully_paid;
    return isBpdPaid;
  }, [pollData?.is_fully_paid, order.is_fully_paid, isBpdPaid]);

  // Trigger auto redirect saat pembayaran lunas
  useEffect(() => {
    if (!isServiceConfirmed) return;

    const isProcessing = pollData?.order_status === "processing" || order.status === "processing";
    const shouldTrigger = pollData?.should_redirect || isFullyPaid || isProcessing;

    if (shouldTrigger && !showSuccessModal) {
      setShowSuccessModal(true);
      setRedirectCountdown(3);

      const interval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            router.replace("/pesanan?status=processing");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isServiceConfirmed, pollData?.should_redirect, pollData?.order_status, isFullyPaid, order.status, showSuccessModal, router]);

  // Regenerate QRIS mutation
  const { mutate: regenerateQrisMutate, isPending: isRegenerating } = useRegenerateQris(order.id);

  // Waktu kadaluarsa BPD
  const now = new Date();
  const bpdExpiryDate = order.payment_expired_at || order.payment_due_at;
  const isBpdExpired = bpdExpiryDate ? new Date(bpdExpiryDate) <= now : false;

  const [qrisData, setQrisData] = useState<QrisResponseData | null>(null);
  const [isLoadingQris, setIsLoadingQris] = useState<boolean>(false);
  const [qrisError, setQrisError] = useState<string | null>(null);

  // QR String (Hanya ada jika pesanan sudah dikonfirmasi penjual)
  const effectiveBpdQrString = isServiceConfirmed
    ? order.qr_string || qrisData?.qr_string || null
    : null;

  // Fetch QRIS hanya jika pesanan jasa sudah dikonfirmasi oleh penjual
  const fetchBpdQris = useCallback(async () => {
    if (!isServiceConfirmed || order.qr_string) return;

    const nmid = order.store?.nmid;
    setIsLoadingQris(true);
    setQrisError(null);

    try {
      const amountVal = order.total?.value ?? Number(order.total?.amount ?? 0);

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
      console.error("[BPD QRIS Jasa Error]:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "Gagal memuat QRIS Bank BPD DIY.";
      setQrisError(errorMessage);
    } finally {
      setIsLoadingQris(false);
    }
  }, [isServiceConfirmed, order.qr_string, order.store?.nmid, order.total, order.order_number]);

  useEffect(() => {
    if (isServiceConfirmed && !order.qr_string && !qrisData?.qr_string) {
      fetchBpdQris();
    }
  }, [isServiceConfirmed, fetchBpdQris, order.qr_string, qrisData?.qr_string]);

  // Handler Customer Submit Request Jasa
  const handleSubmitServiceRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deadlineDate) {
      toast.error("Silakan tentukan tanggal deadline pengerjaan.");
      return;
    }
    if (!deadlineTime) {
      toast.error("Silakan tentukan jam deadline pengerjaan.");
      return;
    }

    const combinedDeadline = `${deadlineDate} ${deadlineTime}:00`;

    setIsSubmittingForm(true);
    try {
      const res = await submitServiceRequest(order.id, {
        service_deadline: combinedDeadline,
        service_request_details: requestDetails.trim() || undefined,
        service_reference_url: referenceUrl.trim() || undefined,
      });

      toast.success(res.message || "Detail request berhasil dikirim ke penyedia jasa!");
      if (res.data) {
        setOrder(res.data);
      }
      setIsEditingRequest(false);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["orders", order.id] }),
        queryClient.invalidateQueries({ queryKey: ["orders"] }),
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan request jasa.";
      toast.error(msg);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Handler UMKM Konfirmasi Pesanan Jasa
  const handleConfirmOrder = async () => {
    if (!confirm("Apakah Anda yakin ingin mengonfirmasi dan menerima pesanan jasa ini?")) {
      return;
    }

    setIsDeciding(true);
    try {
      const res = await submitServiceDecision(order.id, { action: "confirm" });
      toast.success(res.message || "Pesanan jasa berhasil dikonfirmasi! QRIS pembayaran kini aktif.");
      if (res.data) {
        setOrder(res.data);
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["orders", order.id] }),
        queryClient.invalidateQueries({ queryKey: ["orders"] }),
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengonfirmasi pesanan jasa.";
      toast.error(msg);
    } finally {
      setIsDeciding(false);
    }
  };

  // Handler UMKM Tolak Pesanan Jasa
  const handleRejectOrder = async () => {
    setIsDeciding(true);
    try {
      const res = await submitServiceDecision(order.id, {
        action: "reject",
        rejection_reason: rejectionReason.trim() || "Pesanan jasa ditolak oleh penyedia jasa.",
      });

      toast.success(res.message || "Pesanan jasa telah ditolak.");
      setShowRejectModal(false);
      if (res.data) {
        setOrder(res.data);
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["orders", order.id] }),
        queryClient.invalidateQueries({ queryKey: ["orders"] }),
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menolak pesanan jasa.";
      toast.error(msg);
    } finally {
      setIsDeciding(false);
    }
  };

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
        downloadLink.download = `${filenamePrefix}-${order.order_number || "qris-jasa"}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
        toast.success("QRIS Layanan Jasa berhasil diunduh!");
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

  // WhatsApp Hubungi Penyedia Jasa
  const storePhone =
    order.store?.phone ||
    order.store?.user?.phone_number ||
    (order.store as unknown as { owner?: { phone_number?: string } })?.owner?.phone_number;

  const handleContactStore = () => {
    if (!storePhone) {
      toast.error("Nomor kontak penyedia jasa belum tersedia.");
      return;
    }
    const cleanPhone = storePhone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone;
    const itemNames = order.items?.map((it) => it.product_name).join(", ") || "Layanan Jasa";
    const msg = `Halo ${order.store?.name || "Penyedia Jasa"}, saya memesan layanan *${itemNames}* dengan nomor pesanan *${order.order_number}* di Sleman Mart.`;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        variants={animationVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
      >
        {/* Modal Popup Sukses Pembayaran & Auto-Redirect */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center border border-emerald-100 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-2">
                Pembayaran Jasa Diterima
              </span>
              <h3 className="text-xl font-extrabold text-[var(--text-primary)]">
                Pembayaran Berhasil Diverifikasi!
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                Seluruh tagihan pesanan layanan jasa Anda telah diverifikasi lunas secara otomatis oleh sistem Bank BPD DIY.
              </p>

              {redirectCountdown !== null && (
                <div className="my-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-emerald-800">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>
                    Mengalihkan ke halaman pesanan dalam{" "}
                    <span className="text-sm font-black text-emerald-900">{redirectCountdown}</span> detik...
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={() => router.replace("/pesanan?status=processing")}
                className="mt-2 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Lihat Pesanan Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Modal Tolak Pesanan oleh UMKM */}
        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-rose-100 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Tolak Pesanan Jasa</h3>
                  <p className="text-xs text-slate-500">Berikan alasan penolakan pesanan kepada pembeli</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 block">Alasan Penolakan</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Contoh: Jadwal penuh pada tanggal tersebut, lingkup request di luar spesialisasi, dsb..."
                  rows={3}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  disabled={isDeciding}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleRejectOrder}
                  disabled={isDeciding}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  {isDeciding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>Konfirmasi Tolak</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div id="paymentJasaSection" className="mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Kolom Kiri: Form Request / Review UMKM / QRIS (7 Kolom) */}
            <div className="flex flex-col h-full lg:col-span-7 space-y-6">
              <StepIndicator currentStep={currentStep} />

              {/* Banner Transaksi Jasa & Status Alur */}
              <div
                className="p-4 rounded-2xl flex items-center justify-between shadow-xs border"
                style={{
                  background: isServiceRejected
                    ? "linear-gradient(135deg, #FFF1F2 0%, #FFFFFF 100%)"
                    : isServiceConfirmed
                    ? "linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 100%)"
                    : "linear-gradient(135deg, #F3E5F5 0%, #FFFFFF 100%)",
                  borderColor: isServiceRejected ? "#FECDD3" : isServiceConfirmed ? "#A7F3D0" : "#E1BEE7",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: isServiceRejected ? "#E11D48" : isServiceConfirmed ? "#059669" : "#7B1FA2",
                      color: "white",
                    }}
                  >
                    {isServiceRejected ? (
                      <XCircle className="w-5 h-5" />
                    ) : isServiceConfirmed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Wrench className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                      Transaksi Layanan Jasa
                      <span className="tipe-jasa-sm">🛠️ Jasa</span>
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {isServiceRejected
                        ? "Pesanan jasa ini telah ditolak oleh penyedia jasa."
                        : isServiceConfirmed
                        ? "Pesanan telah dikonfirmasi penjual • Silakan lakukan pembayaran QRIS"
                        : hasSubmittedRequest
                        ? "Menunggu review & konfirmasi pesanan oleh mitra penyedia jasa (UMKM)"
                        : "Lengkapi detail deadline & spesifikasi request pesanan Anda"}
                    </p>
                  </div>
                </div>

                <div>
                  {isServiceRejected ? (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      DITOLAK
                    </span>
                  ) : isBpdPaid ? (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      LUNAS
                    </span>
                  ) : isServiceConfirmed ? (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      Siap Bayar QRIS
                    </span>
                  ) : hasSubmittedRequest ? (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      Menunggu Konfirmasi
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1">
                      <Edit3 className="w-3 h-3 text-purple-600" />
                      Isi Detail Request
                    </span>
                  )}
                </div>
              </div>

              {/* ========================================================= */}
              {/* KONDISI 1: FORM PENGISIAN REQUEST JASA OLEH CUSTOMER     */}
              {/* ========================================================= */}
              {(!hasSubmittedRequest || isEditingRequest) && !isServiceRejected && (
                <div className="checkout-card flex flex-col">
                  <div className="checkout-header-section justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="checkout-header-icon-box" style={{ background: "#F3E5F5" }}>
                        <Edit3 className="w-5 h-5 text-[#7B1FA2]" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[var(--text-primary)]">
                          Form Detail Request &amp; Deadline Jasa
                        </h3>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          Lengkapi informasi kebutuhan layanan sebelum pesanan dikonfirmasi oleh penyedia jasa
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitServiceRequest} className="p-5 space-y-4">
                    {/* 1. Tanggal dan Jam Deadline */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#7B1FA2]" />
                        <span>Tanggal dan Jam Deadline Target</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Tentukan batas waktu pengerjaan atau jadwal layanan yang Anda inginkan.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Tanggal Deadline
                          </label>
                          <input
                            type="date"
                            min={todayStr}
                            value={deadlineDate}
                            onChange={(e) => setDeadlineDate(e.target.value)}
                            required
                            className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1FA2]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Jam Deadline
                          </label>
                          <input
                            type="time"
                            value={deadlineTime}
                            onChange={(e) => setDeadlineTime(e.target.value)}
                            required
                            className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1FA2]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. Detail Request (Opsional) */}
                    <div className="space-y-1.5 pt-2 border-t border-[var(--cream-dark)]">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-[#7B1FA2]" />
                        <span>Detail Request Layanan</span>
                        <span className="text-[10px] font-normal text-slate-400">(Opsional)</span>
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Tuliskan spesifikasi pengerjaan, instruksi khusus, atau catatan penting untuk penyedia jasa.
                      </p>
                      <textarea
                        value={requestDetails}
                        onChange={(e) => setRequestDetails(e.target.value)}
                        placeholder="Contoh: Tolong datang tepat pukul 10.00 WIB membawa peralatan cuci AC, mohon cek juga saluran pembuangan air..."
                        rows={3}
                        className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1FA2] leading-relaxed"
                      />
                    </div>

                    {/* 3. Referensi Tautan (Opsional) */}
                    <div className="space-y-1.5 pt-2 border-t border-[var(--cream-dark)]">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <LinkIcon className="w-4 h-4 text-[#7B1FA2]" />
                        <span>Referensi Tautan (Link / URL)</span>
                        <span className="text-[10px] font-normal text-slate-400">(Opsional)</span>
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Sertakan link Google Drive, Figma, Canva, atau tautan contoh acuan kerja jika ada.
                      </p>
                      <input
                        type="url"
                        value={referenceUrl}
                        onChange={(e) => setReferenceUrl(e.target.value)}
                        placeholder="https://drive.google.com/... atau tautan referensi lainnya"
                        className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1FA2]"
                      />
                    </div>

                    <div className="pt-3 flex items-center justify-end gap-2 border-t border-[var(--cream-dark)]">
                      {isEditingRequest && (
                        <button
                          type="button"
                          onClick={() => setIsEditingRequest(false)}
                          className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                          Batal
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={isSubmittingForm}
                        className="px-5 py-2.5 text-xs font-bold text-white rounded-xl flex items-center gap-2 shadow-xs transition-all"
                        style={{ background: "linear-gradient(135deg, #7B1FA2 0%, #9C27B0 100%)" }}
                      >
                        {isSubmittingForm ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        <span>Kirim Detail Request ke Penyedia Jasa</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ========================================================= */}
              {/* KONDISI 2: DETAIL REQUEST TELAH DISUBMIT & PANEL REVIEW   */}
              {/* ========================================================= */}
              {hasSubmittedRequest && !isEditingRequest && !isServiceRejected && (
                <div className="checkout-card flex flex-col">
                  <div className="checkout-header-section justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="checkout-header-icon-box" style={{ background: "#F3E5F5" }}>
                        <FileText className="w-5 h-5 text-[#7B1FA2]" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[var(--text-primary)]">
                          Detail Permintaan Layanan Jasa
                        </h3>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          Data deadline dan request yang telah diajukan kepada penyedia jasa
                        </p>
                      </div>
                    </div>

                    {!isServiceConfirmed && (
                      <button
                        type="button"
                        onClick={() => setIsEditingRequest(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-[#7B1FA2] bg-[#F3E5F5] hover:bg-[#E1BEE7] rounded-lg transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Ubah Request</span>
                      </button>
                    )}
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Deadline Target */}
                      <div className="p-3 bg-[var(--cream)]/60 border border-[var(--cream-dark)] rounded-xl">
                        <span className="text-[11px] text-[var(--text-muted)] font-semibold flex items-center gap-1 mb-1">
                          <Calendar className="w-3.5 h-3.5 text-[#7B1FA2]" />
                          Deadline Target Layanan
                        </span>
                        <p className="font-extrabold text-[var(--text-primary)] text-sm">
                          {order.service_deadline ? formatDate(order.service_deadline) : `${deadlineDate} ${deadlineTime}`}
                        </p>
                      </div>

                      {/* Status Konfirmasi */}
                      <div className="p-3 bg-[var(--cream)]/60 border border-[var(--cream-dark)] rounded-xl">
                        <span className="text-[11px] text-[var(--text-muted)] font-semibold flex items-center gap-1 mb-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#7B1FA2]" />
                          Status Konfirmasi Jasa
                        </span>
                        <p className="font-extrabold text-sm flex items-center gap-1.5">
                          {isServiceConfirmed ? (
                            <span className="text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              Dikonfirmasi Penyedia Jasa
                            </span>
                          ) : (
                            <span className="text-amber-700 flex items-center gap-1">
                              <Clock className="w-4 h-4 text-amber-600" />
                              Menunggu Konfirmasi UMKM
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Detail Request */}
                    <div className="p-3 bg-white border border-[var(--cream-dark)] rounded-xl text-xs space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Detail Request / Catatan Pengerjaan
                      </span>
                      <p className="text-slate-800 leading-relaxed whitespace-pre-line">
                        {order.service_request_details || requestDetails || "Tidak ada detail tambahan yang disertakan."}
                      </p>
                    </div>

                    {/* Referensi Tautan */}
                    {(order.service_reference_url || referenceUrl) && (
                      <div className="p-3 bg-white border border-[var(--cream-dark)] rounded-xl text-xs flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                            Referensi Tautan
                          </span>
                          <p className="text-[#7B1FA2] truncate font-medium mt-0.5">
                            {order.service_reference_url || referenceUrl}
                          </p>
                        </div>
                        <a
                          href={order.service_reference_url || referenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#F3E5F5] hover:bg-[#E1BEE7] text-[#7B1FA2] rounded-lg text-xs font-bold inline-flex items-center gap-1 flex-shrink-0 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Buka Tautan</span>
                        </a>
                      </div>
                    )}

                    {/* ======================================================= */}
                    {/* PANEL REVIEW & AKSI KONFIRMASI / TOLAK OLEH UMKM        */}
                    {/* ======================================================= */}
                    {isStoreOwner && !isServiceConfirmed && (
                      <div
                        className="mt-4 p-4 rounded-2xl border flex flex-col gap-3 shadow-xs"
                        style={{
                          background: "linear-gradient(135deg, #FDF4FF 0%, #FAF5FF 100%)",
                          borderColor: "#E9D5FF",
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#7B1FA2] flex items-center justify-center flex-shrink-0">
                            <StoreIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-purple-950">
                              Review &amp; Konfirmasi Pesanan (Panel Mitra UMKM)
                            </h4>
                            <p className="text-[11px] text-purple-700">
                              Penyedia jasa dapat meninjau request di atas dan menentukan konfirmasi atau penolakan.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-purple-200">
                          <button
                            type="button"
                            onClick={() => setShowRejectModal(true)}
                            disabled={isDeciding}
                            className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Tolak Pesanan</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleConfirmOrder}
                            disabled={isDeciding}
                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs"
                          >
                            {isDeciding ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            <span>Konfirmasi &amp; Terima Pesanan</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* KONDISI 3: PESANAN DITOLAK                              */}
              {/* ========================================================= */}
              {isServiceRejected && (
                <div className="checkout-card p-6 border-rose-200 bg-rose-50/40 text-center">
                  <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <XCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-extrabold text-rose-950">Pesanan Jasa Ini Telah Ditolak</h3>
                  <p className="text-xs text-rose-700 mt-1 max-w-md mx-auto">
                    Alasan: &ldquo;{order.service_rejection_reason || order.cancellation_reason || "Penyedia jasa belum dapat menerima pesanan ini."}&rdquo;
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => router.push("/sleman-jasa")}
                      className="btn btn-primary btn-sm"
                    >
                      Cari Layanan Jasa Lainnya
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/pesanan")}
                      className="btn btn-secondary btn-sm"
                    >
                      Lihat Daftar Pesanan
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* KONDISI 4: SECTION QRIS (HANYA MUNCUL SETELAH KONFIRMASI) */}
              {/* ========================================================= */}
              {isServiceConfirmed && (
                <div className={`checkout-card flex flex-col transition-all ${isBpdPaid ? "border-emerald-500 bg-emerald-50/20" : ""}`}>
                  <div className="checkout-header-section justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="checkout-header-icon-box" style={{ background: "#F3E5F5" }}>
                        <Sparkles className="w-5 h-5 text-[#7B1FA2]" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                          Tagihan Layanan Jasa
                        </h3>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          Pesanan telah disetujui • Selesaikan pembayaran melalui QRIS Dinamis Bank BPD DIY
                        </p>
                      </div>
                    </div>

                    {isBpdPaid ? (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        LUNAS
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Menunggu Pembayaran
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex flex-col items-center gap-4">
                    {isBpdPaid ? (
                      <div className="w-full py-8 px-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-center flex flex-col items-center justify-center gap-2">
                        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-1">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h4 className="text-base font-extrabold text-emerald-900">
                          Tagihan Layanan Jasa Telah Lunas
                        </h4>
                        <p className="text-xs text-emerald-700 max-w-xs">
                          Pembayaran Anda telah terverifikasi secara instan. Penyedia jasa akan segera mengerjakan layanan sesuai kesepakatan deadline.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Frame QR Code BPD */}
                        <div className="relative">
                          <div className="relative bg-white border-2 border-[var(--cream-dark)] rounded-2xl p-4 shadow-md">
                            <div className="w-52 h-52 flex flex-col items-center justify-center overflow-hidden bg-white">
                              {isLoadingQris ? (
                                <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                                  <Loader2 className="w-7 h-7 animate-spin text-[#7B1FA2]" />
                                  <span className="text-xs font-semibold text-[var(--text-primary)]">
                                    Menyiapkan QRIS BPD DIY...
                                  </span>
                                </div>
                              ) : effectiveBpdQrString ? (
                                <QRCode
                                  id="jasa-bpd-qris-svg"
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
                              onClick={() => downloadQrCode("jasa-bpd-qris-svg", "QRIS-Jasa-BPD")}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[var(--cream-dark)] hover:border-[#7B1FA2] text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[#7B1FA2] rounded-lg shadow-2xs transition-all"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Unduh QR Jasa
                            </button>
                            <button
                              type="button"
                              onClick={() => copyQrString(effectiveBpdQrString)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[var(--cream-dark)] hover:border-[#7B1FA2] text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[#7B1FA2] rounded-lg shadow-2xs transition-all"
                              title="Salin String QRIS"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              Salin Kode
                            </button>
                          </div>
                        )}

                        {/* Nominal Tagihan Jasa */}
                        <div className="text-center w-full">
                          <span className="text-[11px] text-[var(--text-muted)] font-semibold block">
                            Nominal Total Tagihan Jasa
                          </span>
                          <span className="text-2xl font-extrabold text-[#7B1FA2] tracking-tight">
                            {order.total?.formatted || "Rp 0"}
                          </span>
                        </div>

                        {/* Tombol Regenerate QRIS jika expired */}
                        {isBpdExpired && (
                          <div className="w-full p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
                            <span className="text-[11px] text-rose-700 font-medium">
                              QRIS Layanan Jasa Kadaluarsa
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
              )}

              {/* CARD: DETAIL LAYANAN & PENYEDIA JASA */}
              <div className="checkout-card flex flex-col">
                <div className="checkout-header-section justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="checkout-header-icon-box" style={{ background: "#F3E5F5" }}>
                      <StoreIcon className="w-5 h-5 text-[#7B1FA2]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[var(--text-primary)]">
                        Detail Layanan &amp; Penyedia
                      </h3>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Informasi layanan yang dipesan dan kontak mitra penyedia
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Item Layanan List */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block">
                      Item Jasa ({order.items?.length || 0})
                    </span>
                    {order.items?.map((item, idx) => {
                      const { productName, variantName } = getCleanItemNames(
                        item.product_name,
                        item.variant_name
                      );
                      const imgSrc =
                        item.product?.thumbnail?.media_url ||
                        item.product?.media?.[0]?.media_url ||
                        "/assets/no-image.jpg";

                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-[var(--cream)]/40 border border-[var(--cream-dark)] rounded-xl"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white border border-[var(--cream-dark)] flex-shrink-0">
                            <Image
                              src={imgSrc}
                              alt={productName}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-[var(--text-primary)] truncate">
                              {productName}
                            </h5>
                            {variantName && (
                              <p className="text-[11px] text-[var(--text-muted)] truncate">
                                Pilihan: {variantName}
                              </p>
                            )}
                            <p className="text-[11px] text-[var(--text-secondary)] font-medium mt-0.5">
                              {item.quantity}x • {item.subtotal?.formatted || item.product_price?.formatted}
                            </p>
                          </div>
                          <span className="tipe-jasa-sm flex-shrink-0">
                            Jasa
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Informasi Toko & Kontak */}
                  <div className="pt-3 border-t border-[var(--cream-dark)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] text-[var(--text-muted)] block">
                        Penyedia Jasa (Mitra UMKM Sleman)
                      </span>
                      <h4 className="text-sm font-extrabold text-[var(--text-primary)]">
                        {order.store?.name || "UMKM Sleman"}
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#7B1FA2]" />
                        {order.store?.district?.name || order.store?.address || "Kabupaten Sleman"}
                      </p>
                    </div>

                    {storePhone && (
                      <button
                        type="button"
                        onClick={handleContactStore}
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Hubungi WhatsApp
                      </button>
                    )}
                  </div>

                  {/* Info Pemesan & Alamat */}
                  <div className="pt-3 border-t border-[var(--cream-dark)] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white border border-[var(--cream-dark)] rounded-xl">
                      <span className="text-[11px] text-[var(--text-muted)] font-semibold block mb-1">
                        Nama Pemesan Layanan
                      </span>
                      <p className="font-bold text-[var(--text-primary)]">
                        {order.shipping_recipient_name || order.customer?.name || "-"}
                      </p>
                      <p className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3 text-[var(--text-muted)]" />
                        {order.shipping_recipient_phone_number || order.customer?.phone_number || "-"}
                      </p>
                    </div>

                    <div className="p-3 bg-white border border-[var(--cream-dark)] rounded-xl">
                      <span className="text-[11px] text-[var(--text-muted)] font-semibold block mb-1">
                        Alamat / Lokasi Pemesan
                      </span>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                        {order.shipping_address_line || "Sleman, D.I. Yogyakarta"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Ringkasan Total & Panduan (5 Kolom) */}
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
                    <span>Tagihan Layanan Jasa</span>
                    <span className="font-bold">
                      {order.subtotal?.formatted || order.total.formatted}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-[var(--text-secondary)]">
                    <span>Biaya Pengiriman</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Rp 0 (Bebas Ongkir)
                    </span>
                  </div>

                  <div className="h-[1px] bg-[var(--cream-dark)] my-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[var(--text-primary)]">
                      Total Seluruh Pembayaran
                    </span>
                    <span className="text-lg font-extrabold text-[#7B1FA2]">
                      {order.total.formatted}
                    </span>
                  </div>

                  {/* Status Box Samping */}
                  <div
                    className="p-3 rounded-xl border text-xs"
                    style={{
                      background: isServiceRejected
                        ? "#FFF1F2"
                        : isServiceConfirmed
                        ? "#ECFDF5"
                        : "#FDF4FF",
                      borderColor: isServiceRejected
                        ? "#FECDD3"
                        : isServiceConfirmed
                        ? "#A7F3D0"
                        : "#E9D5FF",
                    }}
                  >
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Status Alur Transaksi:
                    </span>
                    <p
                      className="font-bold"
                      style={{
                        color: isServiceRejected
                          ? "#E11D48"
                          : isServiceConfirmed
                          ? "#059669"
                          : "#7B1FA2",
                      }}
                    >
                      {isServiceRejected
                        ? "✗ Pesanan Jasa Ditolak"
                        : isBpdPaid
                        ? "✓ Tagihan Lunas Terverifikasi"
                        : isServiceConfirmed
                        ? "✓ Dikonfirmasi • Menunggu Pembayaran"
                        : hasSubmittedRequest
                        ? "⏳ Menunggu Konfirmasi Penyedia Jasa"
                        : "📝 Menunggu Pengisian Form Request"}
                    </p>
                  </div>

                  {/* Countdown Timer (HANYA AKTIF JIKA SUDAH KONFIRMASI) */}
                  {isServiceConfirmed && (
                    <div className="w-full bg-[var(--cream)] border border-[var(--saffron-light)]/40 rounded-xl p-3 flex items-center justify-between shadow-xs mt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-[var(--saffron)]/10 rounded-lg flex items-center justify-center">
                          <Clock className="w-4 h-4 text-[var(--saffron)]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[var(--text-secondary)] text-[11px] font-semibold">
                            Batas Waktu Bayar:
                          </span>
                          {bpdExpiryDate && (
                            <span className="text-[10px] text-[var(--text-muted)]">
                              {formatDate(bpdExpiryDate)}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-bold">
                        <CountdownTimer targetDate={bpdExpiryDate || new Date().toISOString()} />
                      </span>
                    </div>
                  )}

                  {/* Tombol Cek Status Pembayaran (Hanya jika sudah dikonfirmasi) */}
                  {isServiceConfirmed && (
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
                  )}
                </div>
              </div>

              {/* Panduan Alur Transaksi Jasa */}
              <div className="checkout-card flex flex-col flex-1">
                <div className="checkout-header-section">
                  <div className="checkout-header-icon-box">
                    <Smartphone className="w-5 h-5 text-[var(--terracotta)]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text-primary)]">
                      Alur Transaksi Jasa
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Langkah pemesanan &amp; pembayaran layanan
                    </p>
                  </div>
                </div>
                <ol className="p-4 space-y-3.5">
                  {[
                    "Isi form detail request, tanggal dan jam deadline pengerjaan.",
                    "Mitra penyedia jasa (UMKM) mereview kesiapan jadwal & spesifikasi request.",
                    "Setelah disetujui penjual, kode QRIS BPD DIY otomatis muncul pada halaman ini.",
                    "Customer menyelesaikan pembayaran via Scan QRIS sebelum batas waktu berakhir.",
                    "Pembayaran terverifikasi otomatis, dan penyedia jasa segera mengerjakan layanan Anda.",
                  ].map((inst, i) => {
                    const isStepCurrent =
                      (i === 0 && !hasSubmittedRequest) ||
                      (i === 1 && hasSubmittedRequest && !isServiceConfirmed) ||
                      (i === 2 && isServiceConfirmed && !isBpdPaid) ||
                      (i === 3 && isServiceConfirmed && !isBpdPaid) ||
                      (i === 4 && isBpdPaid);

                    return (
                      <li key={i} className="flex items-start gap-2.5">
                        <span
                          className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                            isStepCurrent
                              ? "bg-[#7B1FA2] text-white border-[#7B1FA2]"
                              : "bg-[#F3E5F5] text-[#7B1FA2] border-[#E1BEE7]"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span className={`text-xs leading-relaxed mt-0.5 ${isStepCurrent ? "font-bold text-purple-950" : "text-[var(--text-secondary)]"}`}>
                          {inst}
                        </span>
                      </li>
                    );
                  })}
                </ol>

                <div className="p-4 pt-0">
                  <div className="p-3 bg-[var(--cream)] rounded-xl border border-[var(--cream-dark)] flex items-center gap-2.5 text-[11px] text-[var(--text-secondary)]">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>
                      Jaminan keamanan transaksi resmi Sleman Mart &amp; QRIS Bank BPD DIY.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
