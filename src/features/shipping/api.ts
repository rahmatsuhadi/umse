import { apiClient } from "@/lib/api-client";
import { ResponseShippingRates, ShippingRates } from "@/types";



/**
 * Mengambil satu produk berdasarkan id-nya.
 */
export const getShippingRates = (data: ShippingRates): Promise<{ data: ResponseShippingRates[], message: string }> => {
    return apiClient<{ data: ResponseShippingRates[], message: string }>(`/shipping/rates`, {
        method: "POST",
        body: JSON.stringify(data),
    });
};