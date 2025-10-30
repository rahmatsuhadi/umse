import { useQuery } from "@tanstack/react-query";
import { fetchOrganizations } from "./api";

export const useOrganizations = (term: string) => {
  return useQuery({
    queryKey: ["organizations", term],
    staleTime: 1000 * 60, // cache 1 menit
    queryFn: () => fetchOrganizations(term),
  });
};
