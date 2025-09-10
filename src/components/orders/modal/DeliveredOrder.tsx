"use client"

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {  useDeliveredOrder } from '@/features/order/hooks'; // Sesuaikan path
import { Order } from '@/types'; // Sesuaikan path

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
        onClose(); // Tutup modal jika mutasi sukses
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pesanan Sampai?</DialogTitle>
          <DialogDescription className="pt-2">
            Apakah Anda yakin pesanan <strong>{order.order_number}</strong> sudah sampai?
            {`Status pesanan akan diubah menjadi "Sampai" dan tindakan ini tidak dapat dibatalkan.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              Batal
            </Button>
          </DialogClose>
          <Button onClick={handleComplete} disabled={isPending}>
            {isPending ? "Memproses..." : "Ya, Pesanan Diterima"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}