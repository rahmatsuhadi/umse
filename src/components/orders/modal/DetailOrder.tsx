import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useGetOrderPayments } from "@/features/order/hooks";
import Image from "next/image";
import { formatDate } from "@/lib/format-date";
import { getStatusBadgeClass } from "../lib";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaPreview } from "@/components/shared/MediaPreview";
import { ComplaintMedia } from "@/types";

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
            <div className="py-3.5 flex items-center gap-2">
              <span className={getStatusBadgeClass(order.status === "awaiting_payment" ? order.payment_status : order.status)}>
                {order.status === "awaiting_payment" ? order.payment_status_label : order.status_label}
              </span>
            </div>

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
                    <p className="text-[var(--text-secondary)] font-medium">
                      Pesanan sedang diproses dan dikemas oleh penjual
                    </p>
                  )}

                  {/* Status "Shipped" */}
                  {order.status === "shipped" && (
                    <div className="space-y-1">
                      <p className="text-[var(--text-secondary)] font-medium">
                        Pesanan dikirim {formatDate(order.shipped_at)} dengan{" "}
                        <span className="font-extrabold text-[var(--text-primary)]">{order.shipping_service?.toUpperCase()}</span> ({order.shipping_service_type})
                      </p>
                      {order.estimated_delivery && (
                        <p className="text-[var(--text-muted)] text-xs font-semibold">
                          Estimasi sampai:{" "}
                          {(() => {
                            const [min, max] = order.estimated_delivery
                              .split("-")
                              .map((n: string) => parseInt(n.trim()));

                            const shippedDate = new Date(order.shipped_at);
                            const minDate = new Date(
                              shippedDate.getTime() + min * 24 * 60 * 60 * 1000
                            );
                            const maxDate = new Date(
                              shippedDate.getTime() + max * 24 * 60 * 60 * 1000
                            );

                            // Format
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

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <i className="fas fa-shopping-bag text-[var(--terracotta)] text-sm"></i>
                  <h3 className="text-sm font-extrabold text-[var(--text-primary)]">Item Pesanan</h3>
                </div>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="checkout-item-card" style={{marginBottom:"5px"}}>
                      <div className="checkout-item-img-box">
                        <Image
                          src={item.product ? item.product.thumbnail.media_url : '/assets/no-image.jpg'}
                          layout="fill"
                          alt="gambar"
                          objectFit="cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="checkout-item-title truncate">
                          {item.variant_name || item.product_name}
                        </h4>
                        <p className="text-[11px] text-[var(--text-muted)] font-medium truncate mt-0.5">
                          <i className="fas fa-store text-[var(--brown-light)] mr-1"></i> {order.store.name}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="checkout-item-price">
                            {item.variant_price
                              ? item.variant_price.formatted
                              : item.product_price.formatted}
                          </span>
                          <span className="text-[var(--text-muted)] text-xs font-bold bg-[var(--cream)] px-2.5 py-0.5 rounded-md border border-[var(--cream-dark)]">
                            x {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
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

              {/* Payment Summary Card */}
              <div className="bg-white border-[1.5px] border-[var(--cream-dark)] rounded-[var(--radius-md)] p-5 sm:p-6 space-y-3.5 shadow-sm" style={{marginBottom:"5px"}}>
                <div className="flex items-center gap-2 mb-1">
                  <i className="fas fa-wallet text-[var(--terracotta)] text-sm"></i>
                  <h4 className="text-sm font-extrabold text-[var(--text-primary)]">Ringkasan Pembayaran</h4>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-[var(--text-secondary)] pl-6">
                  <span>Subtotal Produk</span>
                  <span className="font-bold">{order.subtotal.formatted}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-[var(--text-secondary)] pl-6">
                  <span>Ongkos Kirim</span>
                  <span className="font-bold">{order.shipping_cost.formatted}</span>
                </div>
                <hr className="border-[var(--cream-dark)] my-1" />
                <div className="flex justify-between items-center pl-6">
                  <div>
                    <span className="text-xs sm:text-sm font-extrabold text-[var(--text-primary)]">Total Belanja</span>
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

      {/* Payment Summary */}
      <div className="border-[1.5px] border-[var(--cream-dark)] rounded-[var(--radius-md)] p-4 space-y-3 bg-white">
        <Skeleton className="w-1/3 h-4 bg-gray-200" />
        <Skeleton className="w-full h-3 bg-gray-200" />
        <Skeleton className="w-full h-3 bg-gray-200" />
      </div>
    </div>
  );
};