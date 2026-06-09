import { Meta } from "@/types";
import { useMemo } from "react";

const TABS = [
    { label: "Semua", value: "" },
    { label: "Menunggu Pembayaran", value: "awaiting_payment" },
    { label: "Menunggu Konfirmasi", value: "pending" },
    { label: "Diproses", value: "processing" },
    { label: "Dikirim", value: "shipped" },
    { label: "Sampai", value: "delivered" },
    { label: "Canceled", value: "cancelled" },
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
        <div style={{ marginBottom: 24 }}>
            <style dangerouslySetInnerHTML={{__html: `
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
            
            <div 
                className="no-scrollbar"
                style={{ 
                    overflowX: "auto",
                    WebkitOverflowScrolling: "touch",
                    padding: "4px 0",
                }}
            >
                <div
                    style={{ 
                        display: "flex",
                        gap: 8,
                        width: "max-content",
                        padding: "4px 2px"
                    }}
                    aria-label="Tabs"
                >
                    {TABS.map((tab) => {
                        const count =
                            tab.value === ""
                                ? counts?.["total"] ?? 0
                                : tab.value && counts?.[tab.value as keyof typeof counts] !== undefined
                                    ? counts[tab.value as keyof typeof counts]
                                    : 0;

                        const isActive = activeStatus === tab.value;

                        return (
                            <button
                                key={tab.value}
                                onClick={() => handleTabChange(tab.value)}
                                style={{
                                    background: isActive ? "var(--terracotta)" : "white",
                                    border: isActive ? "1.5px solid var(--terracotta)" : "1.5px solid var(--cream-dark)",
                                    color: isActive ? "white" : "var(--text-secondary)",
                                    fontWeight: 600,
                                    padding: "8px 16px",
                                    borderRadius: 50,
                                    fontSize: 13,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    boxShadow: isActive ? "0 4px 12px rgba(247,98,10,0.2)" : "0 2px 4px rgba(44,24,16,0.03)",
                                    outline: "none",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = "var(--cream)";
                                        e.currentTarget.style.borderColor = "var(--brown-light)";
                                        e.currentTarget.style.color = "var(--text-primary)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = "white";
                                        e.currentTarget.style.borderColor = "var(--cream-dark)";
                                        e.currentTarget.style.color = "var(--text-secondary)";
                                    }
                                }}
                            >
                                <span>{tab.label}</span>
                                <span
                                    style={{
                                        background: isActive ? "white" : "var(--cream-dark)",
                                        color: isActive ? "var(--terracotta)" : "var(--text-secondary)",
                                        fontWeight: 700,
                                        fontSize: 10,
                                        padding: "1px 6px",
                                        borderRadius: 50,
                                    }}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
