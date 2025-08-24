import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress, getAddressById } from "./api";
import type { CreateAddressData, UpdateAddressData } from "./api";
import { toast } from "sonner";
import { Address } from "@/types";
import { useRouter } from "next/navigation";

const ADDRESS_QUERY_KEY = ["addresses"];


export const useAddresses = () => {
  return useQuery<{ data: Address[] }, Error>({
    queryKey: ADDRESS_QUERY_KEY,
    queryFn: getAddresses,
  });
};

export const useAddAddress = () => {
  const router = useRouter()
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAddressData) => addAddress(data),
    onSuccess: () => {
      toast.success("Alamat baru berhasil ditambahkan!");
      queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEY });
      router.replace("/pengguna/alamat")
    },
    onError: (error) => {
      toast.error("Gagal menambahkan alamat", { description: error.message });
    }
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  const router = useRouter()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAddressData }) => updateAddress({ id, data }),
    onSuccess: () => {
      toast.success("Alamat berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEY });
      router.replace("/pengguna/alamat")
    },
    onError: (error) => {
      toast.error("Gagal memperbarui alamat", { description: error.message });
    }
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => {
      toast.success("Alamat berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error("Gagal menghapus alamat", { description: error.message });
    }
  });
};


/**
 * BARU: Hook untuk mengambil satu data alamat detail.
 */
export const useAddress = (id: string) => {
  return useQuery<{ data: Address }, Error>({
    // Query key menyertakan ID agar setiap alamat di-cache secara individual
    queryKey: [ADDRESS_QUERY_KEY[0], id],
    queryFn: () => getAddressById(id),
    // Query hanya akan berjalan jika `id` memiliki nilai
    enabled: !!id,
  });
};


export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => setDefaultAddress(id),
    onSuccess: () => {
      toast.success("Alamat utama berhasil diubah!");
      queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error("Gagal mengubah alamat utama", { description: error.message });
    }
  });
};