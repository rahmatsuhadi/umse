"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Order, CodNegotiation } from "@/types";
import { CheckoutStep } from "@/components/checkouts/lib";
import { StepIndicator } from "@/components/orders/step/StepIndicator";
import { formatDate } from "@/lib/format-date";
import { toast } from "sonner";
import { getCodNegotiations, submitCodNegotiation } from "@/features/order/api";
import {
  Banknote,
  CheckCircle2,
  Package,
  MapPin,
  Store as StoreIcon,
  Phone,
  ArrowRight,
  Info,
  Clock,
  ShieldCheck,
  Home,
  Calendar,
  Send,
  XCircle,
  RotateCcw,
  AlertCircle,
  Truck,
  MessageSquare,
} from "lucide-react";

interface PaymentCodStepProps {
  order: Order;
  currentStep?: CheckoutStep;
}

export default function PaymentCodStep({ order: initialOrder, currentStep = "payment" }: PaymentCodStepProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order>(initialOrder);
  const [negotiations, setNegotiations] = useState<CodNegotiation[]>(initialOrder.cod_negotiations || []);
  const [latestNegotiation, setLatestNegotiation] = useState<CodNegotiation | null>(
    initialOrder.latest_cod_negotiation || (initialOrder.cod_negotiations?.length ? initialOrder.cod_negotiations[initialOrder.cod_negotiations.length - 1] : null)
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNegoForm, setShowNegoForm] = useState(false);

  // Form states
  const todayStr = new Date().toISOString().split("T")[0];
  const [deliveryDate, setDeliveryDate] = useState(todayStr);
  const [deliveryTime, setDeliveryTime] = useState("10:00");
  const [shippingCost, setShippingCost] = useState<string>("10000");
  const [notes, setNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Fetch negotiations
  const fetchNegotiations = async () => {
    setIsLoading(true);
    try {
      const res = await getCodNegotiations(order.id);
      if (res.status && Array.isArray(res.data)) {
        setNegotiations(res.data);
        setLatestNegotiation(res.latest || (res.data.length ? res.data[res.data.length - 1] : null));
      }
    } catch {
      // Fallback to order's initial relations
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNegotiations();
  }, [order.id]);

  const recipientName = order.shipping_recipient_name || order.customer?.name || "-";
  const recipientPhone = order.shipping_recipient_phone_number || order.customer?.phone_number || "-";
  const shippingAddress = order.shipping_address_line || "-";
  const storePhone = order.store?.phone || order.store?.user?.phone_number || (order.store as any)?.owner?.phone_number;

  // Cek apakah giliran pembeli
  const isOrderCancelled = order.status === "cancelled";
  const isAgreed = latestNegotiation?.status === "diterima";
  const isRejected = latestNegotiation?.status === "ditolak" || isOrderCancelled;
  const isPendingBuyerResponse = latestNegotiation?.status === "dinego" && latestNegotiation?.negotiator_type === "seller";
  const isWaitingSeller = latestNegotiation?.status === "dinego" && latestNegotiation?.negotiator_type === "customer";
  const hasNoNegotiation = !latestNegotiation && !isOrderCancelled;

  // Handle Submit Nego (First round or counter-nego)
  const handleSubmitNego = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryDate) {
      toast.error("Silakan pilih tanggal pengantaran.");
      return;
    }
    if (!deliveryTime) {
      toast.error("Silakan tentukan jam pengantaran.");
      return;
    }
    const costNum = parseFloat(shippingCost);
    if (isNaN(costNum) || costNum < 0) {
      toast.error("Ongkos kirim tidak valid.");
      return;
    }

    const proposedDateTime = `${deliveryDate} ${deliveryTime}:00`;

    setIsSubmitting(true);
    try {
      const res = await submitCodNegotiation(order.id, {
        action: "nego",
        proposed_delivery_at: proposedDateTime,
        proposed_shipping_cost: costNum,
        notes: notes.trim() || undefined,
      });

      toast.success(res.message || "Pengajuan negosiasi berhasil dikirim!");
      setShowNegoForm(false);
      setNotes("");
      if (res.order) {
        setOrder(res.order);
      }
      await fetchNegotiations();
    } catch (err: any) {
      toast.error(err.message || "Gagal mengirim pengajuan negosiasi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Accept
  const handleAccept = async () => {
    if (!confirm("Apakah Anda yakin menyetujui jadwal dan ongkos kirim yang diajukan penjual?")) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitCodNegotiation(order.id, { action: "accept" });
      toast.success(res.message || "Negosiasi COD berhasil disepakati!");
      if (res.order) {
        setOrder(res.order);
      }
      await fetchNegotiations();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyetujui negosiasi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Reject
  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      const res = await submitCodNegotiation(order.id, {
        action: "reject",
        notes: rejectReason.trim() || "Ditolak oleh pembeli",
      });
      toast.success(res.message || "Negosiasi ditolak dan pesanan dibatalkan.");
      setShowRejectModal(false);
      if (res.order) {
        setOrder(res.order);
      }
      await fetchNegotiations();
    } catch (err: any) {
      toast.error(err.message || "Gagal menolak negosiasi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRupiah = (val: any) => {
    if (!val && val !== 0) return "Rp 0";
    if (typeof val === "object" && val?.formatted) return val.formatted;
    const num = typeof val === "number" ? val : parseFloat(val);
    return isNaN(num) ? "Rp 0" : `Rp ${num.toLocaleString("id-ID")}`;
  };

  return (
    <div className="space-y-6">
      <StepIndicator currentStep={currentStep} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Negosiasi COD & Detail Pesanan */}
        <div className="lg:col-span-7 space-y-6">
          {/* Banner Status Berhasil Dibuat */}
          <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-start gap-3.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 flex-shrink-0 mt-0.5">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold text-emerald-950">
                  Pesanan COD Dibuat
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                  Cash on Delivery
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                Pesanan Anda menggunakan metode COD. Silakan sepakati tanggal, jam pengantaran, dan nominal ongkos kirim bersama penjual sebelum pesanan diproses.
              </p>
            </div>
          </div>

          {/* ========================================================
              MODUL UTAMA NEGOSIASI COD
              ======================================================== */}
          <div className="checkout-card border-amber-300/80 shadow-sm overflow-hidden">
            <div className="checkout-header-section justify-between flex-wrap gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
              <div className="flex items-center gap-3">
                <div className="checkout-header-icon-box bg-amber-500 text-white">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Negosiasi Jadwal & Ongkir COD
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Kesepakatan waktu pengantaran dan biaya kirim antara Anda & Penjual
                  </p>
                </div>
              </div>
              <div>
                {isAgreed ? (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Disepakati
                  </span>
                ) : isRejected ? (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-800 border border-red-300 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-red-600" />
                    Dibatalkan / Ditolak
                  </span>
                ) : isWaitingSeller ? (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 animate-pulse">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    Menunggu Penjual
                  </span>
                ) : isPendingBuyerResponse ? (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1.5 animate-pulse">
                    <AlertCircle className="w-3.5 h-3.5 text-blue-700" />
                    Giliran Anda Merespons
                  </span>
                ) : (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-900 border border-orange-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-orange-700" />
                    Belum Ditentukan
                  </span>
                )}
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* STATUS 1: SUDAH SELESAI & DISEPAKATI */}
              {isAgreed && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Kesepakatan COD Berhasil Disepakati!</span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Jadwal pengantaran dan biaya ongkir telah disetujui bersama. Penjual sedang memproses barang untuk dikirim sesuai jadwal.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                      <span className="text-gray-500 block text-[11px]">Jadwal Pengantaran:</span>
                      <strong className="text-gray-900">
                        {latestNegotiation?.proposed_delivery_at_formatted || "-"}
                      </strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                      <span className="text-gray-500 block text-[11px]">Ongkos Kirim Disepakati:</span>
                      <strong className="text-emerald-700">
                        {formatRupiah(latestNegotiation?.proposed_shipping_cost)}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* STATUS 2: DITOLAK / DIBATALKAN */}
              {isRejected && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span>Negosiasi COD Tidak Tercapai (Pesanan Dibatalkan)</span>
                  </div>
                  <p className="text-xs text-red-700 leading-relaxed">
                    Pesanan COD ini telah dibatalkan karena salah satu pihak menolak negosiasi waktu atau ongkos kirim.
                  </p>
                  {latestNegotiation?.notes && (
                    <div className="text-xs bg-white p-2.5 rounded-lg border border-red-100 text-gray-700">
                      <span className="text-gray-500 block text-[11px]">Alasan / Catatan:</span>
                      &ldquo;{latestNegotiation.notes}&rdquo;
                    </div>
                  )}
                </div>
              )}

              {/* STATUS 3: MENUNGGU PENJUAL MERESPONS */}
              {isWaitingSeller && !isAgreed && !isRejected && (
                <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    </span>
                    <span>Pengajuan Anda Sedang Ditinjau Penjual</span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    Anda telah mengirimkan pengajuan jadwal dan tawaran ongkir. Mohon tunggu respon penjual (menerima, nego balik, atau menolak).
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-amber-100">
                      <span className="text-gray-500 block text-[11px]">Jadwal Diajukan:</span>
                      <strong className="text-gray-900">
                        {latestNegotiation?.proposed_delivery_at_formatted || "-"}
                      </strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-amber-100">
                      <span className="text-gray-500 block text-[11px]">Tawaran Ongkir:</span>
                      <strong className="text-amber-800">
                        {formatRupiah(latestNegotiation?.proposed_shipping_cost)}
                      </strong>
                    </div>
                  </div>
                  {latestNegotiation?.notes && (
                    <div className="text-xs bg-white p-2.5 rounded-lg border border-amber-100 text-gray-700 italic">
                      Catatan Anda: &ldquo;{latestNegotiation.notes}&rdquo;
                    </div>
                  )}
                </div>
              )}

              {/* STATUS 4: GILIRAN PEMBELI (PENJUAL NEGO BALIK) */}
              {isPendingBuyerResponse && !isAgreed && !isRejected && (
                <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-xl space-y-3.5 shadow-xs">
                  <div className="flex items-center gap-2 text-blue-950 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span>Penjual Mengajukan Negosiasi Balik!</span>
                  </div>
                  <p className="text-xs text-blue-900 leading-relaxed">
                    Penjual mengusulkan jadwal dan biaya ongkir baru di bawah ini. Silakan tentukan aksi Anda:
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-blue-200">
                      <span className="text-gray-500 block text-[11px]">Jadwal Usulan Toko:</span>
                      <strong className="text-gray-900 text-sm">
                        {latestNegotiation?.proposed_delivery_at_formatted || "-"}
                      </strong>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-blue-200">
                      <span className="text-gray-500 block text-[11px]">Ongkir Usulan Toko:</span>
                      <strong className="text-blue-700 text-sm">
                        {formatRupiah(latestNegotiation?.proposed_shipping_cost)}
                      </strong>
                    </div>
                  </div>

                  {latestNegotiation?.notes && (
                    <div className="text-xs bg-white p-2.5 rounded-lg border border-blue-200 text-gray-700">
                      <span className="text-gray-500 block text-[11px] font-semibold">Pesan dari Penjual:</span>
                      &ldquo;{latestNegotiation.notes}&rdquo;
                    </div>
                  )}

                  {/* Tombol Aksi Pembeli */}
                  {!showNegoForm && (
                    <div className="pt-2 flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={handleAccept}
                        disabled={isSubmitting}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Terima Tawaran Penjual</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowNegoForm(true);
                          if (latestNegotiation?.proposed_delivery_at) {
                            const d = new Date(latestNegotiation.proposed_delivery_at);
                            setDeliveryDate(d.toISOString().split("T")[0]);
                            setDeliveryTime(
                              `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
                            );
                          }
                          if (latestNegotiation?.proposed_shipping_cost) {
                            const cost =
                              typeof latestNegotiation.proposed_shipping_cost === "object"
                                ? (latestNegotiation.proposed_shipping_cost as any).value
                                : latestNegotiation.proposed_shipping_cost;
                            setShippingCost(String(cost));
                          }
                        }}
                        disabled={isSubmitting}
                        className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Nego Ulang</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowRejectModal(true)}
                        disabled={isSubmitting}
                        className="py-2.5 px-3 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold flex items-center justify-center gap-1 transition-all disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Tolak</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* FORM NEGOSIASI (Untuk Round 1 Pertama Kali atau Nego Ulang) */}
              {(hasNoNegotiation || showNegoForm) && !isAgreed && !isRejected && (
                <div className="p-4 bg-white border border-amber-300 rounded-xl space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h5 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                      <Send className="w-4 h-4 text-amber-600" />
                      <span>
                        {hasNoNegotiation ? "Tentukan Jadwal & Ongkir COD (Pengajuan Pertama)" : "Kirimkan Negosiasi Balik ke Penjual"}
                      </span>
                    </h5>
                    {showNegoForm && (
                      <button
                        type="button"
                        onClick={() => setShowNegoForm(false)}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        Batal
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSubmitNego} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Tanggal Pengantaran
                        </label>
                        <input
                          type="date"
                          min={todayStr}
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          required
                          className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Jam Pengantaran
                        </label>
                        <input
                          type="time"
                          value={deliveryTime}
                          onChange={(e) => setDeliveryTime(e.target.value)}
                          required
                          className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Tawaran Ongkos Kirim (Rp)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">
                          Rp
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="1000"
                          value={shippingCost}
                          onChange={(e) => setShippingCost(e.target.value)}
                          required
                          placeholder="Contoh: 10000"
                          className="w-full text-xs pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">
                        Masukkan estimasi biaya kirim tunai yang Anda ajukan untuk kurir toko.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Catatan Pengantaran (Opsional)
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Contoh: Tolong antar sebelum jam 12 siang ya..."
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? "Mengirim Pengajuan..." : "Kirimkan Pengajuan ke Penjual"}</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TIMELINE RIWAYAT NEGOSIASI */}
              {negotiations.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <h5 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    <span>Riwayat Negosiasi ({negotiations.length} Putaran)</span>
                  </h5>

                  <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                    {negotiations.map((item, idx) => {
                      const isCustomer = item.negotiator_type === "customer";
                      return (
                        <div
                          key={item.id || idx}
                          className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                            isCustomer
                              ? "bg-amber-50/50 border-amber-200 ml-2"
                              : "bg-blue-50/50 border-blue-200 mr-2"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold flex items-center gap-1.5">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  isCustomer ? "bg-amber-500" : "bg-blue-500"
                                }`}
                              />
                              {isCustomer ? "Diajukan oleh Anda (Pembeli)" : "Diajukan oleh Penjual"}
                              <span className="text-[10px] text-gray-400 font-normal">
                                • Putaran #{item.round}
                              </span>
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                item.status === "diterima"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : item.status === "ditolak"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {item.status_label || item.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-700 pt-0.5">
                            <div>
                              <span className="text-gray-400 block text-[10px]">Waktu Pengantaran:</span>
                              <strong>{item.proposed_delivery_at_formatted || item.proposed_delivery_at}</strong>
                            </div>
                            <div>
                              <span className="text-gray-400 block text-[10px]">Ongkos Kirim:</span>
                              <strong className="text-gray-900">{formatRupiah(item.proposed_shipping_cost)}</strong>
                            </div>
                          </div>

                          {item.notes && (
                            <p className="text-[11px] text-gray-600 bg-white/80 p-2 rounded-md border border-gray-100 italic">
                              Catatan: &ldquo;{item.notes}&rdquo;
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Kartu Informasi Pengiriman Toko */}
          <div className="checkout-card">
            <div className="checkout-header-section justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="checkout-header-icon-box">
                  <Banknote className="w-5 h-5 text-[var(--terracotta)]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    Metode Bayar di Tempat (COD)
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Kurir toko akan mengantar langsung ke alamat tujuan
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Info Alamat Penerima */}
              <div className="p-4 bg-[var(--cream)] rounded-xl border border-[var(--cream-dark)] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                  <MapPin className="w-4 h-4 text-[var(--terracotta)]" />
                  <span>Alamat Pengantaran</span>
                </div>
                <div className="text-xs text-[var(--text-secondary)] pl-6 space-y-1">
                  <p className="font-semibold text-[var(--text-primary)]">
                    {recipientName} ({recipientPhone})
                  </p>
                  <p className="leading-relaxed">{shippingAddress}</p>
                  {order.note && (
                    <p className="text-[11px] text-[var(--text-muted)] italic pt-1">
                      Catatan: &ldquo;{order.note}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Info Toko Penjual */}
              <div className="p-4 bg-white rounded-xl border border-[var(--cream-dark)] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                    <StoreIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[var(--text-primary)]">
                      {order.store?.name || "Toko Penjual"}
                    </h5>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {order.store?.address || "Kabupaten Sleman"}
                    </p>
                  </div>
                </div>
                {storePhone && (
                  <a
                    href={`tel:${storePhone}`}
                    className="btn btn-secondary btn-sm flex items-center gap-1 text-[11px]"
                  >
                    <Phone className="w-3 h-3" />
                    Hubungi
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Rincian Tagihan & Tombol Aksi */}
        <div className="lg:col-span-5 space-y-6">
          <div className="checkout-card">
            <div className="checkout-header-section">
              <div className="checkout-header-icon-box">
                <Package className="w-5 h-5 text-[var(--terracotta)]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Rincian Tagihan Pesanan
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  No. Pesanan: {order.order_number} {order.created_at ? `• ${formatDate(order.created_at)}` : ""}
                </p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Daftar Produk Singkat */}
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-[#FAF7F2] rounded-xl border border-[var(--cream-dark)] flex items-center justify-between text-xs"
                  >
                    <div className="flex-1 pr-2">
                      <p className="font-bold text-[var(--text-primary)] line-clamp-1">
                        {item.product_name}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {item.quantity}x {item.product_price?.formatted || item.variant_price?.formatted || ""}
                      </p>
                    </div>
                    <span className="font-bold text-[var(--text-primary)] flex-shrink-0">
                      {item.product_price?.formatted || item.variant_price?.formatted || "-"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="h-[1px] bg-[var(--cream-dark)]" />

              {/* Rincian Harga */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-[var(--text-secondary)]">
                  <span>Tagihan Produk</span>
                  <span className="font-bold text-[var(--text-primary)]">
                    {order.subtotal?.formatted || order.total?.formatted || "Rp 0"}
                  </span>
                </div>

                <div className="flex justify-between items-start gap-2 pt-1 text-[var(--text-secondary)]">
                  <span className="flex-shrink-0">Ongkos Kirim</span>
                  {isAgreed ? (
                    <span className="font-bold text-emerald-700 text-right text-xs">
                      {formatRupiah(latestNegotiation?.proposed_shipping_cost || order.shipping_cost)}
                    </span>
                  ) : (
                    <span className="font-bold text-amber-800 text-right text-[11px] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      {latestNegotiation
                        ? `Diajukan: ${formatRupiah(latestNegotiation.proposed_shipping_cost)}`
                        : "Dalam proses negosiasi"}
                    </span>
                  )}
                </div>

                <div className="h-[1px] bg-[var(--cream-dark)] my-2" />

                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    Total Tagihan COD
                  </span>
                  <span className="text-base font-extrabold text-[var(--terracotta)]">
                    {order.total?.formatted || order.subtotal?.formatted || "Rp 0"}
                  </span>
                </div>

                <p className="text-[10px] text-gray-500 italic pt-1">
                  * Pembayaran tunai dilakukan kepada kurir toko saat barang tiba sesuai kesepakatan.
                </p>
              </div>

              {/* Tombol Aksi */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={() => router.replace("/pesanan?status=processing")}
                  className="checkout-btn-full"
                >
                  <span>Lihat Status Pesanan</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  type="button"
                  onClick={() => router.replace("/")}
                  className="w-full py-2.5 px-4 rounded-xl border border-[var(--cream-dark)] bg-white hover:bg-[var(--cream)] text-xs font-bold text-[var(--text-secondary)] flex items-center justify-center gap-2 transition-colors"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Kembali ke Beranda</span>
                </button>
              </div>

              <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Transaksi COD Sleman Mart aman & terverifikasi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tolak Pesanan */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-gray-900">Tolak Negosiasi COD?</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Jika Anda menolak negosiasi ini, pesanan akan otomatis <strong>dibatalkan</strong>.
            </p>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Alasan Penolakan (Opsional)
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Contoh: Jadwal pengiriman tidak sesuai atau ongkos kirim terlalu tinggi..."
                className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? "Memproses..." : "Ya, Tolak & Batalkan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
