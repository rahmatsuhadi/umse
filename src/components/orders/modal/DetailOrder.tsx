import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useGetOrderPayments, useOrderTracking } from "@/features/order/hooks";
import Image from "next/image";
import { formatDate } from "@/lib/format-date";
import { getStatusBadgeClass } from "../lib";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaPreview } from "@/components/shared/MediaPreview";
import { ComplaintMedia } from "@/types";
import { getShippingMethodInfo, getCourierDisplayName } from "@/lib/shipping-helper";
import { getComputedPrice, parsePriceValue } from "@/lib/price-helper";
import { formatRupiah } from "@/lib/curency-format";
import { OrderTimeline } from "@/components/orders/OrderTimeLine";

type Props = {
  open: boolean;
  orderId: string;
  onClose: () => void;
};

const getStatusBannerStyle = (status: string) => {
  switch (status) {
    case "completed":
    case "delivered":
    case "paid":
      return {
        bg: "bg-[#D4EFDF]/30 border-[#27AE60]/20",
        text: "text-[var(--forest-mid)]",
        icon: "fas fa-check-circle"
      };
    case "cancelled":
    case "rejected":
    case "expired":
      return {
        bg: "bg-[#FDE8D8]/40 border-[var(--terracotta)]/20",
        text: "text-[var(--terracotta-dark)]",
        icon: "fas fa-times-circle"
      };
    default: // awaiting_payment, pending, processing, shipped, unpaid, etc.
      return {
        bg: "bg-[#FEF3D0]/40 border-[var(--saffron)]/20",
        text: "text-[#9B6E00]",
        icon: "fas fa-clock"
      };
  }
};

export default function OrderDetailModal({ open, orderId, onClose }: Props) {
  const { data, isLoading } = useGetOrderPayments(orderId);
  const order = data?.data;

  const currentStatus = order ? (order.status === "awaiting_payment" ? order.payment_status : order.status) : "";
  const bannerStyle = getStatusBannerStyle(currentStatus);
  const shippingInfo = order ? getShippingMethodInfo(order) : null;

  // Hitung total potongan diskon pesanan
  const totalDiscount = useMemo(() => {
    if (!order) return 0;

    // 1. Cek jika order memiliki property diskon langsung dari API
    const explicitDiscount =
      (order as unknown as { discount?: unknown })?.discount ??
      (order as unknown as { total_discount?: unknown })?.total_discount ??
      (order as unknown as { discount_amount?: unknown })?.discount_amount;
    const explicitVal = parsePriceValue(explicitDiscount as number | string | undefined);
    if (explicitVal > 0) return explicitVal;

    // 2. Hitung akumulasi diskon dari setiap item pesanan
    if (order.items && order.items.length > 0) {
      return order.items.reduce((acc, item) => {
        const itemPrice = getComputedPrice(item.product, item.variant);
        if (itemPrice.hasDiscount) {
          const diff = itemPrice.originalPriceValue - itemPrice.finalPriceValue;
          return acc + (diff > 0 ? diff * item.quantity : 0);
        }
        return acc;
      }, 0);
    }

    return 0;
  }, [order]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-lg max-h-[85vh] overflow-y-auto bg-white border border-[var(--cream-dark)] p-7 shadow-xl" 
        style={{ 
          borderRadius: "var(--radius-lg)",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "24px"
        }}
      >
        {isLoading || !order ? (
          <OrderDetailModalSkeleton />
        ) : (
          <>
            {/* Header */}
            <DialogHeader className="border-b border-[var(--cream-dark)] pb-5" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <DialogTitle className="text-xl font-extrabold text-[var(--text-primary)] flex items-center gap-2.5" style={{ fontSize: "20px", lineHeight: "1.2" }}>
                <i className="fas fa-receipt text-[var(--terracotta)] text-2xl"></i> Detail Pesanan #{order?.order_number}
              </DialogTitle>
              <DialogDescription className="text-xs text-[var(--text-muted)] mt-1.5 flex items-center gap-1.5 font-medium" style={{ fontSize: "12px" }}>
                <i className="far fa-calendar-alt text-[var(--brown-light)]"></i> Dibuat pada {formatDate(order.created_at)}
              </DialogDescription>
            </DialogHeader>

            {/* Status Badge */}
            {order.status?.toLowerCase() !== "processing" && order.status_label?.toLowerCase() !== "diproses" && (
              <div className="py-3.5 flex items-center gap-2">
                <span className={getStatusBadgeClass(order.status === "awaiting_payment" ? order.payment_status : order.status)}>
                  {order.status === "awaiting_payment" ? order.payment_status_label : order.status_label}
                </span>
              </div>
            )}

            {/* Status Detail Section Banner */}
            <div className={`p-4 ${bannerStyle.bg} border rounded-[var(--radius-md)] text-sm space-y-3`}>
              <div className="flex items-center gap-3">
                <i className={`${bannerStyle.icon} ${bannerStyle.text} text-2xl flex-shrink-0`}></i>
                <div className="flex-1 space-y-1">
                  {/* Status "Awaiting Payment" */}
                  {order.status === "awaiting_payment" && (
                    <>
                      {order.payment_status === "rejected" && (
                        <>
                          <p className="text-[var(--terracotta-dark)] font-bold">Pembayaran ditolak oleh penjual.</p>
                          {order.payment?.rejection_reason && (
                            <p className="text-[var(--text-secondary)] text-xs mt-1 bg-white/60 p-2 rounded border border-[var(--cream-dark)]/30">
                              Alasan: {order.payment.rejection_reason}
                            </p>
                          )}
                        </>
                      )}
                      {order.payment_status === "unpaid" && (
                        <p className="text-[var(--text-secondary)] font-medium">
                          Menunggu pembayaran sebelum <span className="font-extrabold text-[var(--terracotta-dark)]">{formatDate(order.payment_due_at)}</span>
                        </p>
                      )}
                      {order.payment_status === "pending" && (
                        <p className="text-[var(--text-secondary)] font-medium">
                          Menunggu Konfirmasi pembayaran dari penjual
                        </p>
                      )}
                      {order.payment_status === "paid" && (
                        <p className="text-[var(--text-secondary)] font-medium">
                          Pembayaran Terverifikasi. Pesanan sedang menunggu konfirmasi dari penjual
                          {order.payment?.verified_at && ` sejak ${formatDate(order.payment.verified_at)}.`}
                        </p>
                      )}
                    </>
                  )}

                  {/* Status "Pending" with Paid Payment */}
                  {order.status === "pending" && order.payment_status === "paid" && (
                    <p className="text-[var(--text-secondary)] font-medium">
                      Pembayaran Berhasil. Menunggu konfirmasi pesanan diproses penjual
                    </p>
                  )}

                  {/* Status "Processing" */}
                  {order.status === "processing" && (
                    <div className="space-y-1">
                      <p className="text-[var(--text-secondary)] font-medium">
                        Pesanan sedang diproses dan dikemas oleh penjual
                      </p>
                      {shippingInfo && (
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-muted)] font-semibold mt-1">
                          <span className="flex items-center gap-1 text-[var(--text-primary)]">
                            <i className={`${shippingInfo.icon} text-[var(--terracotta)]`}></i>
                            Pengiriman: <strong className="font-bold">{shippingInfo.categoryLabel}</strong>
                          </span>
                          {(shippingInfo.category === "instant" || shippingInfo.category === "regular") && (
                            <span className="flex items-center gap-1">
                              • Kurir: <strong className="text-[var(--terracotta-dark)] font-extrabold">{shippingInfo.courierName}</strong>
                              {order.shipping_service_type && (
                                <span className="text-[11px] font-medium text-[var(--text-secondary)]">({order.shipping_service_type})</span>
                              )}
                            </span>
                          )}
                          {shippingInfo.category === "cod" && (
                            <span className="text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              Bayar Tunai di Tempat
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Status "Shipped" */}
                  {order.status === "shipped" && (
                    <div className="space-y-1">
                      <p className="text-[var(--text-secondary)] font-medium">
                        Pesanan dikirim {formatDate(order.shipped_at)} dengan{" "}
                        <span className="font-extrabold text-[var(--text-primary)]">
                          {shippingInfo?.category === "instant"
                            ? `Instant - ${shippingInfo.courierName}`
                            : shippingInfo?.category === "regular"
                            ? `Reguler - ${shippingInfo.courierName}`
                            : shippingInfo?.courierName || order.shipping_service?.toUpperCase()}
                        </span>
                        {order.shipping_service_type && ` (${order.shipping_service_type})`}
                      </p>
                      {order.estimated_delivery && (
                        <p className="text-[var(--text-muted)] text-xs font-semibold">
                          Estimasi sampai:{" "}
                          {(() => {
                            if (!order.estimated_delivery) return "-";
                            const parts = order.estimated_delivery
                              .split("-")
                              .map((n: string) => parseInt(n.trim()));
                            const min = parts[0];
                            const max = parts.length > 1 ? parts[1] : min;

                            if (isNaN(min)) {
                              return order.estimated_delivery;
                            }

                            const shippedDate = new Date(order.shipped_at);
                            if (isNaN(shippedDate.getTime())) {
                              return `${order.estimated_delivery} Hari`;
                            }

                            const minDate = new Date(
                              shippedDate.getTime() + min * 24 * 60 * 60 * 1000
                            );
                            const maxDate = new Date(
                              shippedDate.getTime() + (max || min) * 24 * 60 * 60 * 1000
                            );

                            const options: Intl.DateTimeFormatOptions = { day: "numeric" };
                            const monthYearOptions: Intl.DateTimeFormatOptions = {
                              month: "long",
                              year: "numeric",
                            };

                            const sameMonth =
                              minDate.getMonth() === maxDate.getMonth() &&
                              minDate.getFullYear() === maxDate.getFullYear();

                            if (sameMonth) {
                              return `${minDate.toLocaleDateString("id-ID", options)} – ${maxDate.toLocaleDateString(
                                "id-ID",
                                options
                              )} ${maxDate.toLocaleDateString("id-ID", monthYearOptions)}`;
                            } else {
                              return `${minDate.toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })} – ${maxDate.toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}`;
                            }
                          })()}
                        </p>
                      )}
                      {order.tracking_number && (
                        <p className="text-[var(--terracotta-dark)] font-mono font-bold mt-1 text-xs break-all">Resi: {order.tracking_number}</p>
                      )}
                    </div>
                  )}

                  {/* Status "Delivered" */}
                  {order.status === "delivered" && (
                    <p className="text-[var(--forest-mid)] font-bold">
                      Pesanan terkirim {formatDate(order.delivered_at)}.
                    </p>
                  )}

                  {/* Status "Completed" */}
                  {order.status === "completed" && (
                    <p className="text-[var(--forest-mid)] font-bold">
                      Pesanan selesai 🎉 Terima kasih sudah berbelanja!
                    </p>
                  )}

                  {/* Status "Cancelled" */}
                  {order.status === "cancelled" && (
                    <div className="space-y-1">
                      <p className="text-[var(--terracotta-dark)] font-bold">
                        Pesanan dibatalkan {formatDate(order.cancelled_at)}.
                      </p>
                      {order.cancellation_reason && (
                        <p className="text-[var(--text-secondary)] text-xs">Alasan: {order.cancellation_reason}</p>
                      )}
                    </div>
                  )}

                  {/* Status "Expired" */}
                  {order.status === "expired" && (
                    <p className="text-[var(--text-muted)] font-bold">Pesanan kadaluarsa.</p>
                  )}
                </div>
              </div>

              {/* Order Notes (Inside Banner for better visual structure) */}
              {order.note && (
                <div className="mt-2.5 pt-2.5 border-t border-[var(--cream-dark)]/40 text-xs text-[var(--text-secondary)] italic">
                  <span className="font-extrabold not-italic text-[var(--text-primary)]">Catatan Pesanan: </span>
                  &quot;{order.note}&quot;
                </div>
              )}
            </div>

            {/* Tracking KiriminAja Section (Khusus PROCESSING, SHIPPED, DELIVERED) */}
            {['processing', 'shipped', 'delivered'].includes(order.status?.toLowerCase()) && (
              <OrderTrackingSection orderId={order.id} orderStatus={order.status} />
            )}

            {/* Items Container */}
            <div className="py-4 space-y-5">
              {/* Detail Komplain Card */}
              {order.has_complaint && order.complaint && (
                <div className="bg-white border-[1.5px] border-[var(--cream-dark)] rounded-[var(--radius-md)] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300" style={{ marginBottom: "5px" }}>
                  <div className="flex items-center justify-between gap-2.5 pb-2.5 border-b border-[var(--cream-dark)] mb-3">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-exclamation-circle text-[var(--terracotta)] text-sm"></i>
                      <h4 className="text-sm font-extrabold text-[var(--text-primary)]">Detail Komplain</h4>
                    </div>
                    <span className={
                      order.complaint.status === 'pending' || order.complaint.status === 'in_progress'
                        ? "badge badge-saffron"
                        : order.complaint.status === 'resolved'
                          ? "badge badge-forest"
                          : order.complaint.status === 'rejected'
                            ? "badge badge-terracotta"
                            : "badge"
                    }>
                      {order.complaint.status === 'pending' ? 'Komplain Diajukan'
                        : order.complaint.status === 'in_progress' ? 'Komplain Diproses'
                          : order.complaint.status === 'resolved' ? 'Komplain Selesai'
                            : order.complaint.status === 'rejected' ? 'Komplain Ditolak'
                              : 'Komplain'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-xs sm:text-sm pl-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="text-[var(--text-muted)] font-semibold">No. Tiket:</span>
                      <span className="font-bold text-[var(--text-primary)]">#{order.complaint.ticket_number}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="text-[var(--text-muted)] font-semibold">Kategori:</span>
                      <span className="font-bold text-[var(--text-primary)] capitalize">
                        {order.complaint.category === 'payment' ? 'Pembayaran'
                          : order.complaint.category === 'product' ? 'Produk'
                          : order.complaint.category === 'shipping' ? 'Pengiriman'
                          : order.complaint.category === 'account' ? 'Akun'
                          : order.complaint.category === 'app' ? 'Aplikasi'
                          : 'Lainnya'}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="text-[var(--text-muted)] font-semibold">Judul Masalah:</span>
                      <span className="font-bold text-[var(--text-primary)]">{order.complaint.title}</span>
                    </div>
                    
                    <div className="mt-3 p-3 bg-[var(--cream)] rounded-[var(--radius-sm)] border border-[var(--cream-dark)]/40">
                      <span className="text-[var(--text-muted)] text-xs font-bold block mb-1">Deskripsi Masalah:</span>
                      <p className="text-[var(--text-secondary)] text-xs leading-relaxed whitespace-pre-wrap">{order.complaint.description}</p>
                    </div>

                    {order.complaint.desired_action && (
                      <div className="mt-2.5 pt-2.5 border-t border-[var(--cream-dark)]/40 flex flex-col sm:flex-row sm:justify-between gap-1">
                        <span className="text-[var(--text-muted)] font-semibold">Solusi yang Diinginkan:</span>
                        <span className="font-bold text-[var(--terracotta-dark)]">{order.complaint.desired_action}</span>
                      </div>
                    )}

                    {order.complaint.media && order.complaint.media.length > 0 && (
                      <ComplaintProofs media={order.complaint.media} />
                    )}
                  </div>
                </div>
              )}

              {/* Riwayat Status Pesanan */}
              <OrderTimeline order={order} />

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <i className="fas fa-shopping-bag text-[var(--terracotta)] text-sm"></i>
                  <h3 className="text-sm font-extrabold text-[var(--text-primary)]">Item Pesanan</h3>
                </div>
                <div className="space-y-3">
                  {order.items.map((item, i) => {
                    const priceInfo = getComputedPrice(item.product, item.variant);
                    return (
                      <div key={i} className="checkout-item-card" style={{ marginBottom: "5px" }}>
                        <div className="checkout-item-img-box">
                          <Image
                            src={item.product ? item.product.thumbnail.media_url : '/assets/no-image.jpg'}
                            layout="fill"
                            alt="gambar"
                            objectFit="cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="checkout-item-title truncate">
                              {item.variant_name || item.product_name}
                            </h4>
                            {priceInfo.hasDiscount && priceInfo.discountBadge && (
                              <span className="badge badge-terracotta text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0">
                                {priceInfo.discountBadge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[var(--text-muted)] font-medium truncate mt-0.5">
                            <i className="fas fa-store text-[var(--brown-light)] mr-1"></i> {order.store.name}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <div className="flex items-baseline gap-1.5 flex-wrap">
                              <span className="checkout-item-price">
                                {item.variant_price
                                  ? item.variant_price.formatted
                                  : item.product_price.formatted}
                              </span>
                              {priceInfo.hasDiscount && (
                                <span className="line-through text-[11px] text-[var(--text-muted)]">
                                  {priceInfo.originalPriceFormatted}
                                </span>
                              )}
                            </div>
                            <span className="text-[var(--text-muted)] text-xs font-bold bg-[var(--cream)] px-2.5 py-0.5 rounded-md border border-[var(--cream-dark)]">
                              x {item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-white border-[1.5px] border-[var(--cream-dark)] rounded-[var(--radius-md)] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300" style={{marginBottom:"5px"}}>
                <div className="flex items-start gap-2.5 mb-2">
                  <i className="fas fa-map-marker-alt text-[var(--terracotta)] text-base mt-0.5"></i>
                  <h4 className="text-sm font-extrabold text-[var(--text-primary)]">Alamat Pengiriman</h4>
                </div>
                <p className="text-[var(--text-secondary)] text-xs sm:text-sm leading-relaxed pl-6">
                  {order.shipping_address_line},{" "}
                  {order.shipping_village.name},{" "}
                  {order.shipping_district?.name},{" "}
                  {order.shipping_regency?.name},{" "}
                  {order.shipping_province?.name},{" "}
                  <span className="font-bold text-[var(--text-primary)]">{order.shipping_postal_code}</span>
                </p>
                {order.shipping_note && (
                  <div className="mt-2.5 pt-2.5 border-t border-[var(--cream-dark)] text-xs text-[var(--text-muted)] italic pl-6">
                    <span className="font-bold not-italic text-[var(--text-secondary)]">Catatan Pengiriman: </span>
                    &quot;{order.shipping_note}&quot;
                  </div>
                )}
              </div>

              {/* Shipping Information Card */}
              {shippingInfo && (
                <div className="bg-white border-[1.5px] border-[var(--cream-dark)] rounded-[var(--radius-md)] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300" style={{marginBottom:"5px"}}>
                  <div className="flex items-center justify-between gap-2.5 pb-2.5 border-b border-[var(--cream-dark)] mb-3">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-shipping-fast text-[var(--terracotta)] text-sm"></i>
                      <h4 className="text-sm font-extrabold text-[var(--text-primary)]">Informasi Pengiriman</h4>
                    </div>
                    {/* Badge Jenis Pengiriman (COD, Instant, atau Reguler) */}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${shippingInfo.badgeClass}`}>
                      <i className={shippingInfo.icon}></i>
                      {shippingInfo.categoryLabel}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-sm pl-6">
                    {/* Jenis Pengiriman */}
                    <div className="flex justify-between items-center py-1 border-b border-[var(--cream-dark)]/40">
                      <span className="text-[var(--text-muted)] font-semibold">Jenis Pengiriman:</span>
                      <span className="font-extrabold text-[var(--text-primary)] flex items-center gap-1.5">
                        <i className={`${shippingInfo.icon} text-xs`} style={{ color: shippingInfo.accentColor }}></i>
                        {shippingInfo.categoryFullLabel}
                      </span>
                    </div>

                    {/* Nama Jasa Kurir (Wajib tampil untuk Instant dan Reguler) */}
                    {(shippingInfo.category === "instant" || shippingInfo.category === "regular") && (
                      <div className="flex justify-between items-center py-1 border-b border-[var(--cream-dark)]/40">
                        <span className="text-[var(--text-muted)] font-semibold">Nama Jasa Kurir:</span>
                        <div className="text-right">
                          <span className="font-black text-[var(--terracotta-dark)] text-sm block">
                            {shippingInfo.courierName}
                          </span>
                          {order.shipping_service_type && (
                            <span className="text-[11px] font-bold text-[var(--text-secondary)] bg-[var(--cream)] px-2 py-0.5 rounded border border-[var(--cream-dark)] inline-block mt-0.5">
                              Layanan: {order.shipping_service_type}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Informasi COD */}
                    {shippingInfo.category === "cod" && (
                      <div className="flex justify-between items-center py-1 border-b border-[var(--cream-dark)]/40">
                        <span className="text-[var(--text-muted)] font-semibold">Metode Pembayaran:</span>
                        <span className="font-bold text-[var(--forest-mid)] flex items-center gap-1">
                          <i className="fas fa-hand-holding-usd text-xs"></i> Bayar Tunai di Tempat (COD)
                        </span>
                      </div>
                    )}

                    {/* Estimasi Waktu Tiba */}
                    {order.estimated_delivery && (
                      <div className="flex justify-between items-center py-1 border-b border-[var(--cream-dark)]/40">
                        <span className="text-[var(--text-muted)] font-semibold">Estimasi Waktu:</span>
                        <span className="font-bold text-[var(--text-secondary)]">
                          {shippingInfo.category === "cod"
                            ? (order.estimated_delivery.toLowerCase().includes("cod")
                                ? "Sesuai kesepakatan pengantaran"
                                : `${order.estimated_delivery} Hari`)
                            : shippingInfo.category === "instant"
                            ? (order.estimated_delivery.includes("jam") || order.estimated_delivery.includes("hour")
                                ? order.estimated_delivery
                                : "1 – 3 Jam (Tiba Hari Ini)")
                            : `${order.estimated_delivery} Hari`}
                        </span>
                      </div>
                    )}

                    {/* Nomor Resi Pengiriman (jika ada) */}
                    {order.tracking_number && (
                      <div className="flex justify-between items-center py-1 border-b border-[var(--cream-dark)]/40">
                        <span className="text-[var(--text-muted)] font-semibold">No. Resi Pengiriman:</span>
                        <span className="font-mono font-bold text-[var(--terracotta-dark)] bg-[var(--cream)] px-2.5 py-1 rounded border border-[var(--cream-dark)] select-all text-xs">
                          {order.tracking_number}
                        </span>
                      </div>
                    )}

                    {/* Biaya Ongkos Kirim */}
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-[var(--text-muted)] font-semibold">Ongkos Kirim:</span>
                      <span className="font-extrabold text-[var(--text-primary)]">
                        {shippingInfo.category === "cod" && Number(order.shipping_cost?.value ?? 0) === 0
                          ? "Sesuai kesepakatan"
                          : (order.shipping_cost?.formatted || "Rp 0")}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Summary Card */}
              <div className="bg-white border-[1.5px] border-[var(--cream-dark)] rounded-[var(--radius-md)] p-5 sm:p-6 space-y-3.5 shadow-sm" style={{marginBottom:"5px"}}>
                <div className="flex items-center gap-2 mb-1">
                  <i className="fas fa-wallet text-[var(--terracotta)] text-sm"></i>
                  <h4 className="text-sm font-extrabold text-[var(--text-primary)]">Ringkasan Pembayaran</h4>
                </div>
                
                {/* Subtotal Produk */}
                <div className="flex justify-between text-xs sm:text-sm text-[var(--text-secondary)] pl-6">
                  <span>Subtotal Produk</span>
                  <span className="font-bold">
                    {totalDiscount > 0
                      ? formatRupiah(order.subtotal.value + totalDiscount)
                      : order.subtotal.formatted}
                  </span>
                </div>

                {/* Informasi Diskon Produk */}
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-xs sm:text-sm pl-6 font-semibold" style={{ color: "#059669" }}>
                    <span className="flex items-center gap-1.5">
                      <i className="fas fa-tag text-xs" style={{ color: "#059669" }}></i>
                      Total Diskon Produk
                    </span>
                    <span className="font-extrabold" style={{ color: "#059669" }}>
                      - {formatRupiah(totalDiscount)}
                    </span>
                  </div>
                )}

                {/* Ongkos Kirim */}
                <div className="flex justify-between text-xs sm:text-sm text-[var(--text-secondary)] pl-6">
                  <span>Ongkos Kirim</span>
                  <span className="font-bold">{order.shipping_cost.formatted}</span>
                </div>

                <hr className="border-[var(--cream-dark)] my-1" />

                {/* Total Belanja */}
                <div className="flex justify-between items-center pl-6">
                  <div>
                    <span className="text-xs sm:text-sm font-extrabold text-[var(--text-primary)] block">Total Belanja</span>
                    {totalDiscount > 0 && (
                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                        <i className="fas fa-check-circle text-[10px]"></i> Hemat {formatRupiah(totalDiscount)}
                      </span>
                    )}
                  </div>
                  <span className="text-lg font-black text-[var(--terracotta)]">{order.total.formatted}</span>
                </div>
              </div>

              {/* Shipping Proofs (Styled inside details list) */}
              {order?.shipping_proof_images?.length > 0 && (
                <div className="mt-6">
                  <ShippingProofs proofs={order.shipping_proof_images} />
                </div>
              )}

              {/* Shipping Notes */}
              {order.shipping_notes && (
                <div className="bg-white border-[1.5px] border-[var(--cream-dark)] rounded-[var(--radius-md)] p-4 shadow-sm" style={{marginBottom:"5px"}}>
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fas fa-info-circle text-[var(--terracotta)] text-sm"></i>
                    <h4 className="text-sm font-extrabold text-[var(--text-primary)]">Catatan Pengiriman</h4>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] pl-6 leading-relaxed">{order.shipping_notes}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <DialogFooter className="border-t border-[var(--cream-dark)] pt-5" style={{ display: "flex", justifyContent: "end", paddingTop: "20px" }}>
              <DialogClose asChild>
                <button type="button" className="btn btn-secondary btn-sm" style={{ padding: "10px 20px" }}>
                  <i className="fas fa-times mr-1.5"></i> Tutup
                </button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface ShippingProofsProps {
  proofs: string[];
}

function ShippingProofs({ proofs }: ShippingProofsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!proofs || proofs.length === 0) return null;

  return (
    <div className="bg-white border-[1.5px] border-[var(--cream-dark)] rounded-[var(--radius-md)] p-4 shadow-sm" style={{marginBottom:"5px"}}>
      <div className="flex items-center gap-2 mb-3">
        <i className="fas fa-camera text-[var(--terracotta)] text-sm"></i>
        <h4 className="text-sm font-extrabold text-[var(--text-primary)]">Bukti Pengiriman</h4>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pl-6">
        {proofs.map((proof, i) => (
          <div
            key={i}
            onClick={() => setSelectedImage(proof)}
            className="relative w-full h-24 bg-[var(--cream)] border border-[var(--cream-dark)] rounded-[var(--radius-sm)] overflow-hidden cursor-pointer hover:border-[var(--terracotta)] transition-all duration-300 shadow-xs"
          >
            <Image
              src={proof}
              alt={`Bukti Pengiriman ${i + 1}`}
              layout="fill"
              objectFit="cover"
            />
          </div>
        ))}
      </div>
      {selectedImage && (
        <MediaPreview
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
          media={{
            type: "image",
            url: selectedImage || '',
          }}
        />
      )}
    </div>
  );
}

interface ComplaintProofsProps {
  media: ComplaintMedia[];
}

function ComplaintProofs({ media }: ComplaintProofsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!media || media.length === 0) return null;

  return (
    <div className="mt-3">
      <span className="text-[var(--text-muted)] text-xs font-bold block mb-2">
        Bukti Pendukung:
      </span>
      <div className="grid grid-cols-3 gap-2">
        {media.map((med, i) => (
          <div
            key={i}
            onClick={() => setSelectedImage(med.media_url)}
            className="relative w-full h-20 bg-[var(--cream)] border border-[var(--cream-dark)] rounded-[var(--radius-sm)] overflow-hidden cursor-pointer hover:border-[var(--terracotta)] transition-all duration-300 shadow-xs"
          >
            <Image
              src={med.media_url}
              alt={med.name || `Bukti Komplain ${i + 1}`}
              layout="fill"
              objectFit="cover"
            />
          </div>
        ))}
      </div>
      {selectedImage && (
        <MediaPreview
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
          media={{
            type: "image",
            url: selectedImage || '',
          }}
        />
      )}
    </div>
  );
}


const OrderDetailModalSkeleton = () => {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Header */}
      <div className="border-b border-[var(--cream-dark)] pb-4 space-y-2">
        <Skeleton className="h-6 w-1/2 bg-gray-200" />
        <Skeleton className="h-4 w-1/3 bg-gray-200" />
      </div>

      {/* Status Badge */}
      <Skeleton className="w-24 h-6 rounded-full bg-gray-200" />

      {/* Status Detail Section */}
      <div className="p-4 bg-[var(--cream)] border border-[var(--cream-dark)] rounded-[var(--radius-md)] space-y-2">
        <Skeleton className="w-full h-4 bg-gray-200" />
        <Skeleton className="w-2/3 h-4 bg-gray-200" />
      </div>

      {/* Timeline Skeleton */}
      <div className="border-[1.5px] border-[var(--cream-dark)] rounded-[var(--radius-md)] p-4 space-y-3 bg-white">
        <Skeleton className="w-1/3 h-4 bg-gray-200" />
        <div className="space-y-2 pl-4 border-l-2 border-gray-100">
          <Skeleton className="w-3/4 h-3 bg-gray-200" />
          <Skeleton className="w-1/2 h-3 bg-gray-200" />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3">
        <Skeleton className="w-1/4 h-5 bg-gray-200" />
        <div className="border-[1.5px] border-[var(--cream-dark)] rounded-[var(--radius-md)] p-3 flex items-center space-x-3 bg-white">
          <Skeleton className="w-12 h-12 rounded-lg bg-gray-200" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-1/2 h-4 bg-gray-200" />
            <Skeleton className="w-1/3 h-3 bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="border-[1.5px] border-[var(--cream-dark)] rounded-[var(--radius-md)] p-4 space-y-3 bg-white">
        <Skeleton className="w-1/3 h-4 bg-gray-200" />
        <Skeleton className="w-full h-3 bg-gray-200" />
        <Skeleton className="w-5/6 h-3 bg-gray-200" />
      </div>

      {/* Shipping Information Skeleton */}
      <div className="border-[1.5px] border-[var(--cream-dark)] rounded-[var(--radius-md)] p-4 space-y-3 bg-white">
        <Skeleton className="w-1/3 h-4 bg-gray-200" />
        <Skeleton className="w-full h-3 bg-gray-200" />
        <Skeleton className="w-4/5 h-3 bg-gray-200" />
      </div>

      {/* Payment Summary */}
      <div className="border-[1.5px] border-[var(--cream-dark)] rounded-[var(--radius-md)] p-4 space-y-3 bg-white">
        <Skeleton className="w-1/3 h-4 bg-gray-200" />
        <Skeleton className="w-full h-3 bg-gray-200" />
        <Skeleton className="w-full h-3 bg-gray-200" />
      </div>
    </div>
  );
};

interface OrderTrackingSectionProps {
  orderId: string;
  orderStatus: string;
}

function OrderTrackingSection({ orderId, orderStatus }: OrderTrackingSectionProps) {
  const [isOpen, setIsOpen] = useState(orderStatus === 'shipped');
  const { data, isLoading, error, refetch } = useOrderTracking(orderId, isOpen);
  const tracking = data?.data;

  return (
    <div className="bg-white border-[1.5px] border-[var(--cream-dark)] rounded-[var(--radius-md)] overflow-hidden shadow-sm transition-all duration-300">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-[var(--cream)]/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--terracotta)]/10 text-[var(--terracotta)] flex items-center justify-center text-base">
            <i className="fas fa-truck-moving"></i>
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-[var(--text-primary)] flex items-center gap-2">
              Lacak Pengiriman Ekspedisi
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--terracotta)]/10 text-[var(--terracotta)]">
                {orderStatus.toUpperCase()}
              </span>
            </h4>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              {isOpen ? "Klik untuk menutup pelacakan" : "Klik untuk melihat status kurir dan riwayat perjalanan"}
            </p>
          </div>
        </div>
        <i className={`fas fa-chevron-down text-sm text-[var(--text-muted)] transition-transform duration-300 ${isOpen ? "transform rotate-180" : ""}`}></i>
      </button>

      {isOpen && (
        <div className="p-4 pt-0 border-t border-[var(--cream-dark)]/50 space-y-4">
          {isLoading ? (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
              <i className="fas fa-spinner fa-spin text-xl text-[var(--terracotta)]"></i>
              <p className="text-xs text-[var(--text-secondary)] font-medium">Menghubungi ekspedisi KiriminAja...</p>
            </div>
          ) : error || !tracking?.status ? (
            <div className="py-4 px-3 bg-red-50 border border-red-200 rounded-[var(--radius-sm)] text-center space-y-2">
              <p className="text-xs text-red-700">
                {tracking?.message || "Belum dapat memuat status kurir saat ini."}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="text-xs font-bold text-[var(--terracotta)] underline hover:text-[var(--terracotta-dark)]"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <div className="space-y-4 pt-3">
              {/* Resi & Courier Info */}
              <div className="p-3 bg-[var(--cream)]/40 border border-[var(--cream-dark)] rounded-[var(--radius-sm)] flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-[var(--text-muted)] block font-medium">Kurir & Layanan:</span>
                  <span className="font-extrabold text-[var(--text-primary)]">
                    {tracking.courier ? getCourierDisplayName(tracking.courier) : "Ekspedisi"} • {tracking.service_type || "Reguler"}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] block font-medium">No. Resi / AWB:</span>
                  <span className="font-mono font-bold text-[var(--terracotta)] select-all">
                    {tracking.tracking_number || "-"}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] block font-medium">Status Terkini:</span>
                  <span className="font-bold text-[var(--forest-mid)]">
                    {tracking.current_status || "Dalam Pengiriman"}
                  </span>
                </div>
              </div>

              {/* Timeline list */}
              <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--cream-dark)]">
                {tracking.histories && tracking.histories.length > 0 ? (
                  tracking.histories.map((hist, idx) => {
                    const isLatest = idx === 0;
                    return (
                      <div key={idx} className="relative">
                        <div
                          className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full ${
                            isLatest
                              ? "bg-[var(--terracotta)] ring-4 ring-[var(--terracotta)]/20"
                              : "bg-[var(--brown-light)]"
                          }`}
                        />
                        <div className="bg-white p-3 rounded-[var(--radius-sm)] border border-[var(--cream-dark)] shadow-2xs space-y-1">
                          <p className="text-[11px] font-bold text-[var(--text-muted)]">
                            {hist.time || "-"}
                          </p>
                          <p className="text-xs font-semibold text-[var(--text-primary)]">
                            {hist.description || "-"}
                          </p>
                          {hist.location && (
                            <p className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                              <i className="fas fa-map-marker-alt text-[var(--terracotta)]"></i>
                              {hist.location}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-[var(--text-muted)] italic py-2">
                    Belum ada riwayat pembaruan status kurir.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}