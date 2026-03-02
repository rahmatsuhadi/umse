import { API_URL } from "./envConfig";
import { getToken } from "./token-service";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    // Accept: "application/json",
  };

  // Token hanya bisa diambil di client (browser)
  if (typeof window !== "undefined") {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const isFormData =
    options.body instanceof FormData ||
    (typeof FormData !== "undefined" &&
      options.body?.constructor?.name === "FormData");

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Di browser (client), gunakan proxy Next.js (/backend-api) untuk menghindari CORS.
  // Di server (SSR), hit langsung ke backend URL.
  const isServer = typeof window === "undefined";
  const baseUrl = isServer ? API_URL : "/backend-api";
  const url = `${baseUrl}${endpoint}`;
  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  // Debug log
  console.log("[apiClient:request]", {
    url,
    method: config.method || "GET",
    headers: config.headers,
    body: isFormData ? "[FormData]" : config.body,
    runtime: isServer ? "server" : "client",
  });

  try {
    const response = await fetch(url, config);

    if (response.status === 503) {
      if (typeof window !== "undefined") {
        // Client-side: redirect langsung
        window.location.href = "/pemeliharaan";
        return new Promise(() => { }); // never resolve
      } else {
        // Server-side: lempar error spesifik
        const err = new Error("MAINTENANCE_MODE");
        throw err;
      }
    }

    console.log("[apiClient:response]", {
      url,
      status: response.status,
      statusText: response.statusText,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      const expectedErrors = [401, 403, 422];
      if (!expectedErrors.includes(response.status)) {
        console.error("[apiClient:errorResponse]", {
          url,
          status: response.status,
          statusText: response.statusText,
          data,
        });
      }
      throw new Error(data.message || `Request gagal: ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("[apiClient:fetchError]", {
        url,
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      throw new Error(error.message || "Gagal terhubung ke server.");
    }
    throw new Error("Gagal terhubung ke server.");
  }
}
