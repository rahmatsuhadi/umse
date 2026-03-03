"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useInfiniteProducts } from "@/features/products/hooks";
import Link from "next/link";
import { CatCard } from "@/components/shared/CatCard";

const SkeletonCard = () => (
    <div className="product-card-mini" style={{ opacity: 0.7, pointerEvents: "none" }}>
        <div className="product-card-mini-img" style={{ background: "#F5E9E2", animation: "pulse 1.5s infinite" }} />
        <div className="product-card-mini-body">
            <div className="product-card-mini-name" style={{ height: 14, width: "80%", background: "#F5E9E2", marginBottom: 6, borderRadius: 4 }} />
            <div className="product-card-mini-price" style={{ height: 16, width: "60%", background: "#F5E9E2", marginBottom: 6, borderRadius: 4 }} />
            <div className="product-card-mini-shop" style={{ height: 12, width: "50%", background: "#F5E9E2", borderRadius: 4 }} />
        </div>
    </div>
);

const formatPrice = (price: any): string => {
    if (!price) return "Rp 0";
    if (typeof price === "number") return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
    if (typeof price === "object" && "formatted" in price) return price.formatted as string;
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(price));
};

export function TopProducts() {
    const { data, isLoading } = useInfiniteProducts({ per_page: 8, sort: "-sold_count" });
    const products = data?.pages.flatMap((p) => p.data).slice(0, 8) ?? [];

    const isNew = (createdAt?: string | null) => {
        if (!createdAt) return false;
        const created = new Date(createdAt).getTime();
        const days = (Date.now() - created) / (1000 * 60 * 60 * 24);
        return days <= 14;
    };

    return (
        <div style={{ marginBottom: 32 }}>
            <div className="section-header" style={{ marginBottom: 20 }}>
                <div>
                    <h2 className="section-title">Produk <span>Viral</span></h2>
                    <p className="section-subtitle">Paling banyak dilihat minggu ini</p>
                </div>
                <Link href="/produk" className="see-all-link">Semua →</Link>
            </div>

            <div className="top-card-scroll">
                <div className="top-card-list">
                    {isLoading ? (
                        Array(6).fill(null).map((_, i) => <SkeletonCard key={i} />)
                    ) : (
                        products.map((product) => {
                            const p = product as any;

                            // Use store.is_open directly from API (boolean)
                            const isClosed = p.store?.is_open === false;

                            // Discount: discount_price is the sale price, price is original
                            const discountPct = p.discount_percentage ? Number(p.discount_percentage) : 0;
                            const hasDiscount = discountPct > 0 && p.discount_price != null;
                            const displayPrice = hasDiscount ? formatPrice(p.discount_price) : formatPrice(p.price);
                            const priceOld = hasDiscount ? formatPrice(p.price) : undefined;
                            const discountStr = hasDiscount ? `-${Math.round(discountPct)}%` : null;

                            const ratingAvg = p.rating_avg ?? (p.average_rating ? Number(p.average_rating) : 0);
                            const soldCount = p.sold_count ?? 0;
                            const ratingDisplay = typeof ratingAvg === "number" && ratingAvg > 0 ? ratingAvg.toFixed(1) : "0";

                            // Store hours from operational_hours if open_hour not directly available
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

                            return (
                                <CatCard
                                    key={p.id}
                                    id={p.id}
                                    name={p.name}
                                    shop={p.store?.name || "UMKM Sleman"}
                                    price={displayPrice}
                                    priceOld={priceOld}
                                    rating={ratingDisplay}
                                    sold={soldCount}
                                    img={p.media?.[0]?.media_url || p.thumbnail?.media_url || ""}
                                    isClosed={isClosed}
                                    badge={null}
                                    promo={discountStr}
                                    isNew={isNew(p.created_at)}
                                    openHour={openHour}
                                    closeHour={closeHour}
                                    hourPill={hourPill}
                                />
                            );
                        })
                    )}
                </div>
            </div>
            <style>{`
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: .5; }
            }
            `}</style>
        </div>
    );
}
