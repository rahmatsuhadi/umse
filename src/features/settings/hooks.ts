import { useQuery } from "@tanstack/react-query";
import { getWebSettings } from "./api";

export const useWebSettings = () => {
    return useQuery({
        queryKey: ["web-settings"],
        queryFn: getWebSettings,
        staleTime: 1000 * 60 * 60, // Cache for 1 hour
        gcTime: 1000 * 60 * 60,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};
