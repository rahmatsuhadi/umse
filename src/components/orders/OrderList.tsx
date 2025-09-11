"use client"

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteOrders } from "@/features/order/hooks";
import { Order, ShippingItem } from "@/types";
import OrderStatusTab from "./OrderStatusTab";
import OrderCard from "./OrderCard";
import OrderDetailModal from "./modal/DetailOrder";
import { ReviewModalOrder } from "./modal/ReviewOrder";
import { CompleteOrderModal } from "./modal/CompletedOrder";
import { DeliveredOrderModal } from "./modal/DeliveredOrder";
import OrderSkeletonCard from "./OrderSkeletonCard";
import OrderEmpty from "./OrderEmpty";



// const confirmReceived = (id: string) => alert(`Konfirmasi terima: ${id}`);



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
            <OrderStatusTab activeStatus={activeStatus} handleTabChange={handleTabChange} meta={data?.pages[0]?.meta} />

            {/* <!-- Orders Container --> */}
            <div id="ordersContainer" className="space-y-3 sm:space-y-4">
                {isLoading ? Array(1).fill(null).map((_, index) => (
                    <OrderSkeletonCard key={index}/>
                )) : filteredOrders.length > 0 ?

                    filteredOrders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onCompleteOrder={() => setOrderToComplete(order)}
                            onDeliveredOrder={() => setDeliveredOrder(order)}
                            // formatDate={formatDate}
                            viewOrderDetail={() => setSelectedOrder(order)}
                            // trackOrder={trackOrder}
                            openReviewModal={(item) => setSelectedItemReview(item)}
                            // confirmReceived={confirmReceived}
                        />
                    )) : (
                        <OrderEmpty/>
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