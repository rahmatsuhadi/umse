// import type { ApiResponse } from '@/types';


const API_BASE_URL = '/api';

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'An unknown error occurred.',
    }));
    throw new Error(errorData.message);
  }
  
  // Jika backend Anda mengembalikan format { success, data, message },
  // Anda mungkin perlu parsing di sini atau di proxy.
  // Jika proxy sudah mengembalikan body apa adanya, kode ini mungkin perlu disesuaikan.
  const responseData = await response.json();
  
  // Jika format dari backend sudah ApiResponse<T>, gunakan ini
  // return responseData.data;

  // Jika proxy hanya mengembalikan data mentah, gunakan ini
  return responseData; 
}