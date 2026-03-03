"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCreateVisitorLog } from "@/features/visitor-logs/hooks";

export interface CatCardProps {
    id: number | string;
    name: string;
    shop: string;
    price: string;
    priceOld?: string;
    rating: string | number;
    sold: number;
    img: string;
    isClosed?: boolean;
    badge?: "Terlaris" | "Unggulan" | null;
    promo?: string | null;
    isNew?: boolean;
    openHour?: number;
    closeHour?: number;
    category?: string;
    hourPill?: { state: 'open' | 'closing-soon' | 'closed'; text: string; pillClass: string } | null;
    phone?: string;
}

const waIcon = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

export function CatCard(p: CatCardProps) {
    const isClosed = p.isClosed === true;
    const { mutate: logVisitor } = useCreateVisitorLog();
    const grayStyle = isClosed ? { filter: "grayscale(100%) brightness(0.72)" } : {};

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
                <div className="closed-time">Buka jam {oh}:00</div>
            </div>
        );
    }

    const [imgError, setImgError] = useState(false);
    const initial = p.name.trim().charAt(0) || "?";

    return (
        <Link href={`/produk/${p.id}`} className={`cat-card${isClosed ? ' is-closed' : ''}`} style={{ display: 'block', textDecoration: 'none' }}>
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
                        <div className="cat-card-rating">★ {p.rating} · {p.sold} terjual</div>
                    </div>
                    {isClosed ? (
                        <button
                            className="cat-card-wa disabled"
                            title="Toko sedang tutup"
                            onClick={(e) => e.preventDefault()}
                        >
                            {waIcon}
                        </button>
                    ) : (
                        <button
                            className="cat-card-wa"
                            title="Pesan via WhatsApp"
                            onClick={(e) => {
                                e.preventDefault();
                                logVisitor({ product_id: p.id as string });
                                const phone = p.phone || '';
                                const message = `Halo, saya tertarik dengan produk ${p.name}`;
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
