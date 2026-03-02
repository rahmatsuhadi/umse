import { useQuery } from "@tanstack/react-query";
import { getCategories, getCategoriesFooter, getSlemanFoodCategories } from "./api";
import type { Category } from "@/types";

export const useCategories = () => {
  return useQuery<{ data: Category[] }, Error>({
    queryKey: ["categories"],
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    queryFn: getCategories,
  });
};

export const useCategoriesFooter = () => {
  return useQuery<{ data: Category[] }, Error>({
    queryKey: ["categories-footer"],
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    queryFn: getCategoriesFooter,
  });
};

export const useSlemanFoodCategories = () => {
  return useQuery<{ data: Category[] }, Error>({
    queryKey: ["sleman-food-categories"],
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    queryFn: getSlemanFoodCategories,
  });
};