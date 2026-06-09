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
import PaymentHeader from "@/components/orders/shared/PaymentHeader";
import PaymentStatusCard from "@/components/orders/shared/PaymentStatusCard";
import RejectionModal from "@/components/payments/PaymentRejectModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOrderPayments } from "@/features/order/hooks";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  orderId: string;
  onClose: () => void;
};

export function PaymentStatusModal({ open, orderId, onClose }: Props) {
  const { data, isLoading } = useGetOrderPayments(orderId);
  const order = data?.data;
  const router = useRouter();

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
          <SkeletonPage />
        ) : (
          <>
            {/* Header */}
            <DialogHeader className="border-b border-[var(--cream-dark)] pb-5" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <DialogTitle className="text-xl font-extrabold text-[var(--text-primary)] flex items-center gap-2.5" style={{ fontSize: "20px", lineHeight: "1.2" }}>
                <i className="fas fa-credit-card text-[var(--terracotta)] text-2xl"></i> Status Pembayaran #{order.order_number}
              </DialogTitle>
              <DialogDescription className="text-xs text-[var(--text-muted)] mt-1.5 flex items-center gap-1.5 font-medium" style={{ fontSize: "12px" }}>
                Pantau status verifikasi pembayaran dan detail riwayat transaksi pesanan Anda.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <PaymentHeader orderId={order.order_number} date={order.payment ? order.payment.created_at : null} />
              <PaymentStatusCard
                status={{ status: order.payment_status, label: order.status_label }}
                order={order}
              />

              <OrderTimeline order={order} />

              {order.payment && order.payment.status == "rejected" && (
                <div className="cart-sidebar-panel bg-white p-6 mt-4 border border-[var(--cream-dark)] rounded-[var(--radius-md)]">
                  <p className="text-sm text-[var(--text-secondary)] font-medium mb-4">
                    Bukti pembayaran Anda ditolak. Silakan upload ulang atau lihat alasan penolakan.
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <RejectionModal
                      reason={order.payment.rejection_reason ?? ""}
                      onUploadAgain={() => {
                        onClose();
                        router.push(`/pembayaran/${order.id}/upload-ulang`);
                      }}
                    />
                    <Button
                      onClick={() => {
                        onClose();
                        router.push(`/pembayaran/${order.id}/upload-ulang`);
                      }}
                      className="btn btn-primary"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Ulangi Pembayaran
                    </Button>
                  </div>
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

const SkeletonPage = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* payment header */}
      <div className="bg-white rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] border border-[var(--cream-dark)] p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="w-full space-y-2">
            <Skeleton className="h-5 w-[40%]" />
            <Skeleton className="h-4 w-[30%]" />
          </div>
          <Skeleton className="h-8 w-32 rounded-[var(--radius-sm)]" />
        </div>
      </div>

      {/* status card */}
      <div className="bg-white rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] border border-[var(--cream-dark)] overflow-hidden">
        <div className="p-5 border-b border-[var(--cream-dark)]/30">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-[var(--radius-sm)]" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-[35%]" />
              <Skeleton className="h-4 w-[55%]" />
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="bg-[var(--cream)] rounded-[var(--radius-sm)] border border-[var(--cream-dark)]/50 p-4 space-y-3">
            <Skeleton className="h-4 w-[25%]" />
            {Array(2)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-[40%]" />
                  <Skeleton className="h-4 w-[20%]" />
                </div>
              ))}
            <div className="border-t border-[var(--cream-dark)] pt-2 flex justify-between">
              <Skeleton className="h-5 w-[15%]" />
              <Skeleton className="h-5 w-[25%]" />
            </div>
          </div>
        </div>
      </div>

      {/* timeline */}
      <div className="bg-white rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] border border-[var(--cream-dark)] p-5">
        <div className="flex items-center gap-2 mb-5">
          <Skeleton className="h-8 w-8 rounded-[var(--radius-sm)]" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="space-y-6 ml-4">
          {Array(2)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="ml-6 flex justify-between">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
