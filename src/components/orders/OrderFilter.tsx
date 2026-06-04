"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function OrderFilter() {
    const searchParams = useSearchParams();
    const pathname = usePathname(); // Get the current page path
    const router = useRouter();

    // Initialize state with search params from the URL (if any)
    const [status, setStatus] = useState<string>(searchParams.get("status") || "");
    const [startDate, setStartDate] = useState<string>(searchParams.get("startDate") || "");
    const [endDate, setEndDate] = useState<string>(searchParams.get("endDate") || "");
    const [searchTerm, setSearchTerm] = useState<string>(searchParams.get("q") || "");

    // Function to apply filters and update the URL with query parameters
    const applyFilters = () => {
        const newFilters = {
            status,
            startDate,
            endDate,
            q: searchTerm,
        };

        // Clean up empty filter values to avoid unnecessary query params
        const query = Object.fromEntries(
            Object.entries(newFilters).filter(([, value]) => value !== "" && value !== undefined && value !== null)
        );

        // Update the URL with the new query parameters
        const queryString = new URLSearchParams(query).toString();
        router.push(`${pathname}?${queryString}`, { scroll: false });
    };

    // Synchronize state with URL search parameters whenever the URL changes
    useEffect(() => {
        setStatus(searchParams.get("status") || "");
        setStartDate(searchParams.get("startDate") || "");
        setEndDate(searchParams.get("endDate") || "");
        setSearchTerm(searchParams.get("q") || "");
    }, [searchParams]);

    const labelStyle: React.CSSProperties = {
        fontWeight: 600,
        fontSize: 13,
        color: "var(--text-secondary, #4A3728)",
        marginBottom: 8,
        display: "block",
    };

    return (
        <div className="lg:col-span-1">
            <div className="cart-sidebar-panel">
                <div className="cart-sidebar-header">
                    <h3 className="cart-sidebar-title">
                        Filter Pesanan
                    </h3>
                </div>

                <div style={{ padding: 20 }}>
                    {/* Status Filter */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Status Pesanan</label>
                        <select
                            id="statusFilter"
                            className="price-input"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Semua Status</option>
                            <option value="pending">Menunggu Konfirmasi</option>
                            <option value="processing">Diproses</option>
                            <option value="shipped">Dikirim</option>
                            <option value="delivered">Sampai</option>
                            <option value="completed">Selesai</option>
                            <option value="expired">Expired</option>
                        </select>
                    </div>

                    {/* Date Range */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Periode</label>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <input
                                type="date"
                                id="startDate"
                                className="price-input"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <input
                                type="date"
                                id="endDate"
                                className="price-input"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Search */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={labelStyle}>Cari Pesanan</label>
                        <input
                            type="text"
                            id="searchOrder"
                            placeholder="Nomor pesanan"
                            className="price-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Apply Filter Button */}
                    <button
                        onClick={applyFilters}
                        className="btn btn-primary btn-sm w-full justify-center"
                        style={{ display: "inline-flex" }}
                    >
                        Terapkan Filter
                    </button>
                </div>
            </div>
        </div>
    );
}
