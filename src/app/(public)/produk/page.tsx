"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import Image from "next/image";
import { useInfiniteProducts } from "@/features/products/hooks";
import { useCategories } from "@/features/categories/hooks";
import { useCreateVisitorLog } from "@/features/visitor-logs/hooks";
import ContactSection from "@/components/landing/Contact";
import { SlemanFoodSections } from "@/components/home/SlemanFoodSections";

const WA_SVG = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

export default function ProductsPage() {
    const [activeTab, setActiveTab] = useState("popular");
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [sortBy, setSortBy] = useState("Terpopuler");

    const { data: categoriesData } = useCategories();
    const categories = categoriesData?.data || [];

    const { mutate: logVisitor } = useCreateVisitorLog();

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

    const handleWhatsAppClick = (product: any) => {
        logVisitor({ product_id: product.id });
        const phone = product.store?.user?.phone_number || product.store?.phone || '';
        const message = `Halo, saya tertarik dengan produk ${product.name}`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
    }

    return (
        <div className="bg-cream">
            {/* Hero */}
            <div className="products-hero">
                <div className="products-hero-inner">
                    <h1>🛍️ Katalog <span className="text-white-85">Produk</span></h1>
                    <p>Temukan ribuan produk asli buatan UMKM Sleman</p>
                    <div className="products-tabs">
                        <button className={`products-tab ${activeTab === 'popular' ? 'active' : ''}`} onClick={() => setActiveTab('popular')}>🔥 Terpopuler</button>
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
                    <div className="flex-center-wrap gap-8">
                        <div className="products-toolbar-left flex-wrap">
                            <span className="text-muted fw-600 font-13">Kategori:</span>
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
                        <div className="flex-center gap-8">
                            <select
                                className="sort-select font-13"
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
                            className="product-card-lg cursor-pointer"
                            onClick={() => window.location.href = `/produk/${product.id}`}
                        >
                            <div className="product-img-lg">
                                {product.thumbnail?.media_url ? (
                                    <Image src={product.thumbnail.media_url} alt={product.name} fill className="object-cover" />
                                ) : <div className="font-40">🎁</div>}
                                {product.discount && <div className="promo-tag">-{product.discount}%</div>}
                            </div>
                            <div className="product-body-lg">
                                <div className="product-name-lg">{product.name}</div>
                                <div className="product-shop-lg product-shop-info">
                                    <span>🏪</span> {product.store?.name || 'Toko UMKM'}
                                </div>
                            </div>
                            <div className="product-actions-lg">
                                <div className="price-col">
                                    <div className="price-row">
                                        <div className="price-main price-main-lg">
                                            {product.price?.formatted?.split(",")[0] || `Rp ${(product.price?.amount || 0).toLocaleString('id-ID')}`}
                                        </div>
                                    </div>
                                    <div className="sold-row sold-row-sm">
                                        <span className="star-icon">★</span>
                                        <span className="rating-text">{product.rating_avg || '5.0'}</span>
                                        <span>·</span>
                                        <span>({product.sold_count || 0})</span>
                                    </div>
                                </div>
                                <button
                                    title="Pesan via WhatsApp"
                                    className="btn-wa-compact"
                                    onClick={(e) => { e.stopPropagation(); handleWhatsAppClick(product); }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={WA_SVG} /></svg>
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="empty-state-msg">
                            {isLoading ? 'Memuat produk...' : 'Tidak ada produk ditemukan'}
                        </div>
                    )}
                </div>

                {hasNextPage && (
                    <div className="mt-40 text-center">
                        <button
                            className="toolbar-chip btn-load-more"
                            onClick={() => fetchNextPage()}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Memuat...' : 'Lihat Lebih Banyak'}
                        </button>
                    </div>
                )}

                <div className="pb-60"></div>

                {/* ── SPECIAL: SIAP SAJI & FROZEN FOOD ── */}
                <SlemanFoodSections />
            </div>


            <ContactSection />
        </div>
    );
}
