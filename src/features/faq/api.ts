import { apiClient } from "@/lib/api-client";

export interface FAQ {
    id: string;
    topic: string;
    question: string;
    answer: string;
    is_active: boolean;
    sort: number;
}

export const getFaqs = (): Promise<{ data: FAQ[] }> => {
    return apiClient<{ data: FAQ[] }>("/faqs");
};
