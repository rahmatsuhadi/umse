import { useInfiniteQuery } from "@tanstack/react-query";
import { getArticles, type QueryParams } from "./api";
import type { PaginatedApiResponse, Article } from "@/types";

export const useInfiniteArticles = (filters: Omit<QueryParams, 'page'>) => {
    return useInfiniteQuery<PaginatedApiResponse<Article>, Error>({
        queryKey: ["articles", "infinite", filters],
        queryFn: ({ pageParam = 1 }) => getArticles({ ...filters, page: pageParam as number }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const currentPage = lastPage.meta.current_page;
            const totalPages = lastPage.meta.last_page;
            if (currentPage < totalPages) {
                return currentPage + 1;
            }
            return undefined;
        },
    });
};
