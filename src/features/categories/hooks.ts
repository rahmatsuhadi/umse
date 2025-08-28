import { useQuery } from "@tanstack/react-query";
import { getCategories } from "./api";
import type { Category } from "@/types";

export const useCategories = () => {
  return useQuery<{ data: Category[] }, Error>({
    queryKey: ["categories"],
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    queryFn: getCategories,
  });
};