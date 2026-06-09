"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAddToCart } from "@/features/cart/hooks";
import { useUser } from "@/features/auth/hooks";
import { ShoppingCart } from "lucide-react";

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
    className?: string;
}


export function CatCard(p: CatCardProps) {
    const isClosed = p.isClosed === true;
    const router = useRouter();
    const pathname = usePathname();
    const { data: user } = useUser();
    const { mutate: addToCart, isPending } = useAddToCart();
    const grayStyle = isClosed ? { filter: "grayscale(100%) brightness(0.72)" } : {};

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
