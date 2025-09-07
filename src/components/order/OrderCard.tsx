import { Order, ShippingItem } from '@/types';
import Image from 'next/image';
import React from 'react';
import { getStatusBadgeClass } from './OrderDetailModal';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/lib/format-date';
import { Button } from '../ui/button';

interface OrderCardProps {
  order: Order;
  // formatDate: (date: string) => string;
  viewOrderDetail: (id: string) => void;
  onCompleteOrder: () => void;
  // trackOrder: (id: string) => void;
  onDeliveredOrder: () => void;
  openReviewModal: (item: ShippingItem) => void;
  confirmReceived: (id: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  // formatDate,
  viewOrderDetail,
  onCompleteOrder,
  onDeliveredOrder,
  // trackOrder,
  openReviewModal,
  confirmReceived,
}) => {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);



  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">#{order.order_number}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{formatDate(order?.created_at)}</p>
          </div>
          <span className={`${getStatusBadgeClass(order.status == "awaiting_payment" ? order.payment_status : order.status)} px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium`}>
            {order.status == "awaiting_payment" ? order.payment_status_label : order.status_label}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <div className="bg-gray-300 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex relative items-center justify-center flex-shrink-0">

                <Image src={item.product.thumbnail.media_url} layout='fill' alt='gambar' objectFit='cover' className='rounded-sm' />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={"/produk/" + item.product.id} className='hover:underline hover:cursor-pointer'>
                  <h4 className="font-medium text-gray-800 text-xs sm:text-sm truncate">{item.product.name}</h4>
                </Link>
                <p className="text-xs text-gray-600 truncate">{order.store.name}</p>
                <p className="text-xs sm:text-sm text-primary font-medium">
                  {item.product.variants ? item.variant?.price.formatted : item.product.price.formatted} x {item.quantity}
                </p>
              </div>
              {/* <div className=""> */}
              {order.status == "completed" && (
                <>
                  {item.review ? (
                    <span className="text-green-600 text-sm font-medium">
                      <i className="fas fa-check-circle mr-1"></i>Sudah diulas
                    </span>
                  ) : (
                    <button onClick={() => openReviewModal(item)} className="bg-primary text-white px-2 sm:px-3 py-2 rounded-md hover:bg-primary-dark text-xs sm:text-sm flex items-center">
                      <i className="fas fa-star mr-1 text-xs"></i>Ulasan
                    </button>

                  )}
                </>
              )}
              {/* </div> */}
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-2 sm:p-3 mb-4">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">
              {totalItems} item • {order.status == "awaiting_payment" ? order.payment_status_label : order.status_label}
            </span>
            <span className="font-semibold text-gray-800">Total: {order.total.formatted}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => viewOrderDetail(order.id)}
              className="bg-gray-200  hover:cursor-pointer text-gray-700 px-3 sm:px-4 py-2 rounded-md hover:bg-gray-300 text-xs sm:text-sm flex items-center"
            >
              <i className="fas fa-eye mr-1 text-xs"></i>Detail
            </button>

            {order.status == "awaiting_payment" && order.payment_status == "unpaid" && (
              <button onClick={() => router.push("/pembayaran/" + order.id)} className="bg-primary hover:cursor-pointer text-white px-3 sm:px-4 py-2 rounded-md hover:bg-primary-dark text-xs sm:text-sm flex items-center">
                <i className="fas fa-credit-card mr-1 text-xs"></i>Bayar
              </button>
            )}

            {
              ((order.status == "pending" && order.payment_status == "paid") ||
                (order.status == "awaiting_payment" && order.payment_status == "unpaid") ||
                (order.status == "awaiting_payment" && order.payment_status == "pending") ||
                (order.status == "awaiting_payment" && order.payment_status == "rejected")) && (
                <Link href={"/pembayaran/" + order.id + "/status"} className="bg-blue-500 text-white px-3 sm:px-4 py-2  hover:cursor-pointer rounded-md hover:bg-blue-600 text-xs sm:text-sm flex items-center">
                  <i className="fas fa-receipt mr-1 text-xs"></i>Status Bayar
                </Link>
              )
            }

            {order.payment_status == "rejected" && (
              <Link href={`/pembayaran/${order.id}/upload-ulang`} className="bg-orange-500 text-white px-3 sm:px-4  hover:cursor-pointer py-2 rounded-md hover:bg-orange-600 text-xs sm:text-sm flex items-center">
                <i className="fas fa-upload mr-1 text-xs"></i>Upload Ulang
              </Link>
            )}

            {order.status === 'delivered' && (
              <Button onClick={onCompleteOrder} className="bg-green-500 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-green-600 text-xs sm:text-sm flex items-center">
                Selesaikan Pesanan
              </Button>
            )}

             {order.status === 'shipped' && (
              <Button onClick={onDeliveredOrder} className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-blue-600 text-xs sm:text-sm flex items-center">
                Pesanan Diterima
              </Button>
            )}

            {/* {order.status == "completed" &&(
              <button
                onClick={() => openReviewModal(order.id)}
                className="bg-primary text-white px-3 sm:px-4 py-2 rounded-md hover:bg-primary-dark text-xs sm:text-sm flex items-center"
              >
                <i className="fas fa-star mr-1 text-xs"></i>Ulasan
              </button>
            )} */}



          </div>

          {/* <div className="flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
            {order.status === 'completed' && !order.can_be_reviewed && (
              <span className="text-green-600 text-xs sm:text-sm">
                <i className="fas fa-check mr-1"></i>Sudah direview
              </span>
            )}

            {order.status === 'shipped' && (
              <button
                onClick={() => confirmReceived(order.id)}
                className="bg-green-500 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-green-600 text-xs sm:text-sm flex items-center w-full sm:w-auto justify-center"
              >
                <i className="fas fa-check mr-1 text-xs"></i>Terima
              </button>
            )}
          </div> */}
        </div>
      </div>

    </div>
  );
};

export default OrderCard;
