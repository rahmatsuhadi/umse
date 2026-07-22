"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAddToCart, useGuestCart } from "@/features/cart/hooks";
import { useUser } from "@/features/auth/hooks";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types";

export interface CatCardProps {
    product?: Product;
    id: number | string;
    name: string;
    shop: string;
    price: string;
    priceOld?: string;
    rating: string | number;
    sold: number;
    img: string;
    isClosed?: boolean;
    isEmergencyClose?: boolean;
    badge?: "Terlaris" | "Unggulan" | null;
    promo?: string | null;
    isNew?: boolean;
    openHour?: number;
    closeHour?: number;
    category?: string;
    type?: string;
    hourPill?: { state: 'open' | 'closing-soon' | 'closed'; text: string; pillClass: string } | null;
    phone?: string;
    qrisUrl?: string;
    className?: string;
}


export function CatCard(p: CatCardProps) {
    const isClosed = p.isClosed === true;
    const router = useRouter();
    const pathname = usePathname();
    const { data: user } = useUser();
    const { mutate: addToCart, isPending } = useAddToCart();
    const { addItem: addToGuestCart } = useGuestCart();
    const grayStyle = isClosed ? { filter: "grayscale(100%) brightness(0.72)" } : {};

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            if (p.product) {
                const product = p.product;
                addToGuestCart({
                    product_id: String(product.id),
                    quantity: 1,
                    product_name: product.name,
                    product_thumbnail: product.thumbnail?.media_url || product.media?.[0]?.media_url || '',
                    product_price_value: product.price?.value || 0,
                    product_price_formatted: product.price?.formatted || '',
                    store_id: product.store.id,
                    store_name: product.store.name,
                    store_logo_url: product.store.logo_url || '',
                    store_address: product.store.address || '',
                    store_slug: product.store.slug,
                    store_qris_url: product.store.qris_url,
                    store_village_id: product.store.village_id != null ? String(product.store.village_id) : undefined,
                    store_district_id: product.store.district_id != null ? String(product.store.district_id) : undefined,
                    store_regency_id: product.store.regency_id != null ? String(product.store.regency_id) : undefined,
                    store_description: product.store.description,
                });
            } else {
                router.push(`/masuk?redirect=${pathname}`);
            }
            return;
        }
        addToCart({
            product_id: String(p.id),
            quantity: 1,
        });
    };

    const topBadge = p.badge === 'Terlaris' ? <div className="hot-badge">🔥 Terlaris</div>
        : p.badge === 'Unggulan' ? <div className="star-badge">⭐ Unggulan</div> : null;
    const promoRibbon = p.promo ? <div className="promo-ribbon">{p.promo}</div> : null;
    const newRibbon = p.isNew ? <div className="new-ribbon">✨ Baru</div> : null;



    let hourPill = null;
    if (p.hourPill) {
        hourPill = (
            <div className={`openhour-pill ${p.hourPill.pillClass}`}>
                {p.hourPill.state === 'open' ? '●' : p.hourPill.state === 'closing-soon' ? '⚠' : '○'} {p.hourPill.text}
            </div>
        );
    }

    let closedOverlay = null;
    if (isClosed) {
        const oh = p.openHour && p.openHour < 10 ? '0' + p.openHour : p.openHour || '08';
        closedOverlay = (
            <div className="closed-overlay">
                <div className="closed-badge">🔒 Tutup</div>
                {!p.isEmergencyClose && <div className="closed-time">Buka jam {oh}:00</div>}
            </div>
        );
    }

    const [imgError, setImgError] = useState(false);
    const initial = p.name.trim().charAt(0) || "?";

    return (
        <Link href={`/produk/${p.id}`} className={`cat-card ${p.className || ""}${isClosed ? ' is-closed' : ''}`} style={{ textDecoration: 'none' }}>
            <div className="cat-card-img">
                {imgError || !p.img ? (
                    <div style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#F5E9E2",
                        color: "var(--terracotta, #D97706)",
                        fontSize: "2rem",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        ...grayStyle
                    }}>
                        {initial}
                    </div>
                ) : (
                    <div style={{ position: "relative", width: "100%", height: "100%" }}>
                        <Image
                            src={p.img}
                            alt={p.name}
                            fill
                            style={{ objectFit: "cover", ...grayStyle }}
                            onError={() => setImgError(true)}
                        />
                    </div>
                )}
                <div className="product-badge-overlay">
                    {promoRibbon}{newRibbon}{topBadge}
                </div>
                {hourPill}{closedOverlay}
            </div>
            <div className="cat-card-body">
                <div className="cat-card-name">{p.name}</div>
                <div className="cat-card-shop">🏪 {p.shop}</div>
                <div className="cat-card-footer">
                    <div className="cat-card-price-col">
                        <div className="cat-card-price">{p.price}</div>
                        {p.priceOld && <div className="cat-card-price-old">{p.priceOld}</div>}
                        <div className="cat-card-rating font-semibold text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-1.5 flex-wrap">
                            {/* ★ {p.rating} · */} {p.sold} terjual
                            {p.type && (
                                <span className="tipe-barang-sm ml-1" style={{ fontSize: '10px', padding: '0px 6px' }}>
                                    {p.type.toLowerCase() === 'service' ? '🛠️ Jasa' : '📦 Barang'}
                                </span>
                            )}
                        </div>
                    </div>
                    {isClosed || !p.qrisUrl ? (
                        <span
                            title={isClosed ? "Toko sedang tutup" : "Penjual belum mengupload QRIS"}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toast.error("Gagal menambahkan ke keranjang", {
                                    description: isClosed ? "Toko sedang tutup" : "Penjual belum mengupload QRIS",
                                });
                            }}
                            style={{ display: "inline-flex" }}
                        >
                            <button
                                className="cat-card-cart disabled"
                                style={{ pointerEvents: "none" }}
                            >
                                <ShoppingCart size={16} />
                            </button>
                        </span>
                    ) : (
                        <button
                            className="cat-card-cart"
                            title="Tambahkan ke Keranjang"
                            disabled={isPending}
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart size={16} />
                        </button>
                    )}
                </div>
            </div>
        </Link>
    );
}
