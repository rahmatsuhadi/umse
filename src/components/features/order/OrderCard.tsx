import { Order } from '@/types';
import Image from 'next/image';
import React from 'react';
import { getStatusBadgeClass } from './OrderDetailModal';

interface OrderCardProps {
  order: Order;
  formatDate: (date: string) => string;
  viewOrderDetail: (id: string) => void;
  trackOrder: (id: string) => void;
  openReviewModal: (id: string) => void;
  confirmReceived: (id: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  formatDate,
  viewOrderDetail,
  trackOrder,
  openReviewModal,
  confirmReceived,
}) => {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">#{order.order_number}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{formatDate(order?.created_at)}</p>
          </div>
          <span className={`${getStatusBadgeClass(order.status)} px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium`}>
            {order.status_label}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <div className="bg-gray-300 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex relative items-center justify-center flex-shrink-0">

                <Image src={item.product.thumbnail.media_url} layout='fill' alt='gambar' objectFit='cover' className='rounded-sm' />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 text-xs sm:text-sm truncate">{item.product.name}</h4>
                <p className="text-xs text-gray-600 truncate">{order.store.name}</p>
                <p className="text-xs sm:text-sm text-primary font-medium">
                  {item.product.variants ? item.variant?.price.formatted : item.product.price.formatted} x {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-2 sm:p-3 mb-4">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">
              {totalItems} item 
            </span>
            <span className="font-semibold text-gray-800">Total: {order.total.formatted}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => viewOrderDetail(order.id)}
              className="bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-md hover:bg-gray-300 text-xs sm:text-sm flex items-center"
            >
              <i className="fas fa-eye mr-1 text-xs"></i>Detail
            </button>

            {order.status === 'shipped' && (
              <button
                onClick={() => trackOrder(order.id)}
                className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-blue-600 text-xs sm:text-sm flex items-center"
              >
                <i className="fas fa-truck mr-1 text-xs"></i>Lacak
              </button>
            )}

            {order.status=="completed" && (
              <button
                onClick={() => openReviewModal(order.id)}
                className="bg-primary text-white px-3 sm:px-4 py-2 rounded-md hover:bg-primary-dark text-xs sm:text-sm flex items-center"
              >
                <i className="fas fa-star mr-1 text-xs"></i>Ulasan
              </button>
            )}


          </div>

          <div className="flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
            {/* {order.status === 'completed' && (
              <span className="text-green-600 text-xs sm:text-sm">
                <i className="fas fa-check mr-1"></i>Sudah direview
              </span>
            )} */}

            {order.status === 'shipped' && (
              <button
                onClick={() => confirmReceived(order.id)}
                className="bg-green-500 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-green-600 text-xs sm:text-sm flex items-center w-full sm:w-auto justify-center"
              >
                <i className="fas fa-check mr-1 text-xs"></i>Terima
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default OrderCard;
