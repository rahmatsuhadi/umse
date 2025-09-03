import { useQuery, keepPreviousData, useQueryClient, useMutation } from "@tanstack/react-query";
import { addReviewByOrderId, CreateReviewData, getReviews } from "./api";
import type { Review, PaginatedApiResponse } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ReviewQueryParams = {
  productId: string;
  page?: number;
  per_page?: number;
};

export const useReviews = ({ productId, page = 1, per_page = 5 }: ReviewQueryParams) => {
  return useQuery<PaginatedApiResponse<Review>, Error>({
    // Query key harus menyertakan ID produk dan halaman untuk cache yang benar
    queryKey: ["reviews", productId, { page, per_page }],
    queryFn: () => getReviews({ productId, page, per_page }),
    // Opsi ini membuat data lama tetap terlihat saat data halaman baru dimuat
    // sehingga UI tidak berkedip ke state loading (baik untuk UX paginasi)
    placeholderData: keepPreviousData,
    enabled: !!productId, // Hanya jalankan query jika productId ada
  });
};



export const useAddReview = (id:string) => {
  const router = useRouter()
  
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReviewData) => addReviewByOrderId(id,data),
    onSuccess: () => {
      toast.success("Produk Berhasil Di Review");
      queryClient.invalidateQueries({ queryKey: ['reviews', 'orders'] });
    },
    onError: (error) => {
      toast.error("Gagal review Produk", { description: error.message });
    }
  });
};
