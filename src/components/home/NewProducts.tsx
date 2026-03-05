"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useInfiniteProducts } from "@/features/products/hooks";
import Link from "next/link";
import { ProductCard, SkeletonProductCard } from "@/components/shared/ProductCard";

export function NewProducts() {
    // Hitung tanggal 8 hari yang lalu dalam format YYYY-MM-DD
    const today = new Date();
    const eightDaysAgo = new Date();
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
    const startDate = eightDaysAgo.toISOString().split("T")[0];
    const endDate = today.toISOString().split("T")[0];

    const { data, isLoading } = useInfiniteProducts({
        per_page: 8,
        sort: "-created_at",
        filter: {
            start_date: startDate,
            end_date: endDate,
        },
    });

    const products = data?.pages.flatMap((p) => p.data).slice(0, 8) ?? [];

    // Jika tidak loading dan tidak ada produk, jangan tampilkan section
    if (!isLoading && products.length === 0) return null;

    return (
        <section className="section" style={{ background: "white", paddingTop: 48, paddingBottom: 48 }}>
            <div className="container">
                <div className="section-header" style={{ marginBottom: 20 }}>
                    <div>
                        <h2 className="section-title">Produk <span>Terbaru</span></h2>
                        <p className="section-subtitle">Produk baru yang baru saja bergabung</p>
                    </div>
                    <Link href="/produk?sort=-created_at" className="see-all-link">Semua →</Link>
                </div>

                <div className="catalog-hscroll" style={{ gap: '16px' }}>
                    {isLoading ? (
                        Array(6).fill(null).map((_, i) => <SkeletonProductCard key={i} className="cat-card-scroll" />)
                    ) : (
                        products.map((product) => (
                            <ProductCard key={(product as any).id} product={product} isNew={true} className="cat-card-scroll" />
                        ))
                    )}
                </div>
            </div>
            <style>{`
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: .5; }
            }
            `}</style>
        </section>
    );
}
