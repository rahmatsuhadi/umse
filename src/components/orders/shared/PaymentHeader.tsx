import { formatDate } from "@/lib/format-date";
import { Hash, Calendar } from "lucide-react";

interface Props {
  orderId: string;
  date: string | null;
}

export default function PaymentHeader({ orderId, date }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800 mb-1">Status Pembayaran</h1>
          <div className="flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-primary" />
            <p className="text-sm text-gray-500">
              Pesanan{" "}
              <span id="orderNumber" className="font-semibold text-primary">
                {orderId}
              </span>
            </p>
          </div>
        </div>
        {date && (
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-sm text-gray-500">{formatDate(date)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
