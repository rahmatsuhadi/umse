import { apiClient } from "@/lib/api-client";
import type { Review, PaginatedApiResponse } from "@/types";



export type CreateReviewData = {
  content: string
  order_item_id: string
  rating: number
  media: File[]
};

// Tipe untuk parameter query
export type ReviewQueryParams = {
  productId: string;
  page?: number;
  filter?:{
    rating?: number;
  }
  per_page?: number;
};

/**
 * Mengambil daftar ulasan untuk produk tertentu dengan paginasi.
 */
export const getReviews = (params: ReviewQueryParams): Promise<PaginatedApiResponse<Review>> => {

  const {productId, ...otherParams} = params
   

  const buildQueryString = (p: Omit<ReviewQueryParams, "productId">): string => {
    const parts: string[] = [];

    // Loop melalui setiap key di objek params (misal: 'page', 'filter', 'sort')
    for (const key in p) {
      // Dapatkan nilai dari key tersebut
      const value = p[key as keyof Omit<ReviewQueryParams, "productId">];

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

   const query = buildQueryString(otherParams);
  // Endpoint contoh: /products/ID_PRODUK/reviews?page=1&limit=5
  return apiClient<PaginatedApiResponse<Review>>(`/products/${params.productId}/reviews?${query}`);
};

/** Menambah review baru */
export const addReviewByOrderId = (id: string, data: CreateReviewData): Promise<Review> => {
  const formData = new FormData();

  // Menambahkan fields lainnya ke FormData
  formData.append('content', data.content);
  formData.append('order_item_id', data.order_item_id);
  formData.append('rating', data.rating.toString()); // rating as string for form data compatibility

  // Menambahkan media (file) ke FormData
  data.media.forEach((file, index) => {
    formData.append(`media[${index}]`, file); // Use the index to avoid collision
  });
  formData.append("_method", "POST");

  // Mengirimkan request dengan FormData
  return apiClient<Review>(`/customer/orders/${id}/reviews`, {
    method: 'POST',
    body: formData,
  });
};