import { Order, PaginatedApiResponse } from "@/types";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { completeOrder, createOrder, CreateOrderData, CreateOrderPayment, createPayment, getOrders, getPaymentOrderById } from "./api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type OrderQueryParams = {
  page?: number;
  limit?: number;
  per_page?: number;
  search?: string;
  filter?: {
    created_at?: string
    // category_id?: string;          // UUID
    status?: string;       // string
  };
  sort?: string
};


/**
 * Hook untuk mengambil daftar produk dengan infinite scroll / load more.
 */
export const useInfiniteOrders = (filters: Omit<OrderQueryParams, 'page'>) => {
  return useInfiniteQuery<PaginatedApiResponse<Order>, Error>({
    queryKey: ["orders", "infinite", filters],

    // `pageParam` akan otomatis dikelola oleh TanStack Query
    queryFn: ({ pageParam = 1 }) => {

      return getOrders({ ...filters, q: filters.search, page: pageParam as number })
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

export const useCreateOrder = () => {
  const router = useRouter()
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderData) => createOrder(data),
    onSuccess: (data) => {
      toast.success("Berhasil membuat order!");
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      router.replace("/pembayaran/" + data.data.id)
    },
    onError: (error) => {
      toast.error("Gagal Membuat Order", { description: error.message });
    }
  });
};

export const useCreatePayment = (id: string) => {
  const router = useRouter()
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderPayment) => createPayment(id, data),
    onSuccess: () => {
      toast.success("Pembayaran Behasil Dikirim!");
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      router.replace("/pesanan")
    },
    onError: (error) => {
      toast.error("Gagal Mengirim Pembayaran", { description: error.message });
    }
  });
};


export const useGetOrderPayments = (id: string) => {
  return useQuery<{ data: Order }, Error>({
    queryKey: ['orders', id],
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!id,
    queryFn: () => getPaymentOrderById(id),
  });
};



export const useCompleteOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderId: string) => completeOrder(orderId),
    onSuccess: () => {
      toast.success("Pesanan berhasil diselesaikan!");
      // Invalidate query orders agar daftar pesanan diperbarui
      queryClient.invalidateQueries({ queryKey: ['orders', 'infinite'] });
    },
    onError: (error: Error) => {
      toast.error("Gagal menyelesaikan pesanan.", {
        description: error.message,
      });
    },
  });
};