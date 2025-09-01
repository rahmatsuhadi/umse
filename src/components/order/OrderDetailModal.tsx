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
import Link from "next/link";


type Props = {
  open: boolean;
  orderId: string;
  onClose: () => void;
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case "completed":
    case "delivered":
    case "paid":
      return "bg-green-100 text-green-800";
    case "awaiting_payment":
    case "processing":
      return "bg-blue-100 text-yellow-800";
    case "shipped":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
    case "refunded":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function OrderDetailModal({ open, orderId, onClose }: Props) {


  const { data, isLoading, error } = useGetOrderPayments(orderId)
  const order = data?.data

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">

        {isLoading || !order ? (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>
                  Detail Pesanan
                  {/* <Skeleton className="h-10 w-[100px]"/> */}
                </DialogTitle>

              </div>
              {/* <DialogDescription className="text-sm text-gray-600">
                  
                </DialogDescription> */}
            </DialogHeader>
            <div>
              <p className="text-sm text-gray-500">Memuat data pemesanan...</p>

            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>Pesanan # {order?.order_number}</DialogTitle>

              </div>
              <DialogDescription className="text-sm text-gray-600">
                {formatDate(order.created_at)}
              </DialogDescription>
            </DialogHeader>

            <div className="py-2 border-b border-gray-200 flex items-center justify-between">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}
              >
                {order.status_label}
              </span>


            </div>


            {/* Status Detail Section */}
            <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm space-y-2">
              {order.status === "awaiting_payment" && order.payment_status == "pending" && (
                <>
                  <p className="text-yellow-700 font-medium">
                    Status Pembayaran: {order.payment_status_label}
                  </p>
                </>
              )}

              {order.status === "awaiting_payment" && order.payment_status == "unpaid" && (
                <>
                  <p className="text-yellow-700 font-medium">
                    Menunggu pembayaran sebelum{" "}
                    {formatDate(order.payment_due_at)}
                  </p>
                  <Link
                    href={`/pembayaran/${order.id}`}
                    className="inline-block text-blue-600 hover:underline text-sm"
                  >
                    <i className="fas fa-credit-card mr-1" />
                    Lanjutkan Pembayaran
                  </Link>
                </>
              )}

              {order.status === "pending" && (
                <p className="text-gray-700">
                  Pesanan sedang menunggu konfirmasi dari penjual.
                </p>
              )}

              {order.status === "processing" && (
                <p className="text-gray-700">
                  Pesanan sedang diproses dan dikemas oleh penjual.
                </p>
              )}

              {order.status === "shipped" && (
                <>
                  <p className="text-gray-700">
                    Pesanan telah dikirim dengan {order.shipping_service?.toUpperCase()}{" "}
                    ({order.shipping_service_type})
                  </p>
                  <p className="text-gray-600">
                    Estimasi sampai: {order.estimated_delivery} hari
                  </p>
                  {order.tracking_number && (
                    <p className="text-blue-600 font-mono break-all">
                      Resi: {order.tracking_number}
                    </p>
                  )}
                </>
              )}

              {order.status === "delivered" && (
                <p className="text-green-700 font-medium">
                  Pesanan sudah sampai di alamat tujuan.
                </p>
              )}

              {order.status === "completed" && (
                <p className="text-green-700 font-medium">
                  Pesanan selesai 🎉 Terima kasih sudah berbelanja!
                </p>
              )}

              {(order.status === "cancelled") && (
                <p className="text-red-600">
                  Pesanan dibatalkan.{" "}
                  {order.cancellation_reason && (
                    <span>Alasan: {order.cancellation_reason}</span>
                  )}
                </p>
              )}
            </div>


            <div className="py-4">
              <h3 className="font-semibold mb-2">Item Pesanan</h3>
              <div className="space-y-4 mb-6">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                    <div className="bg-gray-300 w-12 h-12 rounded-lg flex items-center justify-center relative">
                      <Image src={item.product.thumbnail.media_url} layout='fill' alt='gambar' objectFit='cover' className='rounded-sm' />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                      <p className="text-xs text-gray-600 truncate">{order.store.name}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-primary font-bold text-sm">{item.variant ? item.variant.price.formatted : item.product.price.formatted}</span>
                        <span className="text-gray-600 text-xs">x{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="font-semibold mb-2">Alamat Pengiriman</h3>
              <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <p className="text-gray-800 text-sm leading-relaxed">
                  {order.shipping_address_line}, {order.shipping_village.name}, {order.shipping_district?.name}, {order.shipping_regency?.name}, {order.shipping_province?.name}, {order.shipping_postal_code}
                </p>
              </div>



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

              {/* {order.trackingNumber && (
              <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-1 text-sm">Nomor Resi</h4>
                <p className="font-mono text-blue-600 text-sm break-all">{order.trackingNumber}</p>
              </div>
            )} */}
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
