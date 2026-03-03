"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";

import { useInfiniteProducts } from "@/features/products/hooks";
import { useCategories } from "@/features/categories/hooks";
import ContactSection from "@/components/landing/Contact";
import { SlemanFoodSections } from "@/components/home/SlemanFoodSections";
import { ProductCard } from "@/components/shared/ProductCard";

export default function ProductsPage() {
    const [activeTab, setActiveTab] = useState("popular");
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [sortBy, setSortBy] = useState("Terpopuler");

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
                <div className={`product-grid-lg ${viewMode === 'list' ? 'list-view' : ''}`} id="productsGrid" style={{ gap: '16px' }}>
                    {products.length > 0 ? products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
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
