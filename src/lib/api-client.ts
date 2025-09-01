import { getToken } from './token-service';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000/api/v1';

/**
 * Wrapper fetch API universal untuk semua request ke backend.
 * Didesain untuk bekerja di client & server, dan menangani otentikasi.
 *
 * @param endpoint Path API yang dituju, contoh: '/products'
 * @param options Opsi standar fetch (method, body, dll.)
 * @returns Promise yang resolve dengan data dari properti 'data' pada ApiResponse
 */
export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
 

  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (typeof window !== 'undefined') {
    // Ganti 'authToken' dengan nama cookie Anda yang sebenarnya
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const isFormData = options.body instanceof FormData;
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
    // --- OPSI 1: HttpOnly Cookie (Direkomendasikan) ---
    // Baris ini memberitahu browser untuk secara otomatis mengirim cookie
    // yang aman (HttpOnly) pada setiap request.
    // credentials: 'include',
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle jika respons tidak memiliki body (misal: 204 No Content)
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    // Jika respons GAGAL (status bukan 2xx), lempar error.
    if (!response.ok) {
      throw new Error(data.message || 'Terjadi kesalahan pada server.');
    }

    // Jika backend Anda punya format { success, data, message }
    // return data.data;

    // Jika backend langsung mengembalikan datanya
    return data;

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Gagal terhubung ke server.');
    }
    else {
      throw new Error("Terjadi kesalahan")
    }
    // console.error('API Client Error:', error.message);
  }
}