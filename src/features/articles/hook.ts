import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { Article, PaginatedApiResponse } from "@/types";
import { getArticleById, getArticles, QueryParams } from "./api";


// Hook untuk mengambil satu produk
export const useArticle = (id: string) => {
  return useQuery<{ data: Article }, Error>({
    queryKey: ["article", id], // Kunci query unik untuk produk ini
    queryFn: () => getArticleById(id),
    enabled: !!id, // Hanya jalankan query jika slug ada
  });
};



export const usePaginationArticles = (params: QueryParams) => useQuery<PaginatedApiResponse<Article>, Error>({
  queryKey: ['articles', params],
  queryFn: () => getArticles({ ...params }),
  placeholderData: keepPreviousData,
})