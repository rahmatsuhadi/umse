"use client";
import { StoreCartItem } from "@/components/cart/card";
import { StoreCartItemSkeleton } from "@/components/cart/skeleton";
import Footer from "@/components/layout/Footer";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import { useCartItems, } from "@/features/cart/hooks";
import { CartItem } from "@/types";
import Link from "next/link";
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

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            {/* header */}
            <header className="bg-white shadow-md sticky top-0">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg sm:text-2xl font-bold text-gray-800">Keranjang Belanja</h1>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <Link href="/" className="text-primary hover:text-primary-dark text-sm sm:text-base">
                                <i className="fas fa-arrow-left mr-1"></i>
                                <span className="hidden sm:inline">Kembali Belanja</span>
                                <span className="sm:hidden">Belanja</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <section className="py-8 flex-grow">
                <div className="container mx-auto px-4">

                    {isPending ? Array(1).fill(null).map((_, index) => (
                        <StoreCartItemSkeleton key={index} />
                    )) : cartItems.length === 0 ? (
                        <div className="text-center text-gray-500 py-12">
                            <i className="fas fa-box-open text-4xl mb-4 text-gray-400"></i>
                            <p className="text-lg font-medium">Items tidak ditemukan</p>
                            <p className="text-sm">Silahkan melanjutkan belanja</p>
                        </div>
                    )
                        : Object.entries(groupedItems).map(([storeId, storeItems]) => {
                            return (
                                <StoreCartItem
                                    img={storeItems[0].store.logo_url}
                                    key={storeId}
                                    storeId={storeId}
                                    storeName={storeItems[0].store.name}
                                    storeLocation={storeItems[0].store.address}
                                    // shipping={10000}
                                    items={storeItems}

                                />
                            )
                        })}


                    {/* <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                            <div>
                                <p className="text-gray-600 text-sm sm:text-base">Total Item Terpilih: {cartItems.length} produk dari {Object.keys(groupedItems).length} toko</p>
                                <p className="text-xs sm:text-sm text-orange-600 mt-1">
                                    <i className="fas fa-info-circle mr-1"></i>
                                    Checkout dilakukan per toko untuk memastikan pengiriman yang optimal
                                </p>
                            </div>
                            <div className="text-left sm:text-right">
                                <p className="text-lg sm:text-2xl font-bold text-gray-800">Total Keranjang</p>
                                <p className="text-2xl sm:text-3xl font-bold text-primary">
                                    Rp {cartItems.reduce((acc: number, item) => acc + item.price * item.quantity, 0) + 10000}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500">*Belum termasuk ongkir</p>
                            </div>
                        </div>
                    </div> */}
                </div>
            </section>

            <AnimatedWrapper>
                <Footer />
            </AnimatedWrapper>
        </div>
    );
}