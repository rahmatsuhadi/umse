import { apiClient } from "@/lib/api-client";
import type { PaginatedApiResponse, Store } from "@/types";

// Tipe untuk parameter query
type StoreQueryParams = {
  page?: number;
  per_page?: number;
  include?: string;
  category?: string;
  search?: string;
  filter?: {
    category__slug?: string;
    district_id?: string;
    [key: string]: string | number | undefined;
  };
  sort?: string;
};

/**
 * Mengambil daftar produk dengan paginasi dan filter.
 */



/**
 * Mengambil daftar produk dengan paginasi dan filter.
 */
export const getStores = (params: StoreQueryParams): Promise<PaginatedApiResponse<Store>> => {
  params = {
    ...params,
  }


  /**
  * Fungsi helper untuk mengubah objek params menjadi query string
  * dengan format yang benar untuk filter bersarang.
  */
  const buildQueryString = (p: StoreQueryParams): string => {
    const parts: string[] = [];

    // Loop melalui setiap key di objek params (misal: 'page', 'filter', 'sort')
    for (const key in p) {
      // Dapatkan nilai dari key tersebut
      const value = p[key as keyof StoreQueryParams];

      // Perlakuan khusus jika key adalah 'filter' dan nilainya adalah objek
      if (key === 'filter' && typeof value === 'object' && value !== null) {
        const filterObject = value as { [s: string]: string | number };

        // Loop melalui setiap key di dalam objek filter (misal: 'category__slug')
        for (const filterKey in filterObject) {
          if (Object.prototype.hasOwnProperty.call(filterObject, filterKey)) {
            const filterValue = filterObject[filterKey];
            if (filterValue !== undefined && filterValue !== null && filterValue !== '') {
              parts.push(`filter[${encodeURIComponent(filterKey)}]=${encodeURIComponent(filterValue)}`);
            }
          }
        }
      } else if (value !== undefined && value !== null && value !== '') {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
      }
    }
    return parts.join('&');
  };

  // Membuat query string dari objek params
  const query = buildQueryString(params);
  return apiClient<PaginatedApiResponse<Store>>(`/stores?${query}`);
};


/**
 * Mengambil satu store berdasarkan id-nya.
 */
export const getStoreById = (id: string): Promise<{ data: Store }> => {
  return apiClient<{ data: Store }>(`/stores/${id}`);
};