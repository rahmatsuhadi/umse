"use client"

import React, { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import { useRouter, useSearchParams } from "next/navigation";
import OrderDetailModal from "./OrderDetailModal";
import { useInfiniteOrders } from "@/features/order/hooks";
import { Order, ShippingItem } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewModalOrder } from "./review/ReviewModal";
import { CompleteOrderModal } from "./CompletedOrderModal";
import { DeliveredOrderModal } from "./DeliveredOrderModal";



const confirmReceived = (id: string) => alert(`Konfirmasi terima: ${id}`);


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


export default function OrderList() {
    // const [ordersData] = useState(orders);
    const router = useRouter();
    const searchParams = useSearchParams();

    const statusFromParams = searchParams.get("status") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const search = searchParams.get("q") || "";
    const [activeStatus, setActiveStatus] = useState<string>(statusFromParams);

    // Bangun filter secara dinamis
    const filter: Record<string, string> = {};

    if (statusFromParams) {
        filter.status = statusFromParams;
    }

    if (startDate || endDate) {
        filter.created_at = `${startDate}:${endDate}`;
    }


    const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteOrders({ filter: filter, ...(search && { search }) })

    const ordersData = data?.pages.flatMap(page => page.data) ?? [];

    const counts = data?.pages[0].meta.count || {
        awaiting_payment: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        cancelled: 0,
        delivered: 0,
        completed: 0,
        total: 0,
    }


    // Sync state to URL param on tab change
    const handleTabChange = (status: string) => {
        setActiveStatus(status);

        const params = new URLSearchParams(searchParams.toString());
        if (status) {
            params.set("status", status);
        } else {
            params.delete("status");
        }
        router.replace(`?${params.toString()}`, {
            scroll: false
        });
    };

    // Keep state in sync if user uses browser back/forward
    useEffect(() => {
        setActiveStatus(statusFromParams);
    }, [statusFromParams]);

    const filteredOrders = ordersData.filter((order) =>
        activeStatus ? order.status === activeStatus : true
    );


    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const [selectedItemReview, setSelectedItemReview] = useState<ShippingItem | null>(null);

    const [orderToComplete, setOrderToComplete] = useState<Order | null>(null);
    
    const [orderToDelivered, setDeliveredOrder] = useState<Order | null>(null);



    return (
        <div className="lg:col-span-3 ">
            {/* <!-- Order Status Tabs --> */}
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

            {/* <!-- Orders Container --> */}
            <div id="ordersContainer" className="space-y-3 sm:space-y-4">
                {isLoading ? Array(1).fill(null).map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md mb-6 animate-pulse py-8 border px-4">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-10 pl-2 w-[14%] my-2" />
                            <Skeleton className="h-10 pl-2 w-[14%] my-2" />
                        </div>
                        <Skeleton className="h-10 pl-2 w-[14%] my-2" />
                        <Skeleton className="h-10 pl-2 w-full my-2" />
                        <Skeleton className="h-10 pl-2 w-[14%] my-2" />
                    </div>
                )) : filteredOrders.length > 0 ?

                    filteredOrders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onCompleteOrder={() =>setOrderToComplete(order) }
                            onDeliveredOrder={() => setDeliveredOrder(order)}
                            // formatDate={formatDate}
                            viewOrderDetail={() => setSelectedOrder(order)}
                            // trackOrder={trackOrder}
                            openReviewModal={(item) => setSelectedItemReview(item)}
                            confirmReceived={confirmReceived}
                        />
                    )) : (
                        <div
                            className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center"
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
                    )}

                <OrderDetailModal
                    open={!!selectedOrder}
                    orderId={selectedOrder?.id || ''}
                    onClose={() => setSelectedOrder(null)}
                />

                {selectedItemReview && (
                    <ReviewModalOrder
                        orderId={selectedItemReview.order_id}
                        open={!!selectedItemReview}
                        item={selectedItemReview}
                        onClose={() => setSelectedItemReview(null)}
                    />

                )}
                {orderToComplete && (
                    <CompleteOrderModal 
                        open={!!orderToComplete}
                        onClose={() => setOrderToComplete(null)}
                        order={orderToComplete}
                    />
                )}

                {orderToDelivered && (
                    <DeliveredOrderModal 
                        open={!!orderToDelivered}
                        onClose={() => setDeliveredOrder(null)}
                        order={orderToDelivered}
                    />
                )}




                {/* <!-- Load More --> */}
                {hasNextPage && (
                    <div className="text-center mt-6 sm:mt-8" >
                        <button
                            type="button"
                            onClick={() => fetchNextPage()}
                            className="bg-gray-200 text-gray-700 px-4 sm:px-6 py-3 rounded-md hover:bg-gray-300 transition duration-300 text-sm sm:text-base"
                        >
                            <i className="fas fa-plus mr-2"></i>Muat Lebih Banyak
                        </button>
                    </div>
                )}

            </div>
            <div>


            </div>


        </div >

    )
}