import { apiClient } from "@/lib/api-client";
import { LoginCredentials, RegisterData, User } from "@/types";

/**
 * Mengirim kredensial login ke server.
 * Backend diharapkan mengembalikan data pengguna dan token.
 */
export const login = async (credentials: LoginCredentials) => {
  const response = await fetch(`/api/auth/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  const backendData = await response.json();

  if (!response.ok) {
    throw new Error(backendData?.message || "Pastikan kredensial Anda benar");
  }
  return backendData;
};

/**
 * Mengirim data pendaftaran pengguna baru ke server.
 */
export const register = async (data: RegisterData): Promise<User> => {
  const formData = new FormData();

  // Menambahkan data lainnya ke FormData
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("phone_number", data.phone_number);
  formData.append("password", data.password);
  formData.append("password_confirmation", data.password_confirmation);
  formData.append("is_asn", data.is_asn ? "1" : "0");

  // Menambahkan file jika ada (misalnya bukti ASN)
  if (data.asn_proof_document) {
    formData.append("asn_proof_document", data.asn_proof_document); // file harus berupa objek File
  }

  // Jika ada badan usaha
  if (data.badan_usaha) {
    formData.append("badan_usaha", data.badan_usaha);
  }

  formData.append("captchaToken", data.captchaToken);

  const response = await fetch(`/api/auth/register`, {
    method: "POST",
    body: formData,
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      responseData?.message || "Kesalahan dalam proses pendaftaran"
    );
  }

  return responseData;
};

export const logout = (): Promise<{ status: boolean }> => {
  return apiClient<{ status: boolean }>("/auth/logout", {
    method: "POST",
  });
};

/**
 * Mengambil data pengguna yang sedang login (terotentikasi).
 * Menggunakan token yang sudah tersimpan di cookie.
 */
export const getMe = (): Promise<{ data: User; message: string }> => {
  return apiClient<{ data: User; message: string }>("/user");
};

export type UpdateProfileData = Partial<
  Pick<User, "name" | "email" | "phone_number">
> & {
  profilePhoto?: File;
};

export const updateProfile = (data: UpdateProfileData): Promise<User> => {
  // Saat mengirim file, kita harus menggunakan FormData
  const formData = new FormData();

  formData.append("name", data.name || "");
  formData.append("email", data.email || "");
  formData.append("phone_number", data.phone_number || "");
  if (data.profilePhoto) {
    formData.append("profile", data.profilePhoto);
  }

  formData.append("_method", "PATCH");

  // Kita perlu mengirim dengan header multipart/form-data
  return apiClient<User>("/user", {
    method: "POST", // atau PUT/PATCH, sesuaikan dengan backend Anda
    body: formData,
    // headers: {
    // Hapus Content-Type agar browser otomatis mengaturnya untuk FormData
    // 'Content-Type': 'multipart/form-data',
    // },
  });
};

export type ChangePasswordData = {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
};

/**
 * Mengirim password  ke server.
 * Backend diharapkan mengembalikan data .
 */
export const changePassword = (
  credentials: ChangePasswordData
): Promise<{ message: string }> => {
  return apiClient<{ message: string }>("/user/password", {
    method: "PATCH",
    body: JSON.stringify(credentials),
  });
};
