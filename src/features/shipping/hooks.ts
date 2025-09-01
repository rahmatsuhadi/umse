import { useQuery } from "@tanstack/react-query";
import { getShippingRates } from "./api";
import { ItemShipping, ResponseShippingRates } from "@/types";


export const useShippingRates = ({ 
    destination_village_id, 
    items, 
    origin_village_id 
}: { destination_village_id?: number, items: ItemShipping[], origin_village_id?: number }) => {
    return useQuery<{ data: ResponseShippingRates[] }, Error>({
        queryKey: ["shippingRates", destination_village_id,origin_village_id ], // Kunci query unik untuk produk ini
        refetchOnReconnect:false,
        refetchOnWindowFocus: false,
        queryFn: () => getShippingRates({
            destination_village_id, items, origin_village_id
        }),
        enabled: !!destination_village_id && !!origin_village_id, // Hanya jalankan query jika slug ada
    });
};