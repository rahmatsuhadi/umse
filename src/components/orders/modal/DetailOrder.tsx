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
import { Button } from "@/components/ui/button";
import { useGetOrderPayments } from "@/features/order/hooks";
import Image from "next/image";
import { formatDate } from "@/lib/format-date";
import { getStatusBadgeClass } from "../lib";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaPreview } from "@/components/shared/MediaPreview";

type Props = {
  open: boolean;
  orderId: string;
  onClose: () => void;
};

export default function OrderDetailModal({ open, orderId, onClose }: Props) {
  const { data, isLoading } = useGetOrderPayments(orderId);
  const order = data?.data;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto" style={{ borderRadius: "var(--radius-md)" }}>
        {isLoading || !order ? (
          <OrderDetailModalSkeleton />
        ) : (
          <>
            {/* Header */}
            <DialogHeader className="border-b border-[var(--cream-dark)] pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-extrabold text-[var(--text-primary)]">Pesanan #{order?.order_number}</DialogTitle>
              </div>
              <DialogDescription className="text-xs text-[var(--text-muted)] mt-1">
                Dibuat pada {formatDate(order.created_at)}
              </DialogDescription>
            </DialogHeader>

            {/* Status Badge */}
            <div className="py-3 flex items-center gap-2">
              <span className={getStatusBadgeClass(order.status == "awaiting_payment" ? order.payment_status : order.status)}>
                {order.status == "awaiting_payment" ? order.payment_status_label : order.status_label}
              </span>
            </div>

            {/* Status Detail Section */}
            <div className="p-4 bg-[var(--cream)] border border-[var(--cream-dark)] rounded-xl text-sm space-y-2">
              {/* Status "Awaiting Payment" */}
              {order.status === "awaiting_payment" && (
                <>
                  {order.payment_status === "rejected" && (
                    <>
                      <p className="text-[var(--terracotta)] font-bold">Pembayaran ditolak oleh penjual.</p>
                      {order.payment?.rejection_reason && (
                        <p className="text-[var(--text-secondary)]">
                          Alasan: {order.payment.rejection_reason}
                        </p>
                      )}
                    </>
                  )}
                  {order.payment_status === "unpaid" && (
                    <p className="text-[var(--text-secondary)] font-medium">
                      Menunggu pembayaran sebelum <span className="font-bold text-[var(--terracotta)]">{formatDate(order.payment_due_at)}</span>
                    </p>
                  )}
                  {order.payment_status === "pending" && (
                    <p className="text-[var(--text-secondary)] font-medium">
                      Menunggu Konfirmasi pembayaran dari penjual
                    </p>
                  )}
                  {order.payment_status === "paid" && (
                    <p className="text-[var(--text-secondary)]">
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
                <p className="text-[var(--text-secondary)]">
                  Pesanan sedang diproses dan dikemas oleh penjual
                </p>
              )}

              {/* Status "Shipped" */}
              {order.status === "shipped" && (
                <>
                  <p className="text-[var(--text-secondary)]">
                    Pesanan dikirim {formatDate(order.shipped_at)} dengan{" "}
                    <span className="font-bold">{order.shipping_service?.toUpperCase()}</span> ({order.shipping_service_type})
                  </p>
                  {order.estimated_delivery && (
                    <p className="text-[var(--text-muted)]">
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
                    <p className="text-[var(--terracotta)] font-mono font-bold mt-1 break-all">Resi: {order.tracking_number}</p>
                  )}
                </>
              )}

              {/* Status "Delivered" */}
              {order.status === "delivered" && (
                <p className="text-[var(--forest)] font-bold">
                  Pesanan terkirim {formatDate(order.delivered_at)}.
                </p>
              )}

              {/* Status "Completed" */}
              {order.status === "completed" && (
                <p className="text-[var(--forest)] font-bold">
                  Pesanan selesai 🎉 Terima kasih sudah berbelanja!
                </p>
              )}

              {/* Status "Cancelled" */}
              {order.status === "cancelled" && (
                <p className="text-[var(--terracotta-dark)]">
                  Pesanan dibatalkan {formatDate(order.cancelled_at)}.{" "}
                  {order.cancellation_reason && <span>Alasan: {order.cancellation_reason}</span>}
                </p>
              )}

              {/* Status "Expired" */}
              {order.status === "expired" && (
                <p className="text-[var(--text-muted)]">Pesanan kadaluarsa.</p>
              )}

              {/* Order Notes */}
              {order.note && (
                <p className="text-[var(--text-muted)] italic mt-2 pt-2 border-t border-[var(--cream-dark)]">
                  <span className="font-bold not-italic">Catatan: </span>
                  &quot;{order.note}&quot;
                </p>
              )}
            </div>

            {/* Items */}
            <div className="py-4">
              <h3 className="text-sm font-extrabold text-[var(--text-primary)] mb-3">Item Pesanan</h3>
              <div className="space-y-3 mb-6">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-3 bg-[var(--cream)] border border-[var(--cream-dark)] rounded-xl p-3"
                  >
                    <div className="bg-gray-300 w-12 h-12 rounded-lg flex items-center justify-center relative flex-shrink-0">
                      <Image
                        src={item.product ? item.product.thumbnail.media_url : '/assets/no-image.jpg'}
                        layout="fill"
                        alt="gambar"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-[var(--text-primary)] truncate">
                        {item.variant_name || item.product_name}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)] truncate">
                        {order.store.name}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[var(--terracotta)] font-extrabold text-sm">
                          {item.variant_price
                            ? item.variant_price.formatted
                            : item.product_price.formatted}
                        </span>
                        <span className="text-[var(--text-muted)] text-xs font-semibold">
                          x {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Address */}
              <h3 className="text-sm font-extrabold text-[var(--text-primary)] mb-3">Alamat Pengiriman</h3>
              <div className="bg-[var(--cream)] border border-[var(--cream-dark)] rounded-xl p-4 mb-6">
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {order.shipping_address_line},{" "}
                  {order.shipping_village.name},{" "}
                  {order.shipping_district?.name},{" "}
                  {order.shipping_regency?.name},{" "}
                  {order.shipping_province?.name},{" "}
                  <span className="font-bold">{order.shipping_postal_code}</span>
                </p>
                {order.shipping_note && (
                  <p className="text-sm text-[var(--text-muted)] mt-2 pt-2 border-t border-[var(--cream-dark)] italic">
                    <span className="font-bold not-italic">Catatan: </span>
                    &quot;{order.shipping_note}&quot;
                  </p>
                )}
              </div>

              {/* Payment Summary */}
              <h3 className="text-sm font-extrabold text-[var(--text-primary)] mb-3">Ringkasan Pembayaran</h3>
              <div className="bg-[var(--cream)] border border-[var(--cream-dark)] rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Subtotal</span>
                  <span className="font-semibold">{order.subtotal.formatted}</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Ongkos Kirim</span>
                  <span className="font-semibold">{order.shipping_cost.formatted}</span>
                </div>
                <hr className="border-[var(--cream-dark)] my-2" />
                <div className="flex justify-between font-extrabold text-base text-[var(--text-primary)]">
                  <span>Total</span>
                  <span className="text-[var(--terracotta)]">{order.total.formatted}</span>
                </div>
              </div>

              {order?.shipping_proof_images?.length > 0 && (
                <div className="mt-6">
                  <ShippingProofs proofs={order.shipping_proof_images} />
                </div>
              )}

              {order.shipping_notes && (
                <div className="mt-6 p-4 bg-[var(--cream)] border border-[var(--cream-dark)] rounded-xl">
                  <h3 className="text-sm font-extrabold text-[var(--text-primary)] mb-2">Catatan Pengiriman</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{order.shipping_notes}</p>
                </div>
              )}
            </div>

            <DialogFooter className="border-t border-[var(--cream-dark)] pt-4">
              <DialogClose asChild>
                <Button className="btn btn-secondary btn-sm" variant="outline">Tutup</Button>
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
    <div>
      <h3 className="text-sm font-extrabold text-[var(--text-primary)] mb-3">Bukti Pengiriman</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {proofs.map((proof, i) => (
          <div
            key={i}
            onClick={() => setSelectedImage(proof)}
            className="relative w-full h-32 bg-[var(--cream)] border border-[var(--cream-dark)] rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Image
              src={proof}
              alt={`Bukti Pengiriman ${i + 1}`}
              layout="fill"
              objectFit="cover"
              className="rounded-xl"
            />
          </div>
        ))}
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
    </div>
  );
}

const OrderDetailModalSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header */}
      <div className="border-b border-[var(--cream-dark)] pb-4 space-y-2">
        <Skeleton className="h-6 w-1/2 bg-gray-200" />
        <Skeleton className="h-4 w-1/3 bg-gray-200" />
      </div>

      {/* Status Badge */}
      <Skeleton className="w-24 h-6 rounded-full bg-gray-200" />

      {/* Status Detail Section */}
      <div className="p-4 bg-[var(--cream)] border border-[var(--cream-dark)] rounded-xl space-y-2">
        <Skeleton className="w-full h-4 bg-gray-200" />
        <Skeleton className="w-2/3 h-4 bg-gray-200" />
      </div>

      {/* Items */}
      <div className="space-y-2">
        <Skeleton className="w-1/4 h-5 bg-gray-200" />
        <div className="bg-[var(--cream)] border border-[var(--cream-dark)] rounded-xl p-3 flex items-center space-x-3">
          <Skeleton className="w-12 h-12 rounded-lg bg-gray-200" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-1/2 h-4 bg-gray-200" />
            <Skeleton className="w-1/3 h-3 bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Skeleton className="w-1/3 h-5 bg-gray-200" />
        <div className="bg-[var(--cream)] border border-[var(--cream-dark)] rounded-xl p-4 space-y-2">
          <Skeleton className="w-full h-4 bg-gray-200" />
          <Skeleton className="w-5/6 h-4 bg-gray-200" />
        </div>
      </div>

      {/* Payment Summary */}
      <div className="space-y-2">
        <Skeleton className="w-1/3 h-5 bg-gray-200" />
        <div className="bg-[var(--cream)] border border-[var(--cream-dark)] rounded-xl p-4 space-y-2">
          <Skeleton className="w-full h-4 bg-gray-200" />
          <Skeleton className="w-full h-4 bg-gray-200" />
        </div>
      </div>
    </div>
  );
};