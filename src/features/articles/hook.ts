import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import type { Article, PaginatedApiResponse } from "@/types";
import {
  getArticleById,
  getArticles,
  getBannerArticle,
  QueryParams,
} from "./api";

// Hook untuk mengambil satu produk
export const useArticle = (id: string) => {
  return useQuery<{ data: Article }, Error>({
    queryKey: ["article", id], // Kunci query unik untuk produk ini
    queryFn: () => getArticleById(id),
    enabled: !!id, // Hanya jalankan query jika slug ada
  });
};

// Hook untuk mengambil satu produk
export const useBannerArticle = (limit: number = 5) => {
  return useQuery<{ data: Article[] }, Error>({
    queryKey: ["banner"], // Kunci query unik untuk produk ini
    queryFn: () => getBannerArticle(limit),
  });
};

export const usePaginationArticles = (params: QueryParams) =>
  useQuery<PaginatedApiResponse<Article>, Error>({
    queryKey: ["articles", params],
    queryFn: () => getArticles({ ...params }),
    placeholderData: keepPreviousData,
  });

export const useInfiniteArticles = (filters: Omit<QueryParams, "page">) => {
  return useInfiniteQuery<PaginatedApiResponse<Article>, Error>({
    queryKey: ["articles", "infinite", filters],

    // `pageParam` akan otomatis dikelola    oleh TanStack Query
    queryFn: ({ pageParam = 1 }) => {
      return getArticles({ ...filters, page: pageParam as number });
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
