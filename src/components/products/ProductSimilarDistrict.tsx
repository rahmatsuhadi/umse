"use client"
import { useProducts } from "@/features/products/hooks";
import { ProductCard, SkeletonProductCard } from "@/components/shared/ProductCard";

export default function ProductSimilarDistrict({ district_id }: { district_id: number }) {
    const { data, isLoading } = useProducts({
        per_page: 8,
        filter: district_id ? { store__district__id: district_id } : undefined,
    });

    const products = data?.data || [];

    return (
        <div className="similar-section" style={{ padding: '0 0 60px' }}>
            {isLoading ? (
                <div className="similar-scroll">
                    {Array(6).fill(null).map((_, i) => (
                        <SkeletonProductCard key={i} />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Tidak ada produk di Kapanewon yang sama.</p>
            ) : (
                <div className="similar-scroll">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
