import { Order, PaginatedApiResponse } from "@/types";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  completedOrder,
  createOrder,
  CreateOrderData,
  CreateOrderPayment,
  createPayment,
  deliveredOrder,
  getOrders,
  getOrderPaymentStatus,
  getPaymentOrderById,
  OrderPaymentStatusData,
  getOrderTracking,
  OrderTrackingData,
  regenerateOrderQris,
  RegenerateQrisResponse,
} from "./api";
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
    onSuccess: async(data) => {
      await localStorage.removeItem("checkout_items")
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
    mutationFn: (orderId: string) => completedOrder(orderId),
    onSuccess: () => {
      toast.success("Update status pesanan berhasil.");
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





export const useDeliveredOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderId: string) => deliveredOrder(orderId),
    onSuccess: () => {
      toast.success("Update pesanan berhasil!");
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

/**
 * Hook polling realtime status pembayaran untuk frontend
 */
export const useOrderPaymentStatus = (
  id: string,
  options?: { enabled?: boolean; refetchInterval?: number }
) => {
  return useQuery<{ status: boolean; data: OrderPaymentStatusData }, Error>({
    queryKey: ['orders', id, 'payment-status'],
    enabled: options?.enabled ?? !!id,
    refetchInterval: options?.refetchInterval ?? 2500, // Polling tiap 2.5 detik
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    queryFn: () => getOrderPaymentStatus(id),
  });
};

/**
 * Hook untuk generate ulang QRIS (BPD DIY / KiriminAja / All)
 */
export const useRegenerateQris = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    RegenerateQrisResponse,
    Error,
    { type?: 'bpd' | 'kiriminaja' | 'all' } | void
  >({
    mutationFn: (variables) =>
      regenerateOrderQris(orderId, variables?.type ?? 'all'),
    onSuccess: (data) => {
      toast.success(data.message || 'QRIS berhasil diperbarui!');
      // Invalidate detail order dan status payment agar UI langsung ter-update
      queryClient.invalidateQueries({ queryKey: ['orders', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders', orderId, 'payment-status'] });
    },
    onError: (error) => {
      toast.error('Gagal memperbarui QRIS', { description: error.message });
    },
  });
};

/**
 * Hook untuk mengambil riwayat tracking pengiriman pesanan KiriminAja
 */
export const useOrderTracking = (orderId: string, enabled = true) => {
  return useQuery<{ status: boolean; data: OrderTrackingData }, Error>({
    queryKey: ['orders', orderId, 'tracking'],
    queryFn: () => getOrderTracking(orderId),
    enabled: !!orderId && enabled,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 30, // 30s cache
  });
};

