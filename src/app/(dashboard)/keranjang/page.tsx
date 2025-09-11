"use client";
import CartHeader from "@/components/carts/CartHeader";
import { StoreCartItemSkeleton } from "@/components/carts/CartSkletonCard";
import { CartStoreCard } from "@/components/carts/CartStoreCard";
import Footer from "@/components/layout/Footer";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import { EmptyState } from "@/components/shared/EmptyState";
import { useCartItems, } from "@/features/cart/hooks";
import { CartItem } from "@/types";
import React, { useMemo } from "react";

export default function CartPage() {


    const { data, isPending } = useCartItems()

    const cartItems = useMemo(() => data?.data || [], [data?.data]);

    const groupedItems = useMemo(() => {
        if (!cartItems) return {};

        return cartItems.reduce((acc, item) => {
            const storeId = item.store_id; // Asumsi store_id ada di dalam data produk
            // const storeName = item.product.store.name;

            const key = `${storeId}`; // Buat key unik dengan nama toko

            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item);
            return acc;
        }, {} as Record<string, CartItem[]>);
    }, [cartItems]);


    const renderContent = () => {
        if (isPending) {
            return (
                Array(1).fill(null).map((_, index) => (
                    <StoreCartItemSkeleton key={index} />
                ))
            )
        }
        else if (cartItems.length == 0 && !isPending) {
            return (
                <EmptyState title="Items tidak ditemukan" message="Silahkan melajutkan belanja" />
            )
        }
        else {
            return (

                Object.entries(groupedItems).map(([storeId, storeItems]) => {
                    return (
                        <CartStoreCard
                            img={storeItems[0].store.logo_url}
                            key={storeId}
                            storeId={storeId}
                            storeName={storeItems[0].store.name}
                            storeLocation={storeItems[0].store.address}
                            items={storeItems}

                        />
                    )
                })
            )

        }
    }

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            {/* header */}
            <CartHeader />

            <section className="py-8 flex-grow">
                <div className="container mx-auto px-4">

                    {renderContent()}

                </div>
            </section>

            <AnimatedWrapper>
                <Footer />
            </AnimatedWrapper>
        </div>
    );
}