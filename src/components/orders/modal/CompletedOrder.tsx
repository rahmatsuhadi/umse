"use client"

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useCompleteOrder } from '@/features/order/hooks';
import { Order } from '@/types';

type Props = {
  open: boolean;
  onClose: () => void;
  order: Order;
};

export function CompleteOrderModal({ open, onClose, order }: Props) {
  const { mutate, isPending } = useCompleteOrder();

  const handleComplete = () => {
    mutate(order.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-sm bg-white border border-[var(--cream-dark)] p-7 shadow-xl flex flex-col gap-5" 
        style={{ 
          borderRadius: "var(--radius-lg)",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}
      >
        <DialogHeader className="border-b border-[var(--cream-dark)] pb-5" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <DialogTitle className="text-xl font-extrabold text-[var(--text-primary)] flex items-center gap-2.5" style={{ fontSize: "20px", lineHeight: "1.2" }}>
            <i className="fas fa-check-circle text-[var(--forest)] text-2xl"></i> Selesaikan Pesanan?
          </DialogTitle>
          <DialogDescription className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed" style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            Apakah Anda yakin ingin menyelesaikan pesanan <strong className="text-[var(--text-primary)]">#{order.order_number}</strong>?
            <span className="block mt-2 font-normal text-xs text-[var(--text-muted)]" style={{ display: "block", marginTop: "8px", fontSize: "12px", color: "var(--text-muted)" }}>
              Status pesanan akan diubah menjadi &quot;Selesai&quot; dan tindakan ini tidak dapat dibatalkan.
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="border-t border-[var(--cream-dark)] pt-5 gap-3" style={{ display: "flex", justifyContent: "end", gap: "12px", paddingTop: "20px" }}>
          <DialogClose asChild>
            <button type="button" className="btn btn-secondary btn-sm" disabled={isPending} style={{ padding: "10px 20px" }}>
              Batal
            </button>
          </DialogClose>
          <button 
            type="button" 
            onClick={handleComplete} 
            className="btn btn-primary btn-sm flex items-center justify-center gap-2" 
            style={{ 
              background: "var(--forest)", 
              color: "white", 
              padding: "10px 20px",
              boxShadow: "0 4px 12px rgba(39, 174, 96, 0.2)" 
            }}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <i className="fas fa-spinner animate-spin"></i>
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <i className="fas fa-check"></i>
                <span>Ya, Selesaikan</span>
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}