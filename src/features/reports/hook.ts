import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addReport, CreateMessageData, CreateReportData, getReport, getReportById, getReportMesage, sendMessage } from "./api";
import { MessageReport, PaginatedApiResponse, Report } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


type ReportQueryParams = {
  page?: number;
  limit?: number;
  per_page?: number;
  q?: string;
  filter?: {
    category?: number;
    status?: number;
  };
  sort?: string
};

export const useInfiniteReports = (filters: Omit<ReportQueryParams, 'page'>) => {
  return useInfiniteQuery<PaginatedApiResponse<Report>, Error>({
    queryKey: ["reports", "infinite", filters],

    // `pageParam` akan otomatis dikelola    oleh TanStack Query
    queryFn: ({ pageParam = 1 }) => {

      return getReport({ ...filters, page: pageParam as number })
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



export const useAddReport = () => {
  const router = useRouter()

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReportData) => addReport(data),
    onSuccess: () => {
      toast.success("Laporan complain berhasil dikirim");
      queryClient.refetchQueries({
        queryKey: ['reports', 'infinite']
      })
      router.replace("/laporan")

    },
    onError: (error) => {
      toast.error("Gagal Mengirim Coplain", { description: error.message });
    }
  });
};


// Hook untuk mengambil satu report
export const useReport = (id: string) => {
  return useQuery<{ data: Report }, Error>({
    queryKey: ["report", id], // Kunci query unik untuk produk ini
    queryFn: () => getReportById(id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!id, // Hanya jalankan query jika slug ada
  });
};




// message report


export const useInfiniteMessageReport = (id: string, filters: Omit<ReportQueryParams, 'page'>) => {
  return useInfiniteQuery<PaginatedApiResponse<MessageReport>, Error>({
    queryKey: ["reports-messages", "infinite", filters],

    // `pageParam` akan otomatis dikelola    oleh TanStack Query
    queryFn: ({ pageParam = 1 }) => {

      return getReportMesage(id, { ...filters, page: pageParam as number })
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



export const useAddMesage = (id: string) => {

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMessageData) => sendMessage(id, data),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['reports-messages', 'infinite']
      })
    },
    onError: (error) => {
      toast.error("Gagal Mengirim Pesan", { description: error.message });
    }
  });
};
