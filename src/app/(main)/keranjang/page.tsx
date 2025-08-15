"use client";
import { StoreCartItem } from "@/components/cart/card";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import React from "react";

export default function CartPage() {

    const [cartItems, setCartItems] = React.useState([
        { title: 'Keripik Tempe Original', variant: 'Original', price: 15000, quantity: 2 },
        { title: 'Kerupuk Tahu Krispy', variant: 'Original', price: 12000, quantity: 1 }
    ]);

    const handleItemIncrement = (index: number) => {
        const updatedItems = [...cartItems];
        updatedItems[index].quantity += 1;
        setCartItems(updatedItems);
    };

    const handleItemDecrement = (index: number) => {
        const updatedItems = [...cartItems];
        if (updatedItems[index].quantity > 1) {
            updatedItems[index].quantity -= 1;
            setCartItems(updatedItems);
        }
    };

    const handleItemRemove = (index: number) => {
        const updatedItems = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedItems);
    };
    return (
        <div className="bg-gray-50">
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
                            {/* <Link href="/" className="text-primary hover:text-primary-dark text-sm sm:text-base">
                                <i className="fas fa-home mr-1"></i>
                                <span className="hidden sm:inline">Beranda</span>
                            </Link> */}
                        </div>
                    </div>
                </div>
            </header>

            <section className="py-8">
                <div className="container mx-auto px-4">
                    <StoreCartItem
                        storeName="Toko Cemilan Sleman"
                        storeLocation="Jl. Magelang KM 5, Sleman"
                        shipping={10000}
                        items={cartItems}
                        onItemIncrement={handleItemIncrement}
                        onItemDecrement={handleItemDecrement}
                        onItemRemove={handleItemRemove}
                    />

                    <StoreCartItem
                        storeName="Toko Cemilan Sleman"
                        storeLocation="Jl. Magelang KM 5, Sleman"
                        shipping={10000}
                        items={cartItems}
                        onItemIncrement={handleItemIncrement}
                        onItemDecrement={handleItemDecrement}
                        onItemRemove={handleItemRemove}
                    />

                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                            <div>
                                <p className="text-gray-600 text-sm sm:text-base">Total Item Terpilih: {cartItems.length} produk dari 1 toko</p>
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
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}