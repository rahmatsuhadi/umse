import { apiClient } from "@/lib/api-client";

export type VisitorLogParams = {
    product_id: string;
};

export const createVisitorLog = (data: VisitorLogParams) => {
    return apiClient("/visitor-logs", {
        method: "POST",
        body: JSON.stringify(data),
    });
};
