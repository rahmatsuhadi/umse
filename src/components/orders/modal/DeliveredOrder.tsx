"use client"

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useDeliveredOrder } from '@/features/order/hooks';
import { Order } from '@/types';

type Props = {
  open: boolean;
  onClose: () => void;
  order: Order;
};

export function DeliveredOrderModal({ open, onClose, order }: Props) {
  const { mutate, isPending } = useDeliveredOrder();

  const handleComplete = () => {
    mutate(order.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent style={{ borderRadius: "var(--radius-md)" }} className="max-w-sm">
        <DialogHeader className="border-b border-[var(--cream-dark)] pb-4">
          <DialogTitle className="text-lg font-extrabold text-[var(--text-primary)]">
            Pesanan Sampai?
          </DialogTitle>
          <DialogDescription className="pt-2 text-sm text-[var(--text-muted)] leading-relaxed">
            Apakah Anda yakin pesanan <strong className="text-[var(--text-primary)]">#{order.order_number}</strong> sudah sampai?
            <span className="block mt-2">Status pesanan akan diubah menjadi &quot;Sampai&quot; dan tindakan ini tidak dapat dibatalkan.</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4 gap-2">
          <DialogClose asChild>
            <button type="button" className="btn btn-secondary btn-sm" disabled={isPending}>
              Batal
            </button>
          </DialogClose>
          <button 
            type="button" 
            onClick={handleComplete} 
            className="btn btn-primary btn-sm" 
            style={{ background: "var(--terracotta)" }}
            disabled={isPending}
          >
            {isPending ? "Memproses..." : "Ya, Pesanan Diterima"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}