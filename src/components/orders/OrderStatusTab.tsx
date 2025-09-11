import { Meta } from "@/types";
import { useMemo } from "react";

const TABS = [
    { label: "Semua", value: "" },
    { label: "Menunggu Pembayaran", value: "awaiting_payment" },
    { label: "Menunggu", value: "pending" },
    { label: "Diproses", value: "processing" },
    { label: "Dikirim", value: "shipped" },
    { label: "Sampai", value: "delivered" },
    // { label: "Canceled", value: "cancelled" },
    { label: "Selesai", value: "completed" },
    { label: "Expired", value: "expired" },
];


interface OrderStatusTabProps {
    meta: Meta | undefined;
    activeStatus: string;
    handleTabChange: (status: string) => void;
}

export default function OrderStatusTab({ meta, activeStatus, handleTabChange }: OrderStatusTabProps) {




    const counts = useMemo(() => {
        return meta?.count || {
            awaiting_payment: 0,
            pending: 0,
            processing: 0,
            shipped: 0,
            cancelled: 0,
            delivered: 0,
            completed: 0,
            total: 0,
        }
    }, [meta])

    return (
        <div className="bg-white rounded-lg shadow-md mb-4 sm:mb-6 ">
            <div className="border-b border-gray-200 ">
                <nav
                    className="flex flex-wrap space-x-2 px-4 sm:px-6"
                    aria-label="Tabs"
                >
                    {TABS.map((tab) => {
                        const count =
                            tab.value === ""
                                ? counts?.["total"] ?? 0
                                : tab.value && counts?.[tab.value as keyof typeof counts] !== undefined
                                    ? counts[tab.value as keyof typeof counts]
                                    : 0;

                        return (
                            <button
                                key={tab.value}
                                onClick={() => handleTabChange(tab.value)}
                                className={`tab-button border-b-2 ${activeStatus === tab.value
                                    ? "border-primary text-primary"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    } py-3 sm:py-4 px-3 text-xs sm:text-sm font-medium whitespace-nowrap`}
                            >
                                {tab.label}
                                <span
                                    className={`hidden lg:inline ${activeStatus === tab.value
                                        ? "bg-primary text-white"
                                        : "bg-gray-200 text-gray-700"
                                        } px-2 py-1 rounded-full text-xs ml-2`}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </div>
    )
}