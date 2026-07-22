"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { StoreCartItemSkeleton } from "@/components/carts/CartSkletonCard";
import { CartStoreCard } from "@/components/carts/CartStoreCard";
import { GuestCartStoreCard } from "@/components/carts/GuestCartStoreCard";
import { ProductCard, SkeletonProductCard } from "@/components/shared/ProductCard";
import { useCartItems, useGuestCart } from "@/features/cart/hooks";
import { useUser } from "@/features/auth/hooks";
import { useProducts } from "@/features/products/hooks";
import { CartItem } from "@/types";
import type { GuestCartItem } from "@/lib/guest-cart-service";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { StepIndicator } from "@/components/orders/step/StepIndicator";

export default function CartList() {
    const { data: userData } = useUser();
    const isLoggedIn = !!userData?.data;

    // Server cart (hanya valid jika sudah login)
    const { data, isPending } = useCartItems();

    // Guest cart dari localStorage
    const { items: guestItems, removeItem: removeGuestItem, updateItem: updateGuestItem } = useGuestCart();

    const { data: recsData, isLoading: isLoadingRecs } = useProducts({ per_page: 4, sort: "-sold_count" });

    const cartItems = useMemo(() => data?.data || [], [data?.data]);
    const recs = useMemo(() => recsData?.data || [], [recsData?.data]);

    // Grup server cart berdasarkan store
    const groupedItems = useMemo(() => {
        if (!cartItems.length) return {};
        return cartItems.reduce((acc, item) => {
            const key = `${item.store_id}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {} as Record<string, CartItem[]>);
    }, [cartItems]);

    // Grup guest cart berdasarkan store
    const groupedGuestItems = useMemo(() => {
        if (!guestItems.length) return {};
        return guestItems.reduce((acc, item) => {
            const key = item.store_id;
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {} as Record<string, GuestCartItem[]>);
    }, [guestItems]);

    /* ── Loading (hanya saat login & fetching server cart) ── */
    if (isLoggedIn && isPending) {
        return (
            <div className="space-y-6">
                <StoreCartItemSkeleton />
            </div>
        );
    }

    /* ── Tentukan apakah benar-benar kosong ── */
    const serverEmpty = !isLoggedIn || cartItems.length === 0;
    const guestEmpty = guestItems.length === 0;
    const totalEmpty = serverEmpty && guestEmpty;

    /* ── Empty State ── */
    if (totalEmpty) {
        return (
            <div className="space-y-12 w-full">
                {/* Empty card */}
                <div className="cart-empty-card">
                    {/* Decorative circles */}
                    <div className="cart-empty-decor-1" />
                    <div className="cart-empty-decor-2" />

                    <div className="cart-empty-icon-wrapper">
                        <ShoppingCart size={36} />
                    </div>

                    <h3 className="cart-empty-title">
                        Keranjang Belanja Kosong
                    </h3>
                    <p className="cart-empty-desc">
                        Belum ada barang di keranjang belanja Anda. Mari dukung UMKM lokal dan temukan produk terbaik pilihan Anda!
                    </p>
                    <Link href="/" className="btn btn-primary btn-lg">
                        <ShoppingBag size={18} /> Mulai Belanja
                    </Link>
                </div>

                {/* Recommendations */}
                <div>
                    <div style={{ marginBottom: 20 }}>
                        <h2 style={{
                            fontSize: 20, fontWeight: 800,
                            color: "var(--text-primary, #1A1008)",
                            margin: "0 0 4px",
                            display: "flex", alignItems: "center", gap: 8
                        }}>
                            <ShoppingBag size={20} style={{ color: "var(--terracotta, #F7620A)" }} />
                            Rekomendasi Terlaris
                        </h2>
                        <p style={{ fontSize: 14, color: "var(--text-muted, #6B4C2A)", margin: 0 }}>
                            Produk lokal terbaik yang paling dicari pembeli
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {isLoadingRecs
                            ? Array(4).fill(null).map((_, i) => <SkeletonProductCard key={i} />)
                            : recs.slice(0, 4).map((product: any) => <ProductCard key={product.id} product={product} />)
                        }
                    </div>
                </div>
            </div>
        );
    }

    /* ── Filled Cart ── */
    return (
        <div className="space-y-6">
            {/* Steps */}
            <StepIndicator currentStep="cart" />

            {/* Server Cart (jika sudah login) */}
            {isLoggedIn && Object.entries(groupedItems).map(([storeId, storeItems]) => (
                <CartStoreCard
                    key={storeId}
                    img={storeItems[0].store.logo_url}
                    storeId={storeId}
                    storeName={storeItems[0].store.name}
                    storeLocation={storeItems[0].store.address}
                    items={storeItems}
                />
            ))}

            {/* Guest Cart (item dari localStorage — tampil untuk semua user) */}
            {Object.entries(groupedGuestItems).map(([storeId, storeGuestItems]) => (
                <GuestCartStoreCard
                    key={`guest-${storeId}`}
                    storeId={storeId}
                    storeName={storeGuestItems[0].store_name}
                    storeLocation={storeGuestItems[0].store_address}
                    storeLogoUrl={storeGuestItems[0].store_logo_url}
                    items={storeGuestItems}
                    onRemove={removeGuestItem}
                    onUpdateQuantity={updateGuestItem}
                />
            ))}
        </div>
    );
}
