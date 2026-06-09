"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAddToCart } from "@/features/cart/hooks";
import { useUser } from "@/features/auth/hooks";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Helper function to format prices
const formatPrice = (price: any): string => {
    if (!price) return "Rp 0";
    if (typeof price === "number") return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
    if (typeof price === "object" && "formatted" in price) return price.formatted as string;
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(price));
};

export const SkeletonServiceCard = ({ className }: { className?: string }) => (
    <div className={`product-card-mini ${className || ""}`} style={{ opacity: 0.7, pointerEvents: "none" }}>
        <div className="product-card-mini-img" style={{ background: "#F5E9E2", animation: "pulse 1.5s infinite" }} />
        <div className="product-card-mini-body">
            <div className="product-card-mini-name" style={{ height: 14, width: "80%", background: "#F5E9E2", marginBottom: 6, borderRadius: 4 }} />
            <div className="product-card-mini-price" style={{ height: 16, width: "60%", background: "#F5E9E2", marginBottom: 6, borderRadius: 4 }} />
            <div className="product-card-mini-shop" style={{ height: 12, width: "50%", background: "#F5E9E2", borderRadius: 4 }} />
        </div>
    </div>
);

interface ServiceCardProps {
    product: any;
    className?: string;
}


export function ServiceCard({ product: p, className }: ServiceCardProps) {
    const [imgError, setImgError] = useState(false);
    const { data: user } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const { mutate: addToCart, isPending } = useAddToCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            router.push(`/masuk?redirect=${pathname}`);
            return;
        }
        addToCart({
            product_id: String(p.id),
            quantity: 1,
        });
    };

    // From ProductCard parsing logic
    const isEmergencyClose = p.store?.is_emergency_close === true;
    const isClosed = p.store?.is_open === false || isEmergencyClose;
    const discountPct = p.discount_percentage ? Number(p.discount_percentage) : 0;
    const hasDiscount = discountPct > 0 && p.discount_price != null;
    const displayPrice = hasDiscount ? formatPrice(p.discount_price) : formatPrice(p.price);

    // const ratingAvg = p.rating_avg ?? (p.average_rating ? Number(p.average_rating) : 0);
    const soldCount = p.sold_count ?? 0;
    // const ratingDisplay = typeof ratingAvg === "number" && ratingAvg > 0 ? ratingAvg.toFixed(1) : "0";

    const openHour = p.store?.open_hour ? Number(String(p.store.open_hour).split(':')[0]) : undefined;
    const closeHour = p.store?.close_hour ? Number(String(p.store.close_hour).split(':')[0]) : undefined;

    let hourPill: { state: 'open' | 'closing-soon' | 'closed'; text: string; pillClass: string } | null = null;
    if (isClosed && openHour !== undefined) {
        const oh = openHour < 10 ? `0${openHour}` : `${openHour}`;
        hourPill = { state: 'closed', text: `Buka ${oh}:00`, pillClass: 'closed-pill' };
    } else if (!isClosed && closeHour) {
        hourPill = { state: 'open', text: `Buka s/d ${closeHour}:00`, pillClass: 'open' };
        const now = new Date().getHours();
        if (closeHour - now <= 1 && closeHour - now > 0) {
            hourPill = { state: 'closing-soon', text: 'Tutup 1j lagi', pillClass: 'closing' };
        }
    }

    // From CatCard render logic
    const img = p.media?.[0]?.media_url || p.thumbnail?.media_url || "";
    const name = p.name;
    const shop = p.store?.name || "UMKM Sleman";
    const badge = null;
    const initial = name.trim().charAt(0) || "?";

    const grayStyle = isClosed ? { filter: "grayscale(100%) brightness(0.72)" } : {};

    const topBadge = badge === 'Terlaris' ? <div className="hot-badge">🔥 Terlaris</div>
        : badge === 'Unggulan' ? <div className="star-badge">⭐ Unggulan</div> : null;

    let hourPillRender = null;
    if (hourPill) {
        hourPillRender = (
            <div className={`openhour-pill ${hourPill.pillClass}`} style={{ position: 'absolute', bottom: '8px', left: '8px', zIndex: 2 }}>
                {hourPill.state === 'open' ? '●' : hourPill.state === 'closing-soon' ? '⚠' : '○'} {hourPill.text}
            </div>
        );
    }

    let closedOverlay = null;
    if (isClosed) {
        const oh = openHour && openHour < 10 ? '0' + openHour : openHour || '08';
        closedOverlay = (
            <div className="closed-overlay">
                <div className="closed-badge">🔒 Tutup</div>
                {!isEmergencyClose && <div className="closed-time">Buka jam {oh}:00</div>}
            </div>
        );
    }

    const catName = p.category?.name || "Jasa";
    const area = p.store?.district?.name || p.district?.name || "Sleman";
    const desc = p.description || p.short_description || "";

    return (
        <Link href={`/produk/${p.id}`} className={`jasa-card ${className || ""}${isClosed ? ' is-closed' : ''}`} style={{ textDecoration: 'none' }}>
            <div className="jasa-card-img">
                {imgError || !img ? (
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
                            src={img}
                            alt={name}
                            fill
                            style={{ objectFit: "cover", ...grayStyle }}
                            onError={() => setImgError(true)}
                        />
                    </div>
                )}
                <div className="jasa-tipe-ribbon">🛠️ Jasa</div>
                <div className="jasa-cat-tag" style={{ background: '#eee', color: '#666' }}>🛠️ {catName}</div>
                {topBadge}
                {hourPillRender}
                {closedOverlay}
            </div>
            <div className="jasa-card-body">
                <div className="jasa-card-name">{name}</div>
                <div className="jasa-card-shop">🏪 {shop} &nbsp;·&nbsp; 📍 {area}</div>
                <div
                    className="jasa-card-desc"
                    style={{ fontSize: '12px', color: '#666', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '8px' }}
                    dangerouslySetInnerHTML={{ __html: desc }}
                />
                <div className="jasa-card-footer">
                    <div>
                        <div className="jasa-card-price" style={{ color: '#7B1FA2', fontWeight: 600, fontSize: '15px' }}>{displayPrice}</div>
                        <div className="jasa-card-meta" style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                            {/* ⭐ {ratingDisplay} &nbsp;·&nbsp; */} {soldCount} dipesan
                        </div>
                    </div>
                    {isClosed ? (
                        <button
                            className="cat-card-cart disabled"
                            title="Toko sedang tutup"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <ShoppingCart size={16} />
                        </button>
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
