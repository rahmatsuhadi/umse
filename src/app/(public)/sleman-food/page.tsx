"use client";

import { useState } from "react";

import ContactSection from "@/components/landing/Contact";
import { Navbar } from "@/components/shared/Navbar";
import { useInfiniteProducts } from "@/features/products/hooks";
import { useDistricts } from "@/features/locations/hooks";
import { ProductCard } from "@/components/shared/ProductCard";

type StoreOpenShape = {
    is_open?: boolean | number | string;
    is_open_now?: boolean | number | string;
    open_now?: boolean | number | string;
    open?: boolean | number | string;
    status?: string | number | boolean;
    phone?: string;
    name?: string;
};

type ProductItem = {
    id: string | number;
    name: string;
    store?: StoreOpenShape | null;
    thumbnail?: { media_url?: string } | null;
    price?: { formatted?: string; amount?: string | number } | null;
    rating_avg?: number;
    sold_count?: number;
    discount?: number;
};

export default function SlemanFoodPage() {
    const [activeDistrict, setActiveDistrict] = useState("all");
    const [openNow, setOpenNow] = useState(true);
    const [sort, setSort] = useState("-rating_avg");

    const [priceMinInput, setPriceMinInput] = useState<string>("");
    const [priceMaxInput, setPriceMaxInput] = useState<string>("");
    const [searchInput, setSearchInput] = useState<string>("");
    const [searchKeyword, setSearchKeyword] = useState<string>("");

    // Static category states
    const [isFastFood, setIsFastFood] = useState(true);
    const [isFrozenFood, setIsFrozenFood] = useState(true);
    const [isRegularFood, setIsRegularFood] = useState(true);

    const handleReset = () => {
        setActiveDistrict("all");
        setOpenNow(true);
        setSort("-rating_avg");
        setPriceMinInput("");
        setPriceMaxInput("");
        setIsFastFood(true);
        setIsFrozenFood(true);
        setIsRegularFood(true);
        setSearchInput("");
        setSearchKeyword("");
    };

    // 1. Fetch Districts
    const { data: districtsData } = useDistricts("3404");
    const subdistricts = districtsData?.data || [];

    // 2. Static Categories (Removed dynamic fetch)

    // Construct filters
    const filters: Record<string, string | number | undefined> = {
        district_id: activeDistrict !== "all" ? activeDistrict : undefined,
        min_price: priceMinInput ? Number(priceMinInput) : undefined,
        max_price: priceMaxInput ? Number(priceMaxInput) : undefined,
        type: "product",
    };
    if (openNow) filters["is_open_store"] = 1;

    // Food type filter logic:
    // - All selected OR only "Kuliner Lainnya" selected → is_food=1 (broadest)
    // - Only Fast Food → is_ready_to_serve=1
    // - Only Frozen Food → is_frozen=1
    // - Fast Food + Frozen (no Kuliner) → is_food=1 (covers both, no extra narrowing)
    // - None selected → no food filter (show nothing food-specific)
    const anyFoodSelected = isFastFood || isFrozenFood || isRegularFood;
    if (anyFoodSelected) {
        if (isFastFood && !isFrozenFood && !isRegularFood) {
            // Only Fast Food selected
            filters["is_ready_to_serve"] = 1;
        } else if (!isFastFood && isFrozenFood && !isRegularFood) {
            // Only Frozen Food selected
            filters["is_frozen"] = 1;
        } else {
            // All selected, or multiple, or only Kuliner Lainnya → base is_food=1
            filters["is_food"] = 1;
        }
    }

    // 3. Fetch Products
    const {
        data: productsData,
        fetchNextPage,
        hasNextPage,
        isLoading
    } = useInfiniteProducts({
        per_page: 12,
        sort: sort,
        q: searchKeyword.trim() !== "" ? searchKeyword.trim() : undefined,
        filter: filters
    });

    const products = (productsData?.pages.flatMap(page => page.data) as unknown as ProductItem[]) || [];
    const totalProducts = productsData?.pages[0]?.meta?.total || products.length;

    const visibleProducts = products;

    return (
        <div className="pb-20 md:pb-0 explore-page" >
            <Navbar />
            <main className="page active" id="page-sleman-food">
                {/* Header */}
                <div className="explore-header" >
                    <div className="explore-header-inner">
                        <p className="explore-title" >Kuliner Khas Sleman</p>
                        <h1 className="explore-keyword" >Sleman Food</h1>
                        <p className="explore-desc" >Jelajahi berbagai hidangan siap saji, frozen food, dan kuliner UMKM terbaik dari seluruh penjuru Sleman.</p>

                        <div className="explore-search-bar" >
                            <input
                                type="text"
                                placeholder="Cari produk kuliner..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') setSearchKeyword(searchInput);
                                }}
                            />
                            <button onClick={() => setSearchKeyword(searchInput)}>Cari</button>
                        </div>

                        <div className="explore-stats" >
                            <span className="explore-stat" >
                                <strong>{totalProducts}</strong> Produk Kuliner
                            </span>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="explore-body">
                    <div className="explore-layout">
                        {/* Sidebar Filter */}
                        <aside>
                            <div className="filter-sidebar">
                                <div className="filter-panel">
                                    <div className="filter-header" >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                        </svg>
                                        Filter Kuliner
                                    </div>

                                    {/* Kecamatan */}
                                    <div className="filter-section" >
                                        <h4 className="filter-section-title">Kapanewon</h4>
                                        <select
                                            className="sort-select sort-select-full"
                                            value={activeDistrict}
                                            onChange={(e) => setActiveDistrict(e.target.value)}
                                        >
                                            <option value="all">Semua Kapanewon</option>
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {subdistricts.map((sub: any) => (
                                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Status Buka */}
                                    <div className="filter-section" >
                                        <h4 className="filter-section-title">Status Toko</h4>
                                        <div className="filter-option" >
                                            <label style={{ position: "relative", display: "inline-block", width: "34px", height: "20px", cursor: "pointer", flex: "none" }}>
                                                <input
                                                    type="checkbox"
                                                    checked={openNow}
                                                    onChange={(e) => setOpenNow(e.target.checked)}
                                                    style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
                                                />
                                                <span style={{ position: "absolute", inset: 0, borderRadius: "20px", transition: "0.2s", background: openNow ? "var(--forest)" : "var(--cream-dark)" }}></span>
                                                <span style={{ position: "absolute", width: "16px", height: "16px", borderRadius: "50%", background: "white", top: "2px", left: "2px", transition: "0.2s", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)", transform: openNow ? "translateX(14px)" : "translateX(0)" }}></span>
                                            </label>
                                            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                                                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: openNow ? '#27AE60' : '#ccc' }}></span> Buka Sekarang
                                            </span>
                                        </div>
                                    </div>

                                    {/* Jenis Makanan */}
                                    <div className="filter-section" >
                                        <h4 className="filter-section-title">Jenis Makanan</h4>
                                        <label className="filter-option" >
                                            <input
                                                type="checkbox"
                                                checked={isFastFood}
                                                onChange={(e) => setIsFastFood(e.target.checked)}
                                                className="filter-checkbox"
                                            />
                                            <span className="filter-label-text">
                                                🍔 Fast Food Lokal
                                            </span>
                                        </label>
                                        <label className="filter-option" >
                                            <input
                                                type="checkbox"
                                                checked={isFrozenFood}
                                                onChange={(e) => setIsFrozenFood(e.target.checked)}
                                                className="filter-checkbox"
                                            />
                                            <span className="filter-label-text">
                                                🧊 Frozen Food
                                            </span>
                                        </label>
                                        <label className="filter-option" >
                                            <input
                                                type="checkbox"
                                                checked={isRegularFood}
                                                onChange={(e) => setIsRegularFood(e.target.checked)}
                                                className="filter-checkbox"
                                            />
                                            <span className="filter-label-text">
                                                🍲 Kuliner Lainnya
                                            </span>
                                        </label>
                                    </div>

                                    {/* Harga */}
                                    <div className="filter-section" >
                                        <h4 className="filter-section-title">Harga</h4>
                                        <div className="price-range" >
                                            <div className="price-input-wrap" >
                                                <span className="price-input-label">Min</span>
                                                <input
                                                    className="price-input"
                                                    type="number"
                                                    placeholder="0"
                                                    value={priceMinInput}
                                                    onChange={(e) => setPriceMinInput(e.target.value)}

                                                />
                                            </div>
                                            <div className="price-input-wrap" >
                                                <span className="price-input-label">Maks</span>
                                                <input
                                                    className="price-input"
                                                    type="number"
                                                    placeholder="Maks"
                                                    value={priceMaxInput}
                                                    onChange={(e) => setPriceMaxInput(e.target.value)}

                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reset */}
                                    <div style={{ padding: "16px" }}>
                                        <button
                                            onClick={handleReset}
                                            className="btn-reset-filter">Reset Filter
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Main Grid */}
                        <div className="explore-main-content">
                            <div className="sort-bar" >
                                <label className="sort-label">Urutkan:</label>
                                <select
                                    className="sort-select"

                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                >
                                    <option value="-rating_avg">Rating Tertinggi</option>
                                    <option value="price">Harga Terendah</option>
                                    <option value="-price">Harga Tertinggi</option>
                                    <option value="-sold_count">Terlaris</option>
                                </select>
                                <span className="result-count" >
                                    {isLoading ? "Memuat..." : `${totalProducts} hasil ditemukan`}
                                </span>
                            </div>

                            <div className="product-grid-lg" >
                                {visibleProducts.length > 0 ? visibleProducts.map((product: ProductItem) => (
                                    <ProductCard key={product.id} product={product} />
                                )) : (
                                    <div className="col-span-full py-40 text-center" >
                                        <p className="text-muted" >{isLoading ? 'Memuat produk...' : 'Tidak ada produk ditemukan'}</p>
                                    </div>
                                )}
                            </div>

                            {hasNextPage && (
                                <div style={{ textAlign: "center", marginTop: "40px" }}>
                                    <button
                                        onClick={() => fetchNextPage()}
                                        disabled={isLoading}
                                        className="btn-load-more"
                                    >
                                        {isLoading ? 'Memuat...' : 'Lihat Lebih Banyak'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <ContactSection />
        </div>
    );
}
