import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  login,
  register,
  getMe,
  logout,
  UpdateProfileData,
  updateProfile,
  ChangePasswordData,
  changePassword,
} from "./api";
import type { User, LoginCredentials, RegisterData } from "@/types/user";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { removeToken, setToken } from "@/lib/token-service";

/**
 * Hook untuk mengambil data pengguna yang sedang login.
 * Data ini akan di-cache dan bisa diakses di seluruh aplikasi.
 */
export const useUser = () => {
  return useQuery<{ data: User; message: string }, Error>({
    queryKey: ["user"], // Kunci unik untuk query ini
    queryFn: getMe, // Fungsi API yang dipanggil
    refetchOnWindowFocus: false,
    retry: false, // Jangan coba ulang jika gagal (misal, karena belum login)
  });
};

/**
 * Hook untuk proses login (Mutation).
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: ({
      credentials,
    }: {
      credentials: LoginCredentials;
      redirectUrl?: string | null;
    }) => login(credentials),
  });
};

/**
 * Hook untuk proses pendaftaran (Mutation).
 */
export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterData) => register(data),
  });
};

/**
 * Hook untuk proses logout (Mutation).
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout, // Fungsi API yang dipanggil
    onSuccess: () => {
      // 1. Hapus token dari cookie
      removeToken();

      // 2. Hapus data pengguna dari cache TanStack Query
      queryClient.removeQueries({ queryKey: ["user"] });

      // 3. Tampilkan notifikasi
      toast.success("Logout Berhasil", {
        description: "Anda telah berhasil keluar dari akun Anda.",
      });

      // 4. Arahkan ke halaman login
      router.push("/masuk");
    },
    onError: (error) => {
      // Handle jika logout di server gagal, tapi tetap paksa di client
      removeToken();
      queryClient.removeQueries({ queryKey: ["user"] });
      router.push("/masuk");

      console.error("Logout error:", error);
      toast.error("Logout Gagal", {
        description:
          "Terjadi kesalahan, namun Anda telah dikeluarkan dari sisi klien.",
      });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => updateProfile(data),
    onSuccess: () => {
      // 1. Invalidate query 'user' agar data di seluruh aplikasi ter-update
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // 2. Tampilkan notifikasi sukses
      toast.success("Profil Berhasil Disimpan!");

      // 3. Arahkan kembali ke halaman profil
      // router.push('/pengguna/edit');
    },
    onError: (error) => {
      toast.error("Gagal Menyimpan Profil", { description: error.message });
    },
  });
};

export const usePasswordChange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangePasswordData) => changePassword(data),
    onSuccess: () => {
      // 1. Invalidate query 'user' agar data di seluruh aplikasi ter-update
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // 2. Tampilkan notifikasi sukses
      toast.success("Password Berhasil Diubah!");

      // 3. Arahkan kembali ke halaman profil
      // router.push('/pengguna/edit');
    },
    onError: (error) => {
      toast.error("Gagal Mengubah Password", { description: error.message });
    },
  });
};
