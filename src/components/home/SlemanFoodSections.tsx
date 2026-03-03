"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useInfiniteProducts } from "@/features/products/hooks";
import Link from "next/link";
import { ProductCard, SkeletonProductCard } from "@/components/shared/ProductCard";

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
        <section className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
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

                <div className="catalog-hscroll" style={{ gap: '16px' }}>
                    {isLoading ? (
                        Array(6).fill(null).map((_, i) => <SkeletonProductCard key={i} />)
                    ) : products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard key={(product as any).id} product={product} />
                        ))
                    ) : (
                        <div style={{ padding: "24px", color: "var(--text-muted)", fontSize: "14px", width: "100%", textAlign: "center" }}>
                            Belum ada produk tersedia.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export function SlemanFoodSections() {
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
