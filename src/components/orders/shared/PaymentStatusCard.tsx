import React from "react";
import { Order, StatusPayment } from "@/types";
import { CheckCircle2, XCircle, Clock, AlertCircle, Package } from "lucide-react";

interface Props {
  status: {
    status: StatusPayment;
    label: string;
  };
  order: Order;
}

interface PaymentStatus {
  status: StatusPayment;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  title: string;
  description: string;
}

const getStatus: Partial<Record<StatusPayment, PaymentStatus>> = {
  unpaid: {
    title: "Menunggu Pembayaran",
    status: "unpaid",
    color: "text-red-600",
    bgColor: "bg-red-100",
    description: "Pesanan Anda menunggu pembayaran",
    icon: AlertCircle,
  },
  paid: {
    title: "Pembayaran Diterima",
    status: "paid",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    description: "Pesanan Anda sudah dibayar",
    icon: CheckCircle2,
  },
  pending: {
    title: "Menunggu Verifikasi",
    status: "pending",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    description: "Bukti pembayaran sedang diverifikasi oleh penjual",
    icon: Clock,
  },
  rejected: {
    title: "Pembayaran Ditolak",
    status: "rejected",
    color: "text-red-600",
    bgColor: "bg-red-100",
    description: "Bukti pembayaran ditolak oleh penjual",
    icon: XCircle,
  },
};

export default function PaymentStatusCard({ status, order }: Props) {
  const paymentStatus = getStatus[status.status];

  if (!paymentStatus) {
    return <div>Status tidak ditemukan</div>;
  }

  const Icon = paymentStatus.icon ?? Package;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
      {/* Status Banner */}
      <div className="p-5 border-b border-gray-50">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${paymentStatus.bgColor} rounded-2xl flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-6 h-6 ${paymentStatus.color}`} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">{paymentStatus.title}</h2>
            <p className="text-gray-500 text-sm">{paymentStatus.description}</p>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="p-5">
        <OrderSummary order={order} />
      </div>
    </div>
  );
}


export const OrderSummary = ({ order }: { order: Order }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h4 className="font-semibold text-gray-700 text-sm mb-3 flex items-center gap-1.5">
        <Package className="w-3.5 h-3.5 text-primary" />
        Ringkasan Pesanan
      </h4>
      <div className="space-y-2">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">
              {item.product.name}{" "}
              <span className="text-gray-400 text-xs">({item.quantity}x)</span>
            </span>
            <span className="text-gray-800 text-sm font-medium">{item.product.price.formatted}</span>
          </div>
        ))}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">Ongkos Kirim</span>
          <span className="text-gray-800 text-sm font-medium">{order.shipping_cost.formatted}</span>
        </div>
        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center">
          <span className="text-gray-800 font-semibold text-sm">Total</span>
          <span className="text-primary font-bold text-base">{order.total.formatted}</span>
        </div>
      </div>
    </div>
  );
};