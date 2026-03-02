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

// Helper function to format prices
const formatPrice = (price: any): string => {
    if (!price) return "Rp 0";
    if (typeof price === "number") return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
    if (typeof price === "object" && "formatted" in price) return price.formatted as string;
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(price));
};

const getIsStoreOpen = (product: unknown): boolean | null => {
    const p = product as Record<string, unknown>;
    const s = (p?.store ?? null) as Record<string, unknown> | null;
    if (!s) return null;
    // API returns store.is_open as a direct boolean
    if (typeof s["is_open"] === "boolean") return s["is_open"] as boolean;
    if (typeof s["is_open"] === "number") return (s["is_open"] as number) === 1;
    return null;
};

interface SpecialSectionProps {
    icon: string;
    iconBg: string;
    label: string;
    labelColor: string;
    title: string;
    sub: string;
    categoryFilter: Record<string, any>;
    urlParamValue: string;
}

const SpecialSection = ({ icon, iconBg, label, labelColor, title, sub, categoryFilter, urlParamValue }: SpecialSectionProps) => {
    const { data, isLoading } = useInfiniteProducts({
        per_page: 8,
        sort: "-rating_avg",
        filter: categoryFilter
    });

    const products = data?.pages.flatMap((p) => p.data).slice(0, 8) ?? [];

    // Calculate dynamic stats using store.is_open directly
    const totalStores = new Set(products.map(p => (p as any).store?.id)).size || 1;
    const openStores = new Set(products.filter(p => (p as any).store?.is_open === true).map(p => (p as any).store?.id)).size || 0;

    return (
        <section className="section" style={{ paddingTop: 0, paddingBottom: 48, background: "white" }}>
            <div className="container">
                <div className="catalog-special">
                    <div className="catalog-special-header">
                        <div className="catalog-special-icon-wrap" style={{ background: iconBg }}>{icon}</div>
                        <div>
                            <div className="catalog-special-label" style={{ color: labelColor }}>{label}</div>
                            <div className="catalog-special-title" style={{ fontSize: "22px" }}>{title}</div>
                            <div className="catalog-special-sub">{sub}</div>
                        </div>
                        <div className="catalog-special-right">
                            <div className="time-indicator">
                                {/* Dynamic Status Text */}
                                {openStores === 0 && products.length > 0 ? (
                                    <>
                                        <span className="time-dot" style={{ background: '#999', animation: 'none' }}></span>
                                        <span>Semua toko tutup</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="time-dot" style={{ animation: "pulseGreen 2s infinite" }}></span>
                                        <span>{openStores > 0 && products.length > 0 ? `${openStores} dari ${totalStores} toko buka` : 'Tersedia Hari Ini'}</span>
                                    </>
                                )}
                            </div>
                            <Link href={`/sleman-food?category=${urlParamValue}`} className="catalog-see-all" style={{ textDecoration: "none" }}>
                                Lihat Semua →
                            </Link>
                        </div>
                    </div>

                    <div className="catalog-hscroll">
                        {isLoading ? (
                            Array(6).fill(null).map((_, i) => <SkeletonCard key={i} />)
                        ) : products.length > 0 ? (
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
                                        isNew={false}
                                        openHour={openHour}
                                        closeHour={closeHour}
                                        hourPill={hourPill}
                                    />
                                );
                            })
                        ) : (
                            <div style={{ padding: "24px", color: "var(--text-muted)", fontSize: "14px", width: "100%", textAlign: "center" }}>
                                Belum ada produk tersedia.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export function SlemanFoodSectionsHome() {
    return (
        <div>
            <SpecialSection
                icon="🍔"
                iconBg="#FFF3E0"
                label="Fast Food Lokal"
                labelColor="#e65100"
                title="Siap Saji dari UMKM"
                sub="Pesan sekarang, tersedia sesuai jam buka toko"
                categoryFilter={{ is_ready_to_serve: 1 }}
                urlParamValue="fast-food"
            />

            <SpecialSection
                icon="🧊"
                iconBg="#E3F2FD"
                label="Frozen Food"
                labelColor="#1565c0"
                title="Homemade, Siap Masak"
                sub="Produk beku segar dari dapur lokal Sleman"
                categoryFilter={{ is_frozen: 1 }}
                urlParamValue="frozen-food"
            />
        </div>
    );
}
