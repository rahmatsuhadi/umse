import { API_URL } from './envConfig';
import { getToken } from './token-service';

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/json",
  };

  // Token hanya bisa diambil di client (browser)
  if (typeof window !== 'undefined') {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const isFormData = options.body instanceof FormData;
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const url = `${API_URL}${endpoint}`;
  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  // 🔥 Tambah debug log
  // console.log("[apiClient:request]", {
  //   url,
  //   method: config.method || "GET",
  //   headers: config.headers,
  //   body: isFormData ? "[FormData]" : config.body,
  //   runtime: typeof window === "undefined" ? "server" : "client",
  // });

  try {
    const response = await fetch(url, config);

    // console.log("[apiClient:response]", {
    //   url,
    //   status: response.status,
    //   statusText: response.statusText,
    // });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      // console.error("[apiClient:errorResponse]", data);
      throw new Error(data.message || `Request gagal: ${response.status}`);
    }

    return data;
  } catch (error: any) {
    // console.error("[apiClient:fetchError]", {
    //   url,
    //   message: error.message,
    //   stack: error.stack,
    //   name: error.name,
    // });
    throw new Error(error.message || "Gagal terhubung ke server.");
  }
}
