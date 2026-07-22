"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useInfiniteProducts } from "@/features/products/hooks";
import { useCategories } from "@/features/categories/hooks";
import ContactSection from "@/components/landing/Contact";
import { SlemanFoodSections } from "@/components/home/SlemanFoodSections";
import { useAddToCart } from "@/features/cart/hooks";
import { useUser } from "@/features/auth/hooks";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

function ProductsContent() {
    const searchParams = useSearchParams();
    const categoryQuery = searchParams.get("category");
    const tabQuery = searchParams.get("tab");

    const [activeTab, setActiveTab] = useState(tabQuery || "popular");
    const [activeCategory, setActiveCategory] = useState(categoryQuery || "Semua");
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [sortBy, setSortBy] = useState("Terpopuler");

    useEffect(() => {
        if (categoryQuery) {
            setActiveCategory(categoryQuery);
        } else {
            setActiveCategory("Semua");
        }
    }, [categoryQuery]);

    useEffect(() => {
        if (tabQuery) {
            setActiveTab(tabQuery);
        }
    }, [tabQuery]);

    const { data: categoriesData } = useCategories();
    const categories = categoriesData?.data || [];

    const getSortValue = () => {
        if (sortBy === "Harga ↑") return "price";
        if (sortBy === "Harga ↓") return "-price";
        if (sortBy === "Rating") return "-rating_avg";

        switch (activeTab) {
            case "popular": return "-rating_avg";
            case "mostbought": return "-sold_count";
            case "toprated": return "-rating_avg";
            case "newest": return "-created_at";
            default: return undefined;
        }
    };

    const {
        data: productsData,
        fetchNextPage,
        hasNextPage,
        isLoading
    } = useInfiniteProducts({
        per_page: 12,
        sort: getSortValue(),
        filter: {
            category__slug: activeCategory !== "Semua" ? activeCategory : undefined,
        }
    });

    const products = productsData?.pages.flatMap(page => page.data) || [];
    const totalCount = productsData?.pages[0]?.meta?.total ?? products.length;

    const { data: user } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const { mutate: addToCart, isPending } = useAddToCart();

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            router.push(`/masuk?redirect=${pathname}`);
            return;
        }
        addToCart({
            product_id: String(product.id),
            quantity: 1,
        });
    };

    return (
        <div style={{ background: "var(--cream)" }}>
            {/* Hero */}
            <div className="products-hero">
                <div className="products-hero-inner">
                    <h1>🛍️ Katalog <span style={{ color: "rgba(255,255,255,0.85)" }}>Produk</span></h1>
                    <p>Temukan ribuan produk asli buatan UMKM Sleman</p>
                    <div className="products-tabs">
                        <button className={`products-tab ${activeTab === 'popular' ? 'active' : ''}`} onClick={() => setActiveTab('popular')}>🔥 Terpopuler</button>
                        <button className={`products-tab ${activeTab === 'mostbought' ? 'active' : ''}`} onClick={() => setActiveTab('mostbought')}>🛒 Terlaris</button>
                        <button className={`products-tab ${activeTab === 'toprated' ? 'active' : ''}`} onClick={() => setActiveTab('toprated')}>⭐ Rating Terbaik</button>
                        <button className={`products-tab ${activeTab === 'newest' ? 'active' : ''}`} onClick={() => setActiveTab('newest')}>✨ Terbaru</button>
                        <button className={`products-tab ${activeTab === 'promo' ? 'active' : ''}`} onClick={() => setActiveTab('promo')}>🏷️ Promo</button>
                    </div>
                </div>
            </div>

            <div className="products-body">
                {/* ── CATALOG MAIN HEADER ── */}
                <div className="catalog-main-header">
                    <div>
                        <div className="catalog-main-title">Semua Produk</div>
                        {totalCount > 0 && (
                            <div className="catalog-count">{totalCount} produk ditemukan</div>
                        )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <div className="products-toolbar-left" style={{ flexWrap: "wrap" }}>
                            <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>Kategori:</span>
                            <button
                                className={`toolbar-chip ${activeCategory === 'Semua' ? 'active' : ''}`}
                                onClick={() => setActiveCategory('Semua')}
                            >
                                Semua
                            </button>
                            {categories.map((cat: any) => (
                                <button
                                    key={cat.id}
                                    className={`toolbar-chip ${activeCategory === cat.slug ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(cat.slug)}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <select
                                className="sort-select"
                                style={{ fontSize: "13px" }}
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option>Terpopuler</option>
                                <option>Harga ↑</option>
                                <option>Harga ↓</option>
                                <option>Rating</option>
                            </select>
                            <div className="view-toggle">
                                <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>⊞</button>
                                <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>☰</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── PRODUCT GRID ── */}
                <div className={`product-grid-lg ${viewMode === 'list' ? 'list-view' : ''}`} id="productsGrid">
                    {products.length > 0 ? products.map((product: any) => (
                        <div
                            key={product.id}
                            className="product-card-lg"
                            onClick={() => window.location.href = `/produk/${product.id}`}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="product-img-lg">
                                {product.thumbnail?.media_url ? (
                                    <Image src={product.thumbnail.media_url} alt={product.name} fill style={{ objectFit: 'cover' }} />
                                ) : <div style={{ fontSize: '40px' }}>🎁</div>}
                                {product.discount && <div className="promo-tag">-{product.discount}%</div>}
                            </div>
                            <div className="product-body-lg">
                                <div className="product-name-lg">{product.name}</div>
                                <div className="product-shop-lg" style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                                    <span>🏪</span> {product.store?.name || 'Toko UMKM'}
                                </div>
                            </div>
                            <div className="product-actions-lg">
                                <div className="price-col">
                                    <div className="price-row">
                                        <div className="price-main" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--terracotta)' }}>
                                            {product.price?.formatted?.split(",")[0] || `Rp ${(product.price?.amount || 0).toLocaleString('id-ID')}`}
                                        </div>
                                    </div>
                                    <div className="sold-row" style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                        <span style={{ color: "#F1C40F", fontSize: "12px" }}>★</span>
                                        <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{product.rating_avg || '5.0'}</span>
                                        <span>·</span>
                                        <span>({product.sold_count || 0})</span>
                                    </div>
                                </div>
                                {(() => {
                                    const isClosed = product.store?.is_open === false || product.store?.is_emergency_close === true;
                                    const hasNoQris = !product.store?.qris_url;
                                    return isClosed || hasNoQris ? (
                                        <span
                                            title={isClosed ? "Toko sedang tutup" : "Penjual belum mengupload QRIS"}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                toast.error("Gagal menambahkan ke keranjang", {
                                                    description: isClosed ? "Toko sedang tutup" : "Penjual belum mengupload QRIS",
                                                });
                                            }}
                                            style={{ display: "inline-flex" }}
                                        >
                                            <button
                                                className="cat-card-cart disabled"
                                                style={{ pointerEvents: "none" }}
                                            >
                                                <ShoppingCart size={16} />
                                            </button>
                                        </span>
                                    ) : (
                                        <button
                                            title="Tambahkan ke Keranjang"
                                            className="cat-card-cart"
                                            disabled={isPending}
                                            onClick={(e) => handleAddToCart(e, product)}
                                        >
                                            <ShoppingCart size={16} />
                                        </button>
                                    );
                                })()}
                            </div>
                        </div>
                    )) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                            {isLoading ? 'Memuat produk...' : 'Tidak ada produk ditemukan'}
                        </div>
                    )}
                </div>

                {hasNextPage && (
                    <div style={{ textAlign: "center", marginTop: "40px" }}>
                        <button
                            className="toolbar-chip"
                            style={{ padding: '12px 32px', fontWeight: 700, background: 'white' }}
                            onClick={() => fetchNextPage()}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Memuat...' : 'Lihat Lebih Banyak'}
                        </button>
                    </div>
                )}

                <div style={{ paddingBottom: "60px" }}></div>

                {/* ── SPECIAL: SIAP SAJI & FROZEN FOOD ── */}
                <SlemanFoodSections />
            </div>


            <ContactSection />
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Memuat katalog produk...</div>}>
            <ProductsContent />
        </Suspense>
    );
}
