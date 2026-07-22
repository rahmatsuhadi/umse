"use client"

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
import { OrderTimeline } from "@/components/orders/OrderTimeLine";
import RejectionModal from "@/components/payments/PaymentRejectModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOrderPayments } from "@/features/order/hooks";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/format-date";
import type { StatusPayment } from "@/types";
import Image from "next/image";

type Props = {
  open: boolean;
  orderId: string;
  onClose: () => void;
};

export function PaymentStatusModal({ open, orderId, onClose }: Props) {
  const { data, isLoading } = useGetOrderPayments(orderId);
  const order = data?.data;
  const router = useRouter();

  const getBannerStyle = (statusKey: StatusPayment) => {
    switch (statusKey) {
      case "paid":
        return {
          bgStyle: {
            backgroundColor: "color-mix(in srgb, var(--forest) 15%, transparent)",
            borderColor: "color-mix(in srgb, var(--forest) 20%, transparent)"
          },
          textStyle: {
            color: "var(--forest-mid)"
          },
          icon: "fas fa-check-circle",
          title: "Pembayaran Terverifikasi",
          description: "Pembayaran Anda telah sukses diverifikasi oleh penjual."
        };
      case "rejected":
        return {
          bgStyle: {
            backgroundColor: "color-mix(in srgb, var(--terracotta) 15%, transparent)",
            borderColor: "color-mix(in srgb, var(--terracotta) 20%, transparent)"
          },
          textStyle: {
            color: "var(--terracotta-dark)"
          },
          icon: "fas fa-times-circle",
          title: "Pembayaran Ditolak",
          description: "Bukti pembayaran ditolak. Silakan unggah bukti transfer baru."
        };
      case "unpaid":
        return {
          bgStyle: {
            backgroundColor: "color-mix(in srgb, var(--terracotta) 15%, transparent)",
            borderColor: "color-mix(in srgb, var(--terracotta) 20%, transparent)"
          },
          textStyle: {
            color: "var(--terracotta-dark)"
          },
          icon: "fas fa-exclamation-circle",
          title: "Menunggu Pembayaran",
          description: "Pesanan Anda sedang menunggu pembayaran dari Anda."
        };
      default: // pending
        return {
          bgStyle: {
            backgroundColor: "color-mix(in srgb, var(--saffron) 15%, transparent)",
            borderColor: "color-mix(in srgb, var(--saffron) 20%, transparent)"
          },
          textStyle: {
            color: "color-mix(in srgb, var(--saffron) 80%, black)"
          },
          icon: "fas fa-clock",
          title: "Menunggu Verifikasi",
          description: "Bukti pembayaran sedang dalam proses verifikasi oleh penjual."
        };
    }
  };

  const bannerCfg = order ? getBannerStyle(order.payment_status) : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-lg w-full bg-white border border-[var(--cream-dark)] shadow-xl overflow-hidden"
        style={{ borderRadius: "var(--radius-lg)", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
      >
        {isLoading || !order ? (
          <SkeletonPage />
        ) : (
          <>
            {/* Header */}
            <DialogHeader className="px-7 pt-7 pb-5 border-b border-[var(--cream-dark)] flex-shrink-0">
              <div className="flex items-start justify-between gap-3">
                <DialogTitle className="text-xl font-extrabold text-[var(--text-primary)] flex items-center gap-2.5">
                  <i className="fas fa-credit-card text-[var(--terracotta)] text-2xl"></i>
                  Status Pembayaran #{order.order_number}
                </DialogTitle>
                {order.payment_status === "paid" && (
                  <span className="badge badge-forest flex-shrink-0 mt-1">Lunas</span>
                )}
                {order.payment_status === "pending" && (
                  <span className="badge badge-saffron flex-shrink-0 mt-1">Menunggu Verifikasi</span>
                )}
                {order.payment_status === "rejected" && (
                  <span className="badge badge-terracotta flex-shrink-0 mt-1">Ditolak</span>
                )}
                {order.payment_status === "unpaid" && (
                  <span className="badge badge-terracotta flex-shrink-0 mt-1">Belum Dibayar</span>
                )}
              </div>
              <DialogDescription className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 font-medium">
                <i className="far fa-calendar-alt text-[var(--brown-light)]"></i>
                Dibuat pada {formatDate(order.created_at)}
              </DialogDescription>
            </DialogHeader>

            {/* Scrollable Content Container */}
            <div className="overflow-y-auto flex-1 px-7 pb-7 pt-5 space-y-5">
              {/* Status Banner */}
              {bannerCfg && (
                <div
                  className="p-4 border rounded-[var(--radius-md)] text-sm flex items-start gap-3"
                  style={bannerCfg.bgStyle}
                >
                  <i
                    className={`${bannerCfg.icon} text-2xl mt-0.5 flex-shrink-0`}
                    style={bannerCfg.textStyle}
                  ></i>
                  <div className="space-y-0.5 flex-1">
                    <h4 className="font-bold" style={bannerCfg.textStyle}>
                      {bannerCfg.title}
                    </h4>
                    <p className="text-[var(--text-secondary)] text-xs leading-relaxed font-medium">
                      {bannerCfg.description}
                    </p>
                    {order.payment?.rejection_reason && order.payment_status === "rejected" && (
                      <p className="text-[var(--text-secondary)] text-xs mt-2 bg-white/60 p-2 rounded border border-[var(--cream-dark)]/30 font-semibold">
                        Alasan: {order.payment.rejection_reason}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Action for Rejected Payment */}
              {order.payment && order.payment.status === "rejected" && (
                <div className="bg-white border border-[var(--cream-dark)] rounded-[var(--radius-md)] p-5 shadow-sm">
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-semibold mb-4 leading-relaxed">
                    Bukti pembayaran Anda ditolak. Silakan unggah ulang bukti pembayaran Anda.
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <RejectionModal
                      reason={order.payment.rejection_reason ?? ""}
                      onUploadAgain={() => {
                        onClose();
                        router.push(`/pembayaran/${order.id}/upload-ulang`);
                      }}
                    />
                    <button
                      onClick={() => {
                        onClose();
                        router.push(`/pembayaran/${order.id}/upload-ulang`);
                      }}
                      className="btn btn-primary btn-sm flex items-center gap-2"
                    >
                      <i className="fas fa-redo text-xs"></i> Ulangi Pembayaran
                    </button>
                  </div>
                </div>
              )}

              {/* Items Pesanan */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <i className="fas fa-shopping-bag text-[var(--terracotta)] text-sm"></i>
                  <h3 className="text-sm font-extrabold text-[var(--text-primary)]">Item Pesanan</h3>
                </div>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div className="checkout-item-card" key={i}>
                      <div className="checkout-item-img-box" style={{ position: "relative", width: "64px", height: "64px", flexShrink: 0 }}>
                        <Image
                          src={item.product?.thumbnail?.media_url || '/assets/no-image.jpg'}
                          alt={item.product_name}
                          fill
                          style={{ objectFit: "cover", borderRadius: "var(--radius-sm)" }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="checkout-item-title">{item.variant_name || item.product_name}</h4>
                        <p className="text-[11px] text-[var(--text-muted)] font-medium mt-0.5">
                          <i className="fas fa-store text-[var(--brown-light)] mr-1"></i>
                          {order.store.name}
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="checkout-item-price">
                            {item.variant_price?.formatted ?? item.product_price.formatted}
                          </span>
                          <span className="text-[var(--text-muted)] text-xs font-bold bg-[var(--cream)] px-2.5 py-0.5 rounded-md border border-[var(--cream-dark)]">
                            x{item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary Card */}
              <div className="bg-white border border-[var(--cream-dark)] rounded-[var(--radius-md)] p-5 space-y-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <i className="fas fa-wallet text-[var(--terracotta)] text-sm"></i>
                  <h4 className="text-sm font-extrabold text-[var(--text-primary)]">Ringkasan Pembayaran</h4>
                </div>
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                    <span>Subtotal Produk</span>
                    <span className="font-bold">{order.subtotal.formatted}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                    <span>Ongkos Kirim</span>
                    <span className="font-bold">{order.shipping_cost.formatted}</span>
                  </div>
                  <hr className="border-[var(--cream-dark)]" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-extrabold text-[var(--text-primary)]">Total Belanja</span>
                    <span className="text-xl font-black text-[var(--terracotta)]">{order.total.formatted}</span>
                  </div>
                </div>
              </div>

              {/* Timeline Card */}
              <div className="bg-white border border-[var(--cream-dark)] rounded-[var(--radius-md)] p-5 shadow-sm">
                <OrderTimeline order={order} />
              </div>
            </div>

            {/* Footer */}
            <DialogFooter className="px-7 py-4 border-t border-[var(--cream-dark)] flex-shrink-0 flex justify-end">
              <DialogClose asChild>
                <button type="button" className="btn btn-secondary btn-sm">
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

const SkeletonPage = () => {
  return (
    <div className="p-7 space-y-5 animate-pulse overflow-y-auto flex-1">
      {/* status banner skeleton */}
      <div className="p-4 bg-[var(--cream)] border border-[var(--cream-dark)] rounded-[var(--radius-md)] space-y-2">
        <Skeleton className="w-1/3 h-5 bg-[var(--cream-dark)]/50" />
        <Skeleton className="w-2/3 h-4 bg-[var(--cream-dark)]/50" />
      </div>

      {/* order summary card skeleton */}
      <div className="border border-[var(--cream-dark)] rounded-[var(--radius-md)] p-5 space-y-3 bg-white shadow-sm">
        <Skeleton className="w-1/4 h-5 bg-[var(--cream-dark)]/50" />
        <div className="space-y-2">
          <Skeleton className="w-full h-4 bg-[var(--cream-dark)]/50" />
          <Skeleton className="w-full h-4 bg-[var(--cream-dark)]/50" />
        </div>
      </div>

      {/* timeline skeleton */}
      <div className="border border-[var(--cream-dark)] rounded-[var(--radius-lg)] p-5 space-y-4 bg-white shadow-sm">
        <Skeleton className="w-1/3 h-5 bg-[var(--cream-dark)]/50" />
        <div className="space-y-4 ml-4">
          <Skeleton className="w-2/3 h-4 bg-[var(--cream-dark)]/50" />
          <Skeleton className="w-2/3 h-4 bg-[var(--cream-dark)]/50" />
        </div>
      </div>
    </div>
  );
};
