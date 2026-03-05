"use client"
import { useProducts } from "@/features/products/hooks";
import { ProductCard, SkeletonProductCard } from "@/components/shared/ProductCard";

export default function ProductSimilarProduct({ category_slug }: { category_slug: string }) {
    const { data, isLoading } = useProducts({
        per_page: 8,
        filter: category_slug ? { category__slug: category_slug } : undefined,
    });

    const products = data?.data || [];

    return (
        <div className="similar-section">
            {isLoading ? (
                <div className="product-grid">
                    {Array(6).fill(null).map((_, i) => (
                        <SkeletonProductCard key={i} />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Tidak ada produk serupa.</p>
            ) : (
                <div className="product-grid">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
