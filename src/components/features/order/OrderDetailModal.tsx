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
import { Order } from "./OrderCard";


type Props = {
  open: boolean;
  order: Order | null;
  onClose: () => void;
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(price);

export default function OrderDetailModal({ open, order, onClose }: Props) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Pesanan #{order.id}</DialogTitle>
            {/* <DialogClose asChild>
              <button className="text-gray-500 hover:text-gray-700">
                <i className="fas fa-times text-lg"></i>
              </button>
            </DialogClose> */}
          </div>
          <DialogDescription className="text-sm text-gray-600">
            {formatDate(order.date)}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 border-b border-gray-200">
          <span className={`${order.statusClass} px-2 py-1 rounded-full text-xs`}>
            {order.statusText}
          </span>
        </div>

        <div className="py-4">
          <h3 className="font-semibold mb-2">Item Pesanan</h3>
          <div className="space-y-4 mb-6">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                <div className="bg-gray-300 w-12 h-12 rounded-lg flex items-center justify-center">
                  <i className="fas fa-image text-gray-500 text-sm"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-gray-600 truncate">{item.seller}</p>
                  <div className="flex justify-between mt-1">
                    <span className="text-primary font-bold text-sm">{formatPrice(item.price)}</span>
                    <span className="text-gray-600 text-xs">x{item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-semibold mb-2">Alamat Pengiriman</h3>
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <p className="text-gray-800 text-sm">{order.shipping.address}</p>
          </div>

          <h3 className="font-semibold mb-2">Ringkasan Pembayaran</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(order.total - order.shipping.cost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Ongkos Kirim</span>
              <span>{formatPrice(order.shipping.cost)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>

          {order.trackingNumber && (
            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-1 text-sm">Nomor Resi</h4>
              <p className="font-mono text-blue-600 text-sm break-all">{order.trackingNumber}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Tutup</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
