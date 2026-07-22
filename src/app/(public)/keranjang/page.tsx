"use client";

import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
import CartList from "@/components/carts/CartList";
import CartSidebar from "@/components/carts/CartSidebar";
import { useCartItems, useGuestCart } from "@/features/cart/hooks";
import { useUser } from "@/features/auth/hooks";

export default function CartPage() {
    const { data: userData } = useUser();
    const isLoggedIn = !!userData?.data;

    const { data, isPending } = useCartItems();
    const { items: guestItems } = useGuestCart();

    const serverCartItems = data?.data || [];
    const hasItems =
        (isLoggedIn && !isPending && serverCartItems.length > 0) ||
        guestItems.length > 0;

    return (
        <div className="cart-page-wrapper">
            <Navbar />

            <main className="cart-main-container">
                {/* Page Header */}
                <div style={{ marginBottom: 32 }}>
                    <h1 className="cart-header-title">
                        Keranjang Belanja
                    </h1>
                    <p className="cart-header-subtitle">
                        Jelajahi, kelola, dan selesaikan pesanan produk pilihan Anda dari berbagai merchant Sleman Mart.
                    </p>
                </div>

                {hasItems ? (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-3">
                            <CartList />
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <CartSidebar />
                        </div>
                    </div>
                ) : (
                    <div className="w-full">
                        <CartList />
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
