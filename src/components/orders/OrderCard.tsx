import { Order, ShippingItem } from '@/types';
import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/lib/format-date';
import { getStatusBadgeClass } from './lib';

interface OrderCardProps {
  order: Order;
  viewOrderDetail: (id: string) => void;
  onCompleteOrder: () => void;
  onDeliveredOrder: () => void;
  openReviewModal: (item: ShippingItem) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  viewOrderDetail,
  onCompleteOrder,
  onDeliveredOrder,
  openReviewModal,
}) => {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const router = useRouter();

  return (
    <div className="cart-store-container">
      {/* Top Gradient Header Bar */}
      <div className="cart-store-header-bar" />

      {/* Header Info */}
      <div className="cart-store-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 bg-[var(--cream)] border-b-[1.5px] border-[var(--cream-dark)]">
        <div>
          <h3 className="font-extrabold text-[var(--text-primary)] text-sm sm:text-base">#{order.order_number}</h3>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">{formatDate(order?.created_at)}</p>
        </div>
        <span className={getStatusBadgeClass(order.status == "awaiting_payment" ? order.payment_status : order.status)}>
          {order.status == "awaiting_payment" ? order.payment_status_label : order.status_label}
        </span>
      </div>

      <div>
        {/* Items List */}
        <div className="mb-2">
          {order.items.map((item, idx) => (
            <div 
              key={idx} 
              style={{ padding: '16px 20px' }}
              className="flex items-center justify-between gap-4 border-b border-[var(--cream-dark)] last:border-b-0"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="cart-item-img-wrapper relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                  <Image 
                    src={item.product ? item.product.thumbnail.media_url : "/assets/no-image.jpg"} 
                    layout='fill' 
                    alt='gambar' 
                    objectFit='cover' 
                    className='rounded-md' 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  {item.product ? (
                    <Link href={"/produk/" + item.product.id} className='hover:underline hover:cursor-pointer block'>
                      <h4 className="cart-item-title text-sm sm:text-base font-bold text-[var(--text-primary)] truncate">{item.product_name}</h4>
                    </Link>
                  ) : (
                    <h4 className="cart-item-title text-sm sm:text-base font-bold text-[var(--text-primary)] truncate">{item.product_name}</h4>                  
                  )}
                  <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{order.store.name}</p>
                  <p className="cart-item-price text-xs sm:text-sm font-extrabold mt-1">
                    {item.variant_price ? item.variant_price.formatted : item.product_price.formatted} <span className="text-xs font-normal text-[var(--text-muted)]">x {item.quantity}</span>
                  </p>
                </div>
              </div>

              {order.status == "completed" && (
                <div className="flex-shrink-0">
                  {item.review ? (
                    <span className="badge badge-forest">
                      Sudah diulas
                    </span>
                  ) : (
                    <button 
                      onClick={() => openReviewModal(item)} 
                      className="btn btn-primary btn-sm"
                    >
                      Ulasan
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary and Actions Footer Container */}
        <div style={{ padding: '0 20px 20px' }}>
          {/* Order Summary Box */}
          <div style={{ background: "var(--cream)", border: "1.5px dashed var(--cream-dark)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-[var(--text-muted)] font-medium">
                {totalItems} item • {order.status == "awaiting_payment" ? order.payment_status_label : order.status_label}
              </span>
              <span className="font-extrabold text-[var(--text-primary)] text-sm sm:text-base">
                Total: <span className="text-[var(--terracotta)]">{order.total.formatted}</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 justify-end" style={{ paddingTop: 12 }}>
            <button
              onClick={() => viewOrderDetail(order.id)}
              className="btn btn-secondary btn-sm"
            >
              Detail
            </button>

            {order.status == "awaiting_payment" && order.payment_status == "unpaid" && (
              <button 
                onClick={() => router.push("/pembayaran/" + order.id)} 
                className="btn btn-primary btn-sm"
              >
                Bayar
              </button>
            )}

            {((order.status == "pending" && order.payment_status == "paid") ||
              (order.status == "awaiting_payment" && order.payment_status == "unpaid") ||
              (order.status == "awaiting_payment" && order.payment_status == "pending") ||
              (order.status == "awaiting_payment" && order.payment_status == "rejected")) && (
              <Link 
                href={"/pembayaran/" + order.id + "/status"} 
                className="btn btn-secondary btn-sm"
                style={{ color: "var(--terracotta)", borderColor: "var(--terracotta)", borderWidth: "1.5px" }}
              >
                Status Bayar
              </Link>
            )}

            {order.payment_status == "rejected" && (
              <Link 
                href={`/pembayaran/${order.id}/upload-ulang`} 
                className="btn btn-primary btn-sm"
                style={{ background: "#E67E22" }}
              >
                Upload Ulang
              </Link>
            )}

            {order.status === 'delivered' && (
              <button 
                onClick={onCompleteOrder} 
                className="btn btn-primary btn-sm"
                style={{ background: "var(--forest)", color: "white" }}
              >
                Selesaikan Pesanan
              </button>
            )}

            {order.status === 'shipped' && (
              <button 
                onClick={onDeliveredOrder} 
                className="btn btn-primary btn-sm"
                style={{ background: "var(--terracotta-light)", color: "white" }}
              >
                Pesanan Diterima
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
