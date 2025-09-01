import { apiClient } from "@/lib/api-client";
import type { Address, Order, PaginatedApiResponse, Payment } from "@/types";

export interface CreateOrderData {
  items: {
    cart_item_id: string,
    product_id?: string,
    quantity: number
    variant_id?: string,
  }[]
  shipping_service: string,
  shipping_service_type: string,
  store_id: string,
  address: {
    address_line: string,
    district_id: number,
    province_id: number,
    regency_id: number,
    village_id: number,
    recipient_name: string,
    recipient_phone_number: string,
    postal_code: number,
    note?: string
  }
}

export interface CreateOrderPayment {
  amount: number
  payment_proof: File
  sender_name: string
  paid_at: string
  payment_note?: string
}

// Tipe untuk parameter query
type OrderQueryParams = {
  page?: number;
  per_page?: number;
  include?: string;
  category?: string;
  search?: string;
};

/**
 * Mengambil daftar produk dengan paginasi dan filter.
 */
export const getOrders = (params: OrderQueryParams): Promise<PaginatedApiResponse<Order>> => {
  params = {
    ...params,
  }


  /**
  * Fungsi helper untuk mengubah objek params menjadi query string
  * dengan format yang benar untuk filter bersarang.
  */
  const buildQueryString = (p: OrderQueryParams): string => {
    const parts: string[] = [];

    // Loop melalui setiap key di objek params (misal: 'page', 'filter', 'sort')
    for (const key in p) {
      // Dapatkan nilai dari key tersebut
      const value = p[key as keyof OrderQueryParams];

      // Perlakuan khusus jika key adalah 'filter' dan nilainya adalah objek
      if (key === 'filter' && typeof value === 'object' && value !== null) {
        const filterObject = value as { [s: string]: string | number };

        // Loop melalui setiap key di dalam objek filter (misal: 'category__slug')
        for (const filterKey in filterObject) {
          if (Object.prototype.hasOwnProperty.call(filterObject, filterKey)) {
            const filterValue = filterObject[filterKey];
            // Format menjadi: filter[category__slug]=nilai
            parts.push(`filter[${encodeURIComponent(filterKey)}]=${encodeURIComponent(filterValue)}`);
          }
        }
      } else if (value !== undefined && value !== null) {
        // Untuk key lain (seperti 'page', 'per_page'), perlakukan seperti biasa
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
      }
    }
    return parts.join('&');
  };

  // Membuat query string dari objek params
  const query = buildQueryString(params);
  return apiClient<PaginatedApiResponse<Order>>(`/customer/orders?${query}`);
};


/** Menambah alamat baru */
export const createOrder = (data: CreateOrderData): Promise<{ data: Order }> => {
  return apiClient<{ data: Order }>('/customer/orders/checkout', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/** Menambah alamat baru */
export const createPayment = (id: string,data: CreateOrderPayment): Promise<{ data: Payment }> => {

  const formData = new FormData();
  formData.append('amount', String(data.amount));
  formData.append('paid_at', data.paid_at);
  formData.append('sender_name', data.sender_name);
  formData.append('payment_proof', data.payment_proof);


  // Kita perlu mengirim dengan header multipart/form-data
  return apiClient<{ data: Payment }>(`/customer/orders/${id}/payments`, {
    method: 'POST', 
    body: formData,
    headers: {
      // Hapus Content-Type agar browser otomatis mengaturnya untuk FormData
      'Content-Type': 'multipart/form-data',
    },
  });


  // return apiClient<{ data: Order }>(`/customer/orders/${id}/payments`, {
  //   method: 'POST',
  //   body: JSON.stringify(data),
  // });
};

export const getPaymentOrderById = (id: string): Promise<{ data: Order }> => {
  return apiClient<{ data: Order }>(`/customer/orders/${id}`);
};
