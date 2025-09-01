import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { login, register, getMe, logout, UpdateProfileData, updateProfile, ChangePasswordData, changePassword } from "./api";
import type { User, LoginCredentials, RegisterData } from "@/types/user";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { removeToken, setToken } from "@/lib/token-service";

/**
 * Hook untuk mengambil data pengguna yang sedang login.
 * Data ini akan di-cache dan bisa diakses di seluruh aplikasi.
 */
export const useUser = () => {
  return useQuery<{ data: User, message: string }, Error>({
    queryKey: ["user"], // Kunci unik untuk query ini
    queryFn: getMe,     // Fungsi API yang dipanggil
    retry: false,       // Jangan coba ulang jika gagal (misal, karena belum login)
  });
};

/**
 * Hook untuk proses login (Mutation).
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ credentials }: { credentials: LoginCredentials, redirectUrl?: string | null }) => login(credentials),
    onSuccess: ({ data }, variables) => {
      const { token, user } = data;

      if (user.role != "customer") {

        toast.error('Anda bukan customer')
        return
      }

      // 1. Set data pengguna ke cache setelah login berhasil
      queryClient.setQueryData(["user"], data.user);


      if (token) {
        // 3. Simpan token ke dalam cookie
        // 'authToken' adalah nama cookie, Anda bisa mengubahnya
        // { expires: 1 } berarti cookie akan valid selama 1 hari
        setToken(token)
      }

      // 2. Tampilkan notifikasi sukses
      toast.success("Login Berhasil!", {
        description: `Selamat datang kembali, ${user.name}.`,
      });

      // 3. Arahkan pengguna ke halaman utama atau dashboard
      router.push(variables.redirectUrl || '/');
    },
    onError: () => {
      // Tampilkan notifikasi error
      toast.error("Login Gagal", {
        // description: "Pastikan kredensial Anda benar.",
        description: "Pastikan kredensial Anda benar.",
        // description: error.message || "Pastikan kredensial Anda benar.",
      });
    }
  });
};


/**
 * Hook untuk proses pendaftaran (Mutation).
 */
export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterData) => register(data),
    onSuccess: () => {
      toast.success("Pendaftaran Berhasil!", {
        description: "Akun Anda telah dibuat. Silakan masuk.",
      });
      router.push('/masuk'); // Arahkan ke halaman login setelah daftar
    },
    onError: (error) => {
      toast.error("Pendaftaran Gagal", {
        description: error.message || "Data yang Anda masukkan tidak valid.",
      });
    }
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
        description: "Terjadi kesalahan, namun Anda telah dikeluarkan dari sisi klien.",
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
    }
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
    }
  });
};