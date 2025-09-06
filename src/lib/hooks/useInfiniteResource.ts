import { InfiniteQueryApi, PaginatedApiResponse } from '@/types';
import { QueryFunctionContext, QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../api-client';

// Fungsi generik untuk mengambil data dengan paginasi
const fetchResource = async ({ queryKey, pageParam = 1 }) => {
  const [_key, resource, params] = queryKey;
  // Di sini Anda memanggil fungsi API generik Anda
  // yang bisa mengambil data dari endpoint yang berbeda
  const response = await apiClient(`/${resource}`, { params: { ...params, page: pageParam } });
  return response.data;
};


// Tipe untuk parameter yang diterima oleh factory
type CreateInfiniteHookProps<TResource, TParams> = {
  resource: string; // e.g., 'literacies', 'exhibitions'
  apiFn: InfiniteQueryApi<TResource, TParams>;
};


export const createInfiniteResourceHook = <TResource, TParams extends object>({
  resource,
  apiFn,
}: CreateInfiniteHookProps<TResource, TParams>) => {
  // Ini adalah hook yang akan Anda gunakan di komponen Anda
  return (params: TParams) => {
    return useInfiniteQuery<PaginatedApiResponse<TResource>, Error>({
      // Query key sekarang sepenuhnya type-safe
      queryKey: [resource, params],

      // Berikan tipe eksplisit pada argumen queryFn
      queryFn: ({ pageParam = 1, queryKey }: QueryFunctionContext<QueryKey, number>) => {
        // Destructure params dari queryKey, TypeScript tahu tipenya adalah TParams
        const [_key, queryParams] = queryKey as [string, TParams];
        
        // Panggil fungsi API dengan parameter yang benar
        return apiFn({ ...queryParams, page: pageParam });
      },

      initialPageParam: 1,

      getNextPageParam: (lastPage) => {
        const currentPage = lastPage.meta.current_page;
        const totalPages = lastPage.meta.last_page;
        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
    });
  };
};