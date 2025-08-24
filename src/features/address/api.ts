import { apiClient } from "@/lib/api-client";
import type { Address } from "@/types";

// Tipe untuk data saat membuat alamat baru (tanpa id)
export type CreateAddressData = Omit<Address, 'id' | 'province' | 'regency' | 'district' | 'village'>;
export type UpdateAddressData = Partial<CreateAddressData>;

/** Mengambil semua alamat pengguna */
export const getAddresses = (): Promise<{data:Address[]}> => {
  return apiClient<{data:Address[]}>('/customer/saved-addresses');
};

/** Menambah alamat baru */
export const addAddress = (data: CreateAddressData): Promise<Address> => {
  return apiClient<Address>('/customer/saved-addresses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/** Melihat Detail alamat */
export const getAddressById = (id: string ): Promise<{data:Address}> => {
  return apiClient<{data:Address}>(`/customer/saved-addresses/${id}`);
};

/** Mengupdate alamat */
export const updateAddress = ({ id, data }: { id: string; data: UpdateAddressData }): Promise<Address> => {
  return apiClient<Address>(`/customer/saved-addresses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/** Menghapus alamat */
export const deleteAddress = (id: string): Promise<void> => {
  return apiClient<void>(`/customer/saved-addresses/${id}`, {
    method: 'DELETE',
  });
};

/** Menjadikan alamat sebagai default */
export const setDefaultAddress = (id: string): Promise<Address> => {
    return apiClient<Address>(`/customer/saved-addresses/${id}/make-as-primary`, {
        method: 'POST',
    });
};