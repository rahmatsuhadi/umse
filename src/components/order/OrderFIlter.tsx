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
    const [searchTerm, setSearchTerm] = useState<string>(searchParams.get("search") || "");

    // Function to apply filters and update the URL with query parameters
    const applyFilters = () => {
        const newFilters = {
            status,
            startDate,
            endDate,
            searchTerm,
        };

        // Clean up empty filter values to avoid unnecessary query params
        const query = Object.fromEntries(
            Object.entries(newFilters).filter(([key, value]) => value)
        );

        // Update the URL with the new query parameters
        const queryString = new URLSearchParams(query).toString();
        router.push(`${pathname}?${queryString}`);
    };

    // Synchronize state with URL search parameters whenever the URL changes
    useEffect(() => {
        setStatus(searchParams.get("status") || "");
        setStartDate(searchParams.get("startDate") || "");
        setEndDate(searchParams.get("endDate") || "");
        setSearchTerm(searchParams.get("search") || "");
    }, [searchParams]);

    return (
        <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-4">Filter Pesanan</h3>

                {/* Status Filter */}
                <div className="mb-4 sm:mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status Pesanan</label>
                    <select
                        id="statusFilter"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">Semua Status</option>
                        <option value="pending">Menunggu Konfirmasi</option>
                        <option value="processing">Diproses</option>
                        <option value="packed">Dikemas</option>
                        <option value="shipped">Dikirim</option>
                        <option value="completed">Selesai</option>
                    </select>
                </div>

                {/* Date Range */}
                <div className="mb-4 sm:mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Periode</label>
                    <div className="space-y-2">
                        <input
                            type="date"
                            id="startDate"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <input
                            type="date"
                            id="endDate"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cari Pesanan</label>
                    <input
                        type="text"
                        id="searchOrder"
                        placeholder="Nomor pesanan atau nama produk"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Apply Filter Button */}
                <button
                    onClick={applyFilters}
                    className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition duration-300"
                >
                    <i className="fas fa-filter mr-2"></i>Terapkan Filter
                </button>
            </div>
        </div>
    );
}
