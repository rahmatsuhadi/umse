import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getProducts, getProductBySlug } from "./api";
import type { PaginatedApiResponse, Product } from "@/types";

type ProductQueryParams = {
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
export const useProducts = (params: ProductQueryParams) => {
  return useQuery<PaginatedApiResponse<Product>, Error>({
    // Kunci query harus menyertakan params agar cache unik untuk setiap filter
    queryKey: ["products", params],
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    queryFn: () => getProducts(params),
  });
};


/**
 * Hook untuk mengambil daftar produk dengan infinite scroll / load more.
 */
export const useInfiniteProducts = (filters: Omit<ProductQueryParams, 'page'>) => {
  return useInfiniteQuery<PaginatedApiResponse<Product>, Error>({
    queryKey: ["products", "infinite", filters],

    // `pageParam` akan otomatis dikelola oleh TanStack Query
    queryFn: ({ pageParam = 1 }) => {

      return getProducts({ ...filters, page: pageParam as number })
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

// Hook untuk mengambil satu produk
export const useProduct = (slug: string) => {
  return useQuery<Product, Error>({
    queryKey: ["product", slug], // Kunci query unik untuk produk ini
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug, // Hanya jalankan query jika slug ada
  });
};