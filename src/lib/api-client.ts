import { API_URL } from "./envConfig";
import { getToken } from "./token-service";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/json",
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

  // Di browser (client), gunakan proxy Next.js (/api) untuk menghindari CORS.
  // Di server (SSR), hit langsung ke backend URL.
  const isServer = typeof window === "undefined";
  const rawBaseUrl = isServer ? API_URL : "/api";
  const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${cleanBaseUrl}${cleanEndpoint}`;
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
    let data: Record<string, unknown> = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text.slice(0, 300) };
    }

    if (!response.ok) {
      const expectedErrors = [400, 401, 403, 422];
      if (!expectedErrors.includes(response.status)) {
        console.error("[apiClient:errorResponse]", {
          url,
          status: response.status,
          statusText: response.statusText,
          data,
        });
      }
      const validationErrors =
        typeof data?.errors === "object" && data.errors !== null
          ? Object.values(data.errors).flat().join(". ")
          : null;
      const responseMessage =
        typeof data?.message === "string" ? data.message : null;
      const message =
        validationErrors ||
        responseMessage ||
        `Request gagal: ${response.status} ${response.statusText}`;
      throw new Error(message);
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      console.error("[apiClient:fetchError]", {
        url,
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      const displayMessage =
        error.message === "fetch failed"
          ? `Gagal terhubung ke backend (${url}). Pastikan backend sedang aktif.`
          : error.message || "Gagal terhubung ke server.";
      throw new Error(displayMessage);
    }
    throw new Error("Gagal terhubung ke server.");
  }
}
