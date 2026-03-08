"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useInfiniteProducts } from "@/features/products/hooks";
import Link from "next/link";
import { ServiceCard, SkeletonServiceCard } from "@/components/shared/ServiceCard";

interface TopServiceProps {
    districtId?: string | number;
}

export function TopService({ districtId }: TopServiceProps = {}) {
    const filter: any = { type: 'service' };
    if (districtId) {
        filter.district_id = districtId;
    }

    const { data, isLoading } = useInfiniteProducts({ filter, per_page: 8, sort: "-sold_count" });
    const products = data?.pages.flatMap((p) => p.data).slice(0, 8) ?? [];

    if (!isLoading && products.length === 0) return null;

    return (
        <div style={{ marginBottom: 32 }}>
            <div className="section-header" style={{ marginBottom: 20 }}>
                <div>
                    <h2 className="section-title">Jasa <span>Viral</span></h2>
                    <p className="section-subtitle">Paling banyak dilihat minggu ini</p>
                </div>
                <Link href="/sleman-jasa" className="see-all-link">Semua →</Link>
            </div>

            <div className="catalog-hscroll" style={{ gap: '16px' }}>
                {isLoading ? (
                    Array(6).fill(null).map((_, i) => <SkeletonServiceCard key={i} className="cat-card-scroll" />)
                ) : (
                    products.map((product) => (
                        <ServiceCard key={(product as any).id} product={product} className="cat-card-scroll" />
                    ))
                )}
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

export default TopService;
