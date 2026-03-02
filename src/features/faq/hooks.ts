import { useQuery } from "@tanstack/react-query";
import { getFaqs, type FAQ } from "./api";
export type { FAQ };

export const useFaqs = () => {
    return useQuery<{ data: FAQ[] }, Error>({
        queryKey: ["faqs"],
        queryFn: getFaqs,
    });
};
