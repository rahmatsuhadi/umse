"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCreateVisitorLog } from "@/features/visitor-logs/hooks";

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

const waIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

export function ServiceCard({ product: p, className }: ServiceCardProps) {
    const { mutate: logVisitor } = useCreateVisitorLog();
    const [imgError, setImgError] = useState(false);

    // From ProductCard parsing logic
    const isClosed = p.store?.is_open === false;
    const discountPct = p.discount_percentage ? Number(p.discount_percentage) : 0;
    const hasDiscount = discountPct > 0 && p.discount_price != null;
    const displayPrice = hasDiscount ? formatPrice(p.discount_price) : formatPrice(p.price);

    const ratingAvg = p.rating_avg ?? (p.average_rating ? Number(p.average_rating) : 0);
    const soldCount = p.sold_count ?? 0;
    const ratingDisplay = typeof ratingAvg === "number" && ratingAvg > 0 ? ratingAvg.toFixed(1) : "0";

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
    const phone = p.store?.user?.phone_number || p.store?.phone || "";
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
                <div className="closed-time">Buka jam {oh}:00</div>
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
                <div className="jasa-card-desc" style={{ fontSize: '12px', color: '#666', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '8px' }}>{desc}</div>
                <div className="jasa-card-footer">
                    <div>
                        <div className="jasa-card-price" style={{ color: '#7B1FA2', fontWeight: 600, fontSize: '15px' }}>{displayPrice}</div>
                        <div className="jasa-card-meta" style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                            ⭐ {ratingDisplay} &nbsp;·&nbsp; {soldCount} dipesan
                        </div>
                    </div>
                    {isClosed ? (
                        <button
                            className="jasa-wa-btn disabled"
                            title="Toko sedang tutup"
                            onClick={(e) => e.preventDefault()}
                        >
                            {waIcon}
                        </button>
                    ) : (
                        <button
                            className="jasa-wa-btn"
                            title="Pesan via WhatsApp"
                            onClick={(e) => {
                                e.preventDefault();
                                logVisitor({ product_id: p.id as string });
                                const message = `Halo, saya ingin memesan layanan *${name}*`;
                                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
                            }}
                        >
                            {waIcon}
                        </button>
                    )}
                </div>
            </div>
        </Link>
    );
}
