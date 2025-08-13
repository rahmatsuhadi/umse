"use client"

import React, { useEffect, useState } from "react";
import OrderCard, { Order } from "./OrderCard";
import { useRouter, useSearchParams } from "next/navigation";
import OrderDetailModal from "./OrderDetailModal";
import ReviewModal from "./ReviewModal";

const orders = [
    {
        id: "SLM240001",
        date: "2025-01-15",
        status: "shipped",
        statusText: "Dikirim",
        statusClass: "bg-blue-100 text-blue-800",
        items: [
            {
                name: "Keripik Tempe Original",
                seller: "Toko Cemilan Sleman",
                price: 15000,
                quantity: 2,
                image: "placeholder",
            },
        ],
        shipping: {
            address: "Jl. Kaliurang KM 5, Sleman",
            cost: 10000,
        },
        total: 40000,
        trackingNumber: "JNE123456789",
    },
    {
        id: "SLM239998",
        date: "2025-01-10",
        status: "completed",
        statusText: "Selesai",
        statusClass: "bg-green-100 text-green-800",
        items: [
            {
                name: "Batik Jumputan",
                seller: "Batik Sleman Asri",
                price: 125000,
                quantity: 1,
                image: "placeholder",
            },
        ],
        shipping: {
            address: "Jl. Magelang KM 3, Sleman",
            cost: 15000,
        },
        total: 140000,
        canReview: true,
    },
    {
        id: "SLM239995",
        date: "2025-01-08",
        status: "processing",
        statusText: "Diproses",
        statusClass: "bg-yellow-100 text-yellow-800",
        items: [
            {
                name: "Gula Aren Organik",
                seller: "Aren Murni Sleman",
                price: 25000,
                quantity: 3,
                image: "placeholder",
            },
        ],
        shipping: {
            address: "Jl. Solo KM 10, Sleman",
            cost: 10000,
        },
        total: 85000,
    },
    {
        id: "SLM239990",
        date: "2025-01-05",
        status: "pending",
        statusText: "Menunggu Konfirmasi",
        statusClass: "bg-gray-100 text-gray-800",
        items: [
            {
                name: "Madu Hutan Murni",
                seller: "Madu Asli Sleman",
                price: 85000,
                quantity: 1,
                image: "placeholder",
            },
            {
                name: "Dodol Nangka",
                seller: "Dodol Tradisional",
                price: 18000,
                quantity: 2,
                image: "placeholder",
            },
        ],
        shipping: {
            address: "Jl. Godean KM 7, Sleman",
            cost: 12000,
        },
        total: 133000,
    },
];

const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    return new Date(dateStr).toLocaleDateString("id-ID", options);
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
    }).format(price);
};

// ✅ Dummy handlers (bisa ganti dengan navigasi atau modals)
const viewOrderDetail = (id: string) => alert(`Lihat detail pesanan: ${id}`);
const trackOrder = (id: string) => alert(`Lacak pesanan: ${id}`);
const openReviewModal = (id: string) => alert(`Buka ulasan untuk: ${id}`);
const cancelOrder = (id: string) => alert(`Batalkan pesanan: ${id}`);
const confirmReceived = (id: string) => alert(`Konfirmasi terima: ${id}`);


const TABS = [
    { label: "Semua", value: "" },
    { label: "Menunggu", value: "pending" },
    { label: "Diproses", value: "processing" },
    { label: "Dikirim", value: "shipped" },
    { label: "Selesai", value: "completed" },
];


export default function OrderList() {
    const [ordersData] = useState(orders);
    const router = useRouter();
    const searchParams = useSearchParams();

    const statusFromParams = searchParams.get("status") || "";
    const [activeStatus, setActiveStatus] = useState<string>(statusFromParams);

    // Sync state to URL param on tab change
    const handleTabChange = (status: string) => {
        setActiveStatus(status);

        const params = new URLSearchParams(searchParams.toString());
        if (status) {
            params.set("status", status);
        } else {
            params.delete("status");
        }
        router.replace(`?${params.toString()}`);
    };

    // Keep state in sync if user uses browser back/forward
    useEffect(() => {
        setActiveStatus(statusFromParams);
    }, [statusFromParams]);

    const filteredOrders = ordersData.filter((order) =>
        activeStatus ? order.status === activeStatus : true
    );

    const getCountByStatus = (status: string) =>
        ordersData.filter((order) => order.status === status).length;

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const [showReviewModal, setShowReviewModal] = useState(false);

    const handleSubmitReview = (data: {
        rating: number;
        comment: string;
        files: File[];
    }) => {
        console.log("Review submitted:", data);
    };

    return (
        <div className="lg:col-span-3">
            {/* <!-- Order Status Tabs --> */}
            <div className="bg-white rounded-lg shadow-md mb-4 sm:mb-6">
                <div className="border-b border-gray-200">
                    <nav
                        className="flex space-x-2 sm:space-x-8 px-4 sm:px-6 overflow-x-auto"
                        aria-label="Tabs"
                    >
                        {TABS.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => handleTabChange(tab.value)}
                                className={`tab-button border-b-2 ${activeStatus === tab.value
                                    ? "border-primary text-primary"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    } py-3 sm:py-4 px-1 text-xs sm:text-sm font-medium whitespace-nowrap`}
                            >
                                {tab.label}
                                <span
                                    className={`hidden sm:inline ${activeStatus === tab.value
                                        ? "bg-primary text-white"
                                        : "bg-gray-200 text-gray-700"
                                        } px-2 py-1 rounded-full text-xs ml-2`}
                                >
                                    {tab.value ? getCountByStatus(tab.value) : ordersData.length}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* <!-- Orders Container --> */}
            <div id="ordersContainer" className="space-y-3 sm:space-y-4">
                {filteredOrders.map((order) => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        formatDate={formatDate}
                        formatPrice={formatPrice}
                        viewOrderDetail={() => setSelectedOrder(order)}
                        trackOrder={trackOrder}
                        openReviewModal={() => setShowReviewModal(true)}
                        cancelOrder={cancelOrder}
                        confirmReceived={confirmReceived}
                    />
                ))}

                <OrderDetailModal
                    open={!!selectedOrder}
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
                <ReviewModal
                    open={showReviewModal}
                    onClose={() => setShowReviewModal(false)}
                    onSubmit={handleSubmitReview}
                />
                {/* <!-- Empty State --> */}
                {
                    filteredOrders.length === 0 && (
                        <div
                            className="hidden bg-white rounded-lg shadow-md p-8 sm:p-12 text-center"
                        >
                            <i
                                className="fas fa-shopping-bag text-4xl sm:text-6xl text-gray-300 mb-4"
                            ></i>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                                Belum Ada Pesanan
                            </h3>
                            <p className="text-sm sm:text-base text-gray-500 mb-6">
                                Anda belum memiliki pesanan dengan filter yang dipilih
                            </p>
                            <a
                                href="products.html"
                                className="bg-primary text-white px-4 sm:px-6 py-3 rounded-md hover:bg-primary-dark transition duration-300 text-sm sm:text-base"
                            >
                                <i className="fas fa-shopping-bag mr-2"></i>Mulai Belanja
                            </a>
                        </div>
                    )
                }

                {/* <!-- Load More --> */}
                < div className="text-center mt-6 sm:mt-8" >
                    <button
                        // onclick="loadMoreOrders()"
                        className="bg-gray-200 text-gray-700 px-4 sm:px-6 py-3 rounded-md hover:bg-gray-300 transition duration-300 text-sm sm:text-base"
                    >
                        <i className="fas fa-plus mr-2"></i>Muat Lebih Banyak
                    </button>
                </div>


            </div>
            <div>


            </div>


        </div >

    )
}