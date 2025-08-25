
import { apiClient } from "@/lib/api-client";
import type { Category } from "@/types";

/**
 * Mengambil semua kategori dari server.
 */
export const getCategories = (): Promise<{data:Category[]}> => {
  return apiClient<{data:Category[]}>('/categories?filter[is_featured]=true');
};