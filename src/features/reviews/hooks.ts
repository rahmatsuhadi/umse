import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getReviews } from "./api";
import type { Review, PaginatedApiResponse } from "@/types";

type ReviewQueryParams = {
  productId: string;
  page?: number;
  limit?: number;
};

export const useReviews = ({ productId, page = 1, limit = 5 }: ReviewQueryParams) => {
  return useQuery<PaginatedApiResponse<Review>, Error>({
    // Query key harus menyertakan ID produk dan halaman untuk cache yang benar
    queryKey: ["reviews", productId, { page, limit }],
    queryFn: () => getReviews({ productId, page, limit }),
    // Opsi ini membuat data lama tetap terlihat saat data halaman baru dimuat
    // sehingga UI tidak berkedip ke state loading (baik untuk UX paginasi)
    placeholderData: keepPreviousData,
    enabled: !!productId, // Hanya jalankan query jika productId ada
  });
};