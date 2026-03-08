
import { apiClient } from "@/lib/api-client";
import type { Category } from "@/types";

/**
 * Mengambil semua kategori dari server.
 */
export const getCategories = (): Promise<{ data: Category[] }> => {
  return apiClient<{ data: Category[] }>('/categories?filter[is_featured]=true');
};

export const getCategoriesFooter = (): Promise<{ data: Category[] }> => {
  return apiClient<{ data: Category[] }>('/categories?limit=4');
};

export const getSlemanFoodCategories = (): Promise<{ data: Category[] }> => {
  return apiClient<{ data: Category[] }>('/categories?filter[is_ready_to_serve_or_frozen]=1');
};

export const getJasaCategories = (): Promise<{ data: Category[] }> => {
  return apiClient<{ data: Category[] }>('/categories?filter[type]=service');
};