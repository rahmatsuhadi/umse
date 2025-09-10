"use client"

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCompleteOrder } from '@/features/order/hooks'; // Sesuaikan path
import { Order } from '@/types'; // Sesuaikan path

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
        onClose(); // Tutup modal jika mutasi sukses
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Selesaikan Pesanan?</DialogTitle>
          <DialogDescription className="pt-2">
            Apakah Anda yakin ingin menyelesaikan pesanan <strong>{order.order_number}</strong>?
            {`Status pesanan akan diubah menjadi "Selesai" dan tindakan ini tidak dapat dibatalkan.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              Batal
            </Button>
          </DialogClose>
          <Button onClick={handleComplete} disabled={isPending}>
            {isPending ? "Memproses..." : "Ya, Selesaikan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}