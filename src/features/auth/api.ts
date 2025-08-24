import { apiClient } from "@/lib/api-client";
import { LoginCredentials, RegisterData, User } from "@/types";

/**
 * Mengirim kredensial login ke server.
 * Backend diharapkan mengembalikan data pengguna dan token.
 */
export const login = (credentials: LoginCredentials): Promise<{data:{user:User, token:string}}> => {
    return apiClient<{data:{user:User, token:string}}>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
};

/**
 * Mengirim data pendaftaran pengguna baru ke server.
 */
export const register = (data: RegisterData): Promise<User> => {
    return apiClient<User>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const logout = (): Promise<{ status: boolean }> => {
    return apiClient<{ status: boolean }>('/auth/logout', {
        method: 'POST',
    });
};

/**
 * Mengambil data pengguna yang sedang login (terotentikasi).
 * Menggunakan token yang sudah tersimpan di cookie.
 */
export const getMe = (): Promise<{data:User, message:string}> => {
    return apiClient<{data:User, message:string}>('/user');
};


export type UpdateProfileData = Partial<Pick<User, 'name' | 'email' | 'phone_number'>> & {
  profilePhoto?: File;
};

export const updateProfile = (data: UpdateProfileData): Promise<User> => {
  // Saat mengirim file, kita harus menggunakan FormData
  const formData = new FormData();
  formData.append('name', data.name || '');
  formData.append('email', data.email || '');
  formData.append('phone_number', data.phone_number || '');
  if (data.profilePhoto) {
    formData.append('profile', data.profilePhoto);
  }

  // Kita perlu mengirim dengan header multipart/form-data
  return apiClient<User>('/user', {
    method: 'PATCH', // atau PUT/PATCH, sesuaikan dengan backend Anda
    body: formData,
    headers: {
      // Hapus Content-Type agar browser otomatis mengaturnya untuk FormData
      'Content-Type': 'multipart/form-data',
    },
  });
};