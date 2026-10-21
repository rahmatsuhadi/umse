import { apiClient } from "@/lib/api-client";
import { ResponseShippingRates, ShippingRates } from "@/types";

/**
 * Mengambil opsi pengiriman real (Reguler & Instant) dari KiriminAja API
 */
export const getShippingRates = (data: ShippingRates): Promise<{ data: ResponseShippingRates[], message: string }> => {
    return apiClient<{ data: ResponseShippingRates[], message: string }>(`/shipping/rates`, {
        method: "POST",
        body: JSON.stringify(data),
    });
};

/**
 * Mengambil opsi khusus kurir instant (GoSend & Grab) dari endpoint KiriminAja
 */
export const getInstantShippingRates = (data: ShippingRates): Promise<{ data: ResponseShippingRates[], message: string }> => {
    return apiClient<{ data: ResponseShippingRates[], message: string }>(`/shipping/instant-rates`, {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export interface KiriminAjaOrderAddress {
    name: string;
    phone: string;
    address: string;
    village_id: number;
    district_id: number;
    regency_id: number;
    province_id: number;
    postal_code?: string;
    lat?: number;
    long?: number;
}

export interface KiriminAjaOrderPayload {
    origin: KiriminAjaOrderAddress;
    destination: KiriminAjaOrderAddress;
    service: string;
    service_type: string;
    items: Array<{
        name: string;
        quantity: number;
        weight: number;
        price: number;
    }>;
    note?: string;
}

/**
 * Membuat order / pickup request ke KiriminAja (endpoint baru – belum di-develop)
 */
export const createKiriminAjaOrder = (
    data: KiriminAjaOrderPayload
): Promise<{ data: unknown; message: string }> => {
    return apiClient<{ data: unknown; message: string }>(`/shipping/order`, {
        method: "POST",
        body: JSON.stringify(data),
    });
};