import { getStatusBadgeClass } from "@/components/orders/lib";
import { Order, StatusPayment } from "@/types";

interface Props {
  status: {
    status: StatusPayment;
    label: string
  };  // Status yang diterima
  order: Order;      // Daftar item pesanan
}

interface PaymentStatus {
  status: StatusPayment;
  icon: string;
  color: string;
  title: string;
  description: string;
}

const getStatus: Record<StatusPayment, Partial<PaymentStatus>> = {
  unpaid: {
    title: 'Menunggu Pembayaran',
    status: 'unpaid',
    color: 'red',
    description: 'Pesanan Anda menunggu pembayaran',
    icon: 'fas fa-exclamation-circle',
  },
  paid: {
    title: 'Pembayaran Diterima',
    status: 'paid',
    color: 'green',
    description: 'Pesanan Anda sudah dibayar',
    icon: 'fas fa-check-circle',
  },
  pending: {
    title: 'Menunggu Verifikasi',
    status: 'pending',
    color: 'yellow',
    description: 'Bukti pembayaran sedang diverifikasi oleh penjual',
    icon: 'fas fa-clock',
  },
  rejected: {
    title: 'Pembayaran Ditolak',
    status: 'rejected',
    color: 'red',
    description: 'Bukti pembayaran ditolak oleh penjual',
    icon: 'fas fa-times-circle',
  },
} as Record<StatusPayment, Partial<PaymentStatus>>;

export default function PaymentStatusCard({ status, order }: Props) {
  // Ambil status berdasarkan key
  const paymentStatus = getStatus[status.status];

  // Periksa apakah status ditemukan dalam getStatus
  if (!paymentStatus) {
    return <div>Status tidak ditemukan</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md mb-6 p-6">
      <div className="flex items-center mb-4">
        <div className={`w-12 xs:w-8 sm:w-12 h-12 ${getStatusBadgeClass(status.status)} rounded-full flex items-center justify-center mr-4`}>
          <i className={`${paymentStatus.icon} text-${paymentStatus.color}-500 text-lg  md:text-xl`}></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{paymentStatus.title}</h2>
          <p className="text-gray-600">{paymentStatus.description}</p>
        </div>
      </div>

      {/* Order Summary */}
      <OrderSummary order={order} />

      {/* Shipping Address */}

    </div>
  );
}


export const OrderSummary = ({ order }: { order: Order }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="font-medium text-gray-800 mb-2">Ringkasan Pesanan</h4>
      {order.items.map((item, index) => (
        <div key={index} className="flex justify-between mb-1">
          <span className="text-gray-600">{item.product.name} ({item.quantity}x)</span>
          <span className="text-gray-800">{item.product.price.formatted}</span>
        </div>
      ))}
      <div className="flex justify-between mb-1">
        <span className="text-gray-600">Ongkos Kirim</span>
        <span className="text-gray-800">{order.shipping_cost.formatted}</span>
      </div>
      <hr className="my-2" />
      <div className="flex justify-between font-bold">
        <span className="text-gray-800">Total</span>
        <span className="text-primary">{order.total.formatted}</span>
      </div>
    </div>
  )
}