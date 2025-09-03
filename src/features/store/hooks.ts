import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { PaginatedApiResponse, Product, Store } from "@/types";
import { getStoreById, getStores } from "./api";

type StoresQueryParams = {
  page?: number;
  limit?: number;
  per_page?: number;
  search?: string;
  filter?: {
    // category_id?: string;          // UUID
    category__slug?: string;       // string
    min_price?: number;
    max_price?: number;
  };
  sort?: string
};

// Hook untuk mengambil daftar produk
export const useStores = (params: StoresQueryParams) => {
  return useQuery<PaginatedApiResponse<Store>, Error>({
    // Kunci query harus menyertakan params agar cache unik untuk setiap filter
    queryKey: ["stores", params],
    queryFn: () => getStores(params),
  });
};

// Hook untuk mengambil satu produk
export const useStore = (id: string) => {
  return useQuery<{ data: Store }, Error>({
    queryKey: ["store", id], // Kunci query unik untuk produk ini
    queryFn: () => getStoreById(id),
    enabled: !!id, // Hanya jalankan query jika slug ada
  });
};


/**
 * Hook untuk mengambil daftar store dengan infinite scroll / load more.
 */
export const useInfiniteStores = (filters: Omit<StoresQueryParams, 'page'>) => {
  return useInfiniteQuery<PaginatedApiResponse<Store>, Error>({
    queryKey: ["stores", "infinite", filters],

    // `pageParam` akan otomatis dikelola oleh TanStack Query
    queryFn: ({ pageParam = 1 }) => {

      return getStores({ ...filters, page: pageParam as number })
    },

    // Halaman awal yang akan diambil
    initialPageParam: 1,

    // Fungsi ini memberitahu React Query cara mendapatkan nomor halaman berikutnya
    // getNextPageParam: (lastPage, allPages) => {

    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.meta.current_page;
      const totalPages = lastPage.meta.last_page;

      // Jika halaman saat ini belum mencapai halaman terakhir,
      // kembalikan nomor halaman berikutnya.
      if (currentPage < totalPages) {
        return currentPage + 1;
      }

      // Jika sudah di halaman terakhir, kembalikan undefined untuk menandakan tidak ada lagi data.
      return undefined;
    },
  });
};



export const usePaginationStores = (page: number = 1) => useQuery<PaginatedApiResponse<Store>, Error>({
  queryKey: ['stores', page],
  queryFn: () => getStores({ page: page, per_page: 8 }),
  placeholderData: keepPreviousData,
})