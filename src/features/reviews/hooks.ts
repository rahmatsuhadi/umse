import {
  useQueryClient,
  useMutation,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { addReviewByOrderId, CreateReviewData, getReviews } from "./api";
import type { Review, PaginatedApiResponse } from "@/types";
// import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ReviewQueryParams = {
  productId: string;
  // page?: number;
  per_page?: number;
  filter?: {
    // category_id?: string;          // UUID
    rating?: number;
  };
};

export const useReviews = ({
  productId,
  per_page = 5,
  filter,
}: ReviewQueryParams) => {
  return useInfiniteQuery<PaginatedApiResponse<Review>, Error>({
    // 1. Query key sekarang tidak menyertakan halaman, karena semua halaman
    //    akan disimpan di bawah satu key ini.
    queryKey: ["reviews", productId, filter],

    // 2. queryFn sekarang menerima objek dengan 'pageParam'.
    //    'pageParam' akan berisi nomor halaman yang akan di-fetch.
    queryFn: ({ pageParam = 1 }) =>
      getReviews({ productId, page: pageParam as number, per_page, filter }),

    // 3. 'initialPageParam' adalah nilai awal untuk 'pageParam' pada fetch pertama.
    initialPageParam: 1,

    // 4. 'getNextPageParam' adalah fungsi krusial. Fungsinya adalah untuk
    //    menentukan halaman BERIKUTNYA berdasarkan data dari halaman TERAKHIR.
    getNextPageParam: (lastPage) => {
      // 'lastPage' adalah data dari fetch terakhir (respons API Anda).
      // Kita perlu memeriksa apakah ada halaman berikutnya.

      // Asumsi: Respons API Anda memiliki struktur seperti { data: [...], meta: { current_page: 1, last_page: 10 } }
      // Sesuaikan ini dengan struktur respons API Anda!
      const currentPage = lastPage.meta.current_page;
      const lastPageNum = lastPage.meta.last_page;

      if (currentPage < lastPageNum) {
        // Jika halaman saat ini belum menjadi halaman terakhir,
        // kembalikan nomor halaman berikutnya.
        return currentPage + 1;
      }

      // Jika sudah di halaman terakhir, kembalikan undefined/null
      // untuk memberitahu React Query bahwa tidak ada halaman lagi.
      return undefined;
    },

    enabled: !!productId,
  });
};

export const useAddReview = (id: string) => {
  // const router = useRouter()

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReviewData) => addReviewByOrderId(id, data),
    onSuccess: () => {
      toast.success("Produk Berhasil Di Review");
      queryClient.refetchQueries({
        queryKey: ["orders", "infinite"],
      });
    },
    onError: (error) => {
      toast.error("Gagal review Produk", { description: error.message });
    },
  });
};
