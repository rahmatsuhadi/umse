import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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
    return useQuery<{data:Store}, Error>({
        queryKey: ["store", id], // Kunci query unik untuk produk ini
        queryFn: () => getStoreById(id),
        enabled: !!id, // Hanya jalankan query jika slug ada
    });
};