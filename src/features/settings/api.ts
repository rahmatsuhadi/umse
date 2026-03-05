import { apiClient } from "@/lib/api-client";
import type { WebSettings } from "./types";

/**
 * Mengambil web settings dari server
 */
export const getWebSettings = (): Promise<{ data: WebSettings }> => {
    return apiClient<{ data: WebSettings }>('/web-settings');
};
