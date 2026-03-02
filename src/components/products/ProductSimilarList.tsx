"use client"
import { useProducts } from "@/features/products/hooks";
import Link from "next/link";
import Image from "next/image";
import SkeletonProductCard from "./ProductSkeletonCard";

export default function ProductSimilarProduct({ category_slug }: { category_slug: string }) {
    const { data, isLoading } = useProducts({
        per_page: 8,
        filter: category_slug ? { category__slug: category_slug } : undefined,
    });

    const products = data?.data || [];

    return (
        <div className="similar-section" style={{ padding: '0 0 60px' }}>
            {isLoading ? (
                <div className="similar-scroll">
                    {Array(6).fill(null).map((_, i) => (
                        <div key={i} className="similar-card">
                            <SkeletonProductCard />
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Tidak ada produk serupa.</p>
            ) : (
                <div className="similar-scroll">
                    {products.map((product) => {
                        const imageSrc =
                            product.thumbnail?.media_url ||
                            product.media?.[0]?.media_url ||
                            "/assets/no-image.jpg";

                        return (
                            <Link key={product.id} href={"/produk/" + product.id} style={{ textDecoration: 'none' }}>
                                <div className="similar-card">
                                    <div className="similar-img" style={{ overflow: 'hidden', padding: 0 }}>
                                        <Image
                                            src={imageSrc}
                                            alt={product.name}
                                            width={180}
                                            height={160}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                                        />
                                    </div>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', lineHeight: 1.4 }}>
                                        {product.name}
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--terracotta)', marginBottom: '4px' }}>
                                        {product.price.formatted.split(",")[0]}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
