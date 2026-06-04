import { useQuery } from "@tanstack/react-query";
import { getShippingRates } from "./api";
import { ItemShipping, ResponseShippingRates } from "@/types";


export const useShippingRates = ({ 
    destination_village_id, 
    items, 
    origin_village_id 
}: { destination_village_id?: number, items: ItemShipping[], origin_village_id?: number }) => {
    return useQuery<{ data: ResponseShippingRates[], isMock?: boolean, errorMsg?: string }, Error>({
        queryKey: ["shippingRates", destination_village_id, origin_village_id], // Kunci query unik untuk produk ini
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        retry: false,
        queryFn: async () => {
            try {
                const res = await getShippingRates({
                    destination_village_id, items, origin_village_id
                });
                return res;
            } catch (err) {
                const error = err as Error;
                console.warn("Shipping rate vendor error, falling back to mock:", error);
                return {
                    data: [
                        {
                            service: "jne",
                            service_name: "JNE Reguler (Estimasi)",
                            service_type: "REG",
                            cost: {
                                value: 15000,
                                amount: "15000",
                                formatted: "Rp 15.000",
                                currency: "IDR",
                            },
                            etd: "2-4 hari"
                        }
                    ],
                    isMock: true,
                    errorMsg: error.message || "Gagal mendapatkan ongkos kirim dari vendor"
                };
            }
        },
        enabled: !!destination_village_id && !!origin_village_id, // Hanya jalankan query jika slug ada
    });
};