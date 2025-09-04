import { apiClient } from "@/lib/api-client";
import type { Product, PaginatedApiResponse } from "@/types";

// Tipe untuk parameter query
type ProductQueryParams = {
  page?: number;
  per_page?: number;
  include?: string;
  category?: string;
  q?: string;
};

/**
 * Mengambil daftar produk dengan paginasi dan filter.
 */
export const getProducts = (params: ProductQueryParams): Promise<PaginatedApiResponse<Product>> => {
  params  ={
    ...params,
  }


   /**
   * Fungsi helper untuk mengubah objek params menjadi query string
   * dengan format yang benar untuk filter bersarang.
   */
  const buildQueryString = (p: ProductQueryParams): string => {
    const parts: string[] = [];

    // Loop melalui setiap key di objek params (misal: 'page', 'filter', 'sort')
    for (const key in p) {
      // Dapatkan nilai dari key tersebut
      const value = p[key as keyof ProductQueryParams];

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
  return apiClient<PaginatedApiResponse<Product>>(`/products?${query}`);
};



/**
 * Mengambil daftar produk dengan paginasi dan filter.
 */
export const getProductsByStore = (id:string,params: ProductQueryParams): Promise<PaginatedApiResponse<Product>> => {
  params  ={
    ...params,
  }


   /**
   * Fungsi helper untuk mengubah objek params menjadi query string
   * dengan format yang benar untuk filter bersarang.
   */
  const buildQueryString = (p: ProductQueryParams): string => {
    const parts: string[] = [];

    // Loop melalui setiap key di objek params (misal: 'page', 'filter', 'sort')
    for (const key in p) {
      // Dapatkan nilai dari key tersebut
      const value = p[key as keyof ProductQueryParams];

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
  return apiClient<PaginatedApiResponse<Product>>(`/stores/${id}/products?${query}`);
};


/**
 * Mengambil satu produk berdasarkan slug-nya.
 */
export const getProductBySlug = (slug: string): Promise<Product> => {
  return apiClient<Product>(`/products/${slug}`);
};

/**
 * Mengambil satu produk berdasarkan id-nya.
 */
export const getProductById = (id: string): Promise<{data:Product}> => {
  return apiClient<{data:Product}>(`/products/${id}`);
};