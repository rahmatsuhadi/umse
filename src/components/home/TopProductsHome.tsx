"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useInfiniteProducts } from "@/features/products/hooks";
import Link from "next/link";
import { ProductCard, SkeletonProductCard } from "@/components/shared/ProductCard";

export function TopProductsHome() {
    const { data, isLoading } = useInfiniteProducts({ per_page: 8, sort: "-sold_count" });
    const products = data?.pages.flatMap((p) => p.data).slice(0, 8) ?? [];

    return (
        <section className="section" style={{ background: "white", paddingTop: 48, paddingBottom: 48 }}>
            <div className="container">
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
                            Array(6).fill(null).map((_, i) => <SkeletonProductCard key={i} />)
                        ) : (
                            products.map((product) => (
                                <ProductCard key={(product as any).id} product={product} />
                            ))
                        )}
                    </div>
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
