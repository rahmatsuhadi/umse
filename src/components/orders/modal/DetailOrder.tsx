import React from "react";
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
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        {isLoading || !order ? (
          <OrderDetailModalSkeleton />
        ) : (
          <>
            {/* Header */}
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>Pesanan # {order?.order_number}</DialogTitle>
              </div>
              <DialogDescription className="text-sm text-gray-600">
                {formatDate(order.created_at)}
              </DialogDescription>
            </DialogHeader>

            {/* Status Badge */}
            <div className="py-2 border-b border-gray-200 flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status == "awaiting_payment" ? order.payment_status : order.status
                )}`}
              >
                {order.status == "awaiting_payment" ? order.payment_status_label : order.status_label}

              </span>
            </div>


            {/* Status Detail Section */}
            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm space-y-2">
              {/* Status "Awaiting Payment" */}
              {order.status === "awaiting_payment" && (
                <>
                  {order.payment_status === "rejected" && (
                    <>
                      <p className="text-yellow-700 font-medium">Pembayaran ditolak oleh penjual.</p>
                      {order.payment?.rejection_reason && (
                        <p className="text-yellow-700 font-medium">
                          Alasan: {order.payment.rejection_reason }
                        </p>
                      )}
                    </>
                  )}
                  {order.payment_status === "unpaid" && (
                    <p className="text-yellow-700 font-medium">
                      Menunggu pembayaran sebelum {formatDate(order.payment_due_at)}
                    </p>
                  )}
                  {order.payment_status === "pending" && (
                    <p className="text-yellow-700 font-medium">
                      Menunggu Konfirmasi pembayaran dari penjual
                    </p>
                  )}
                  {order.payment_status === "paid" && (
                    <p className="text-gray-700">
                      Pembayaran Terverifikasi. Pesanan sedang menunggu konfirmasi dari penjual
                      {order.payment?.verified_at && ` sejak ${formatDate(order.payment.verified_at)}.`}
                    </p>
                  )}
                </>
              )}

              {/* Status "Pending" with Paid Payment */}
              {order.status === "pending" && order.payment_status === "paid" && (
                <p className="text-yellow-700 font-medium">
                  Pembayaran Berhasil. Menunggu konfirmasi pesanan diproses penjual
                </p>
              )}

              {/* Status "Processing" */}
              {order.status === "processing" && (
                <p className="text-gray-700">
                  Pesanan sedang diproses dan dikemas oleh penjual
                </p>
              )}

              {/* Status "Shipped" */}
              {order.status === "shipped" && (
                <>
                  <p className="text-gray-700">
                    Pesanan dikirim {formatDate(order.shipped_at)} dengan{" "}
                    {order.shipping_service?.toUpperCase()} ({order.shipping_service_type})
                  </p>
                  {order.estimated_delivery && (
                    <p className="text-gray-600">
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
                          // Kalau beda bulan/tahun, tampilkan lengkap dua-duanya
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
                    <p className="text-blue-600 font-mono break-all">Resi: {order.tracking_number}</p>
                  )}
                </>
              )}

              {/* Status "Delivered" */}
              {order.status === "delivered" && (
                <p className="text-green-700 font-medium">
                  Pesanan terkirim {formatDate(order.delivered_at)}.
                </p>
              )}

              {/* Status "Completed" */}
              {order.status === "completed" && (
                <p className="text-green-700 font-medium">
                  Pesanan selesai 🎉 Terima kasih sudah berbelanja!
                </p>
              )}

              {/* Status "Cancelled" */}
              {order.status === "cancelled" && (
                <p className="text-red-600">
                  Pesanan dibatalkan {formatDate(order.cancelled_at)}.{" "}
                  {order.cancellation_reason && <span>Alasan: {order.cancellation_reason}</span>}
                </p>
              )}

              {/* Status "Expired" */}
              {order.status === "expired" && (
                <p className="text-gray-700">Pesanan kadaluarsa.</p>
              )}

              {/* Order Notes */}
              {order.note && (
                <p className="text-gray-600">
                  <span className="font-medium">Catatan: </span>
                  {order.note}
                </p>
              )}
            </div>


            {/* Items */}
            <div className="py-4">
              <h3 className="font-semibold mb-2">Item Pesanan</h3>
              <div className="space-y-4 mb-6">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3"
                  >
                    <div className="bg-gray-300 w-12 h-12 rounded-lg flex items-center justify-center relative">
                      <Image
                        src={item.product ? item.product.thumbnail.media_url : '/assets/no-image.jpg'}
                        layout="fill"
                        alt="gambar"
                        objectFit="cover"
                        className="rounded-sm"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {item.variant_name || item.product_name}
                      </h4>
                      <p className="text-xs text-gray-600 truncate">
                        {order.store.name}
                      </p>
                      <div className="flex justify-between mt-1">
                        <span className="text-primary font-bold text-sm">
                          {item.variant_price
                            ? item.variant_price.formatted
                            : item.product_price.formatted}
                        </span>
                        <span className="text-gray-600 text-xs">
                          x {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Address */}
              <h3 className="font-semibold mb-2">Alamat Pengiriman</h3>
              <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <p className="text-gray-800 text-sm leading-relaxed">
                  {order.shipping_address_line},{" "}
                  {order.shipping_village.name},{" "}
                  {order.shipping_district?.name},{" "}
                  {order.shipping_regency?.name},{" "}
                  {order.shipping_province?.name},{" "}
                  {order.shipping_postal_code}
                </p>
                {order.shipping_note && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Catatan: </span>
                    {order.shipping_note}
                  </p>
                )}
              </div>

              {/* Payment Summary */}
              <h3 className="font-semibold mb-2">Ringkasan Pembayaran</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{order.subtotal.formatted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkos Kirim</span>
                  <span>{order.shipping_cost.formatted}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span className="text-primary">{order.total.formatted}</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Tutup</Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}


const OrderDetailModalSkeleton = () => {
  return (
    <div className="">
      {/* Header */}
      <DialogHeader className="space-y-1">
        <DialogTitle></DialogTitle>
        <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
        <div className="h-3 w-1/3 bg-gray-300 rounded"></div>
      </DialogHeader>

      {/* Status Badge */}
      <div className="py-2 border-b border-gray-200 flex items-center gap-2">
        <Skeleton className="w-24 h-4 rounded-full" />
      </div>

      {/* Status Detail Section */}
      <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm space-y-2">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
      </div>

      {/* Items */}
      <div className="">
        <h3 className="font-semibold mb-2">Item Pesanan</h3>
        <div className="space-y-4 mb-6">
          {[...Array(1)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div className="flex-1 min-w-0">
                <Skeleton className="w-1/2 h-4 mb-2" />
                <Skeleton className="w-1/3 h-4 mb-2" />
                <Skeleton className="w-1/4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Address */}
      <div className="py-1">
        <h3 className="font-semibold mb-2">Alamat Pengiriman</h3>
        <div className="bg-gray-50 rounded-lg p-3 mb-6">
          <Skeleton className="w-full h-6 mb-4" />
          <Skeleton className="w-2/3 h-4" />
        </div>
      </div>

      {/* Payment Summary */}
      <div className="">
        <h3 className="font-semibold mb-2">Ringkasan Pembayaran</h3>
        <div className="space-y-2 text-sm">
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-full h-6" />
        </div>
      </div>
    </div>
  );
};