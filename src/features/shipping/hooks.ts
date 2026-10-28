import { useQuery } from "@tanstack/react-query";
import { getInstantShippingRates, getShippingRates } from "./api";
import { ItemShipping, ResponseShippingRates } from "@/types";

export interface UseShippingRatesParams {
    destination_village_id?: number;
    items: ItemShipping[];
    origin_village_id?: number;
    include_instant?: boolean;
    courier?: string | string[];
    origin_lat?: number;
    origin_long?: number;
    destination_lat?: number;
    destination_long?: number;
    enabled?: boolean;
}

export const useShippingRates = ({ 
    destination_village_id, 
    items, 
    origin_village_id,
    include_instant = true,
    courier,
    origin_lat,
    origin_long,
    destination_lat,
    destination_long,
    enabled,
}: UseShippingRatesParams) => {
    return useQuery<{ data: ResponseShippingRates[], message?: string }, Error>({
        queryKey: ["shippingRates", destination_village_id, origin_village_id, include_instant, courier, origin_lat, origin_long, destination_lat, destination_long, JSON.stringify(items)],
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        retry: 1,
        queryFn: async () => {
            const res = await getShippingRates({
                destination_village_id,
                items,
                origin_village_id,
                include_instant,
                courier,
                origin_lat,
                origin_long,
                destination_lat,
                destination_long,
            });
            return res;
        },
        enabled: (enabled !== undefined ? enabled : true) && !!destination_village_id && !!origin_village_id,
    });
};

export const useInstantShippingRates = ({
    destination_village_id,
    items,
    origin_village_id,
    origin_lat,
    origin_long,
    destination_lat,
    destination_long,
    enabled,
}: UseShippingRatesParams) => {
    return useQuery<{ data: ResponseShippingRates[], message?: string }, Error>({
        queryKey: ["instantShippingRates", destination_village_id, origin_village_id, origin_lat, origin_long, destination_lat, destination_long, JSON.stringify(items)],
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        retry: 1,
        queryFn: async () => {
            const res = await getInstantShippingRates({
                destination_village_id,
                items,
                origin_village_id,
                origin_lat,
                origin_long,
                destination_lat,
                destination_long,
            });
            return res;
        },
        enabled: (enabled !== undefined ? enabled : true) && !!destination_village_id && !!origin_village_id,
    });
};