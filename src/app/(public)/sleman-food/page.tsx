"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ContactSection from "@/components/landing/Contact";
import { Navbar } from "@/components/shared/Navbar";
import { useInfiniteProducts } from "@/features/products/hooks";
import { useDistricts } from "@/features/locations/hooks";
import { useCreateVisitorLog } from "@/features/visitor-logs/hooks";

const WA_SVG = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

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

    const { mutate: logVisitor } = useCreateVisitorLog();

    const handleWhatsAppClick = (product: ProductItem) => {
        logVisitor({ product_id: product.id as string });
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const phone = (product.store as any)?.user?.phone_number || (product.store as StoreOpenShape | undefined)?.phone || '';
        const message = `Halo, saya tertarik dengan produk ${product.name}`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
    };

    const getIsStoreOpen = (product: ProductItem): boolean | null => {
        const s = (product?.store ?? {}) as StoreOpenShape;
        const raw = s.is_open ?? s.is_open_now ?? s.open_now ?? s.open ?? s.status ?? null;
        if (typeof raw === "boolean") return raw;
        if (typeof raw === "number") return raw === 1;
        if (typeof raw === "string") {
            const v = raw.toLowerCase();
            if (v === "1" || v === "true" || v === "open" || v === "buka") return true;
            if (v === "0" || v === "false" || v === "closed" || v === "tutup") return false;
        }
        return null;
    };

    const visibleProducts = products;

    return (
        <div className="pb-20 md:pb-0 explore-page" style={{ background: "var(--cream)", minHeight: "100vh" }}>
            <Navbar />
            <main className="page active" id="page-sleman-food">
                {/* Header */}
                <div className="explore-header" style={{ background: "linear-gradient(135deg, #FF9800 0%, #E65100 100%)", paddingTop: '80px', paddingBottom: '32px' }}>
                    <div className="explore-header-inner">
                        <p className="explore-title" style={{ color: "rgba(255,255,255,0.8)" }}>Kuliner Khas Sleman</p>
                        <h1 className="explore-keyword" style={{ color: "white", border: "none", marginBottom: "10px" }}>Sleman Food</h1>
                        <p className="explore-desc">Jelajahi berbagai hidangan siap saji, frozen food, dan kuliner UMKM terbaik dari seluruh penjuru Sleman.</p>

                        <div className="explore-search-bar" style={{ marginTop: "24px" }}>
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

                        <div className="explore-stats" style={{ marginTop: "24px" }}>
                            <span className="explore-stat" style={{ background: "rgba(255,255,255,0.2)", color: "white", padding: "6px 14px", borderRadius: "20px" }}>
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
                                    <div className="filter-header" style={{ background: "#E65100", color: "white", padding: "12px 16px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                        </svg>
                                        Filter Kuliner
                                    </div>

                                    {/* Kecamatan */}
                                    <div className="filter-section" style={{ padding: "12px 16px", borderBottom: "1.5px solid var(--cream-dark)" }}>
                                        <h4 style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>Kapanewon</h4>
                                        <select
                                            className="sort-select"
                                            style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid var(--cream-dark)", fontSize: "13px" }}
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
                                    <div className="filter-section" style={{ padding: "12px 16px", borderBottom: "1.5px solid var(--cream-dark)" }}>
                                        <h4 style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>Status Toko</h4>
                                        <div className="filter-option" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <label className="explore-toggle-wrap" style={{ position: "relative", display: "inline-block", width: "34px", height: "18px", cursor: "pointer" }}>
                                                <input
                                                    type="checkbox"
                                                    style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
                                                    checked={openNow}
                                                    onChange={(e) => setOpenNow(e.target.checked)}
                                                />
                                                <span className="explore-toggle-slider" style={{
                                                    position: "absolute", inset: 0, borderRadius: "20px", transition: "0.2s",
                                                    background: openNow ? "var(--forest)" : "var(--cream-dark)"
                                                }}>
                                                    <span style={{
                                                        content: '""', position: "absolute", width: "12px", height: "12px", borderRadius: "50%",
                                                        background: "white", top: "3px", left: "3px", transition: "0.2s",
                                                        transform: openNow ? "translateX(16px)" : "translateX(0)", boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                                                    }} />
                                                </span>
                                            </label>
                                            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>Buka Sekarang</span>
                                        </div>
                                    </div>

                                    {/* Jenis Makanan */}
                                    <div className="filter-section" style={{ padding: "12px 16px", borderBottom: "1.5px solid var(--cream-dark)" }}>
                                        <h4 style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>Jenis Makanan</h4>
                                        <label className="filter-option" style={{ display: "flex", alignItems: "center", gap: "8px", margin: "6px 0", cursor: "pointer" }}>
                                            <input
                                                type="checkbox"
                                                checked={isFastFood}
                                                onChange={(e) => setIsFastFood(e.target.checked)}
                                                style={{ width: "16px", height: "16px", cursor: "pointer" }}
                                            />
                                            <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>
                                                🍔 Fast Food Lokal
                                            </span>
                                        </label>
                                        <label className="filter-option" style={{ display: "flex", alignItems: "center", gap: "8px", margin: "6px 0", cursor: "pointer" }}>
                                            <input
                                                type="checkbox"
                                                checked={isFrozenFood}
                                                onChange={(e) => setIsFrozenFood(e.target.checked)}
                                                style={{ width: "16px", height: "16px", cursor: "pointer" }}
                                            />
                                            <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>
                                                🧊 Frozen Food
                                            </span>
                                        </label>
                                        <label className="filter-option" style={{ display: "flex", alignItems: "center", gap: "8px", margin: "6px 0", cursor: "pointer" }}>
                                            <input
                                                type="checkbox"
                                                checked={isRegularFood}
                                                onChange={(e) => setIsRegularFood(e.target.checked)}
                                                style={{ width: "16px", height: "16px", cursor: "pointer" }}
                                            />
                                            <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>
                                                🍲 Kuliner Lainnya
                                            </span>
                                        </label>
                                    </div>

                                    {/* Harga */}
                                    <div className="filter-section" style={{ padding: "12px 16px", borderBottom: "1.5px solid var(--cream-dark)" }}>
                                        <h4 style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>Harga</h4>
                                        <div className="price-range" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                            <div className="price-input-wrap" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <span style={{ fontSize: "12px", color: "var(--text-muted)", width: "30px" }}>Min</span>
                                                <input
                                                    className="price-input"
                                                    type="number"
                                                    placeholder="0"
                                                    value={priceMinInput}
                                                    onChange={(e) => setPriceMinInput(e.target.value)}
                                                    style={{ flex: 1, padding: "6px 10px", border: "1.5px solid var(--cream-dark)", borderRadius: "6px", fontSize: "13px" }}
                                                />
                                            </div>
                                            <div className="price-input-wrap" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <span style={{ fontSize: "12px", color: "var(--text-muted)", width: "30px" }}>Maks</span>
                                                <input
                                                    className="price-input"
                                                    type="number"
                                                    placeholder="Maks"
                                                    value={priceMaxInput}
                                                    onChange={(e) => setPriceMaxInput(e.target.value)}
                                                    style={{ flex: 1, padding: "6px 10px", border: "1.5px solid var(--cream-dark)", borderRadius: "6px", fontSize: "13px" }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reset */}
                                    <div style={{ padding: "16px" }}>
                                        <button
                                            onClick={handleReset}
                                            style={{ width: "100%", padding: "8px", background: "white", border: "1.5px solid var(--terracotta)", color: "var(--terracotta)", borderRadius: "8px", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}
                                        >
                                            ↺ Reset Filter
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Main Grid */}
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <div className="sort-bar" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                                <label style={{ fontSize: "13px", color: "var(--text-muted)" }}>Urutkan:</label>
                                <select
                                    className="sort-select"
                                    style={{ padding: "8px 12px", border: "1.5px solid var(--cream-dark)", borderRadius: "8px", fontSize: "13px", background: "white", outline: "none" }}
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                >
                                    <option value="-rating_avg">Rating Tertinggi</option>
                                    <option value="price">Harga Terendah</option>
                                    <option value="-price">Harga Tertinggi</option>
                                    <option value="-sold_count">Terlaris</option>
                                </select>
                                <span className="result-count" style={{ marginLeft: "auto", fontSize: "13px", color: "var(--text-muted)" }}>
                                    {isLoading ? "Memuat..." : `${totalProducts} hasil ditemukan`}
                                </span>
                            </div>

                            <div className="product-grid-lg" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
                                {visibleProducts.length > 0 ? visibleProducts.map((product: ProductItem) => {
                                    const openState = getIsStoreOpen(product);
                                    const isClosed = openState === false;

                                    return (
                                        <Link
                                            key={product.id}
                                            href={`/produk/${product.id}`}
                                            className={`product-card-lg ${isClosed ? 'is-closed' : ''}`}
                                            style={{
                                                textDecoration: "none",
                                                display: "flex",
                                                flexDirection: "column",
                                                background: "white",
                                                borderRadius: "16px",
                                                border: "1.5px solid var(--cream-dark)",
                                                overflow: "hidden",
                                                height: "100%"
                                            }}
                                        >
                                            <div className="product-img-lg" style={{ position: 'relative', height: '200px', flexShrink: 0, background: 'var(--cream-dark)' }}>
                                                {product.thumbnail?.media_url ? (
                                                    <Image
                                                        src={product.thumbnail.media_url}
                                                        alt={product.name}
                                                        fill
                                                        style={{ objectFit: 'cover', filter: isClosed ? 'grayscale(100%) brightness(0.72)' : 'none' }}
                                                    />
                                                ) : <div style={{ fontSize: '40px', width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>🍽️</div>}

                                                {(product.discount ?? 0) > 0 && <div className="promo-tag" style={{ position: 'absolute', top: 0, left: 0, background: 'linear-gradient(135deg, #e53935, #c62828)', color: 'white', fontSize: '11px', fontWeight: 800, padding: '5px 14px 5px 9px', clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}>-{product.discount}%</div>}

                                                {isClosed && (
                                                    <div className="closed-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.42)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                        <div className="closed-badge" style={{ background: 'rgba(0,0,0,0.78)', color: 'white', fontSize: '12px', fontWeight: 800, padding: '5px 14px', borderRadius: '20px', border: '1.5px solid rgba(255,255,255,0.25)' }}>🔒 Sedang Tutup</div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="product-body-lg" style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}>
                                                <div className="product-name-lg" style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.4, marginBottom: "6px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.name}</div>
                                                <div className="product-shop-lg" style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                                                    <span>🏪</span> {product.store?.name || 'Toko UMKM'}
                                                </div>

                                                <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--cream-dark)", paddingTop: "12px" }}>
                                                    <div className="price-col">
                                                        <div className="price-main" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--terracotta)' }}>
                                                            {product.price?.formatted?.split(",")[0] || `Rp ${(product.price?.amount || 0).toLocaleString('id-ID')}`}
                                                        </div>
                                                        <div className="sold-row" style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                            <span style={{ color: "#F1C40F", fontSize: "12px" }}>★</span>
                                                            <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{product.rating_avg || 5.0}</span>
                                                            <span>·</span>
                                                            <span>({product.sold_count || 0})</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        title="Pesan via WhatsApp"
                                                        className={`btn-wa-compact ${isClosed ? 'disabled' : ''}`}
                                                        style={isClosed ? { background: '#bbb', boxShadow: 'none', cursor: 'not-allowed', width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "none", color: "white" } : { background: '#25D366', boxShadow: '0 2px 8px rgba(37,211,102,0.3)', cursor: 'pointer', width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "none", color: "white" }}
                                                        disabled={isClosed}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            if (!isClosed) handleWhatsAppClick(product);
                                                        }}
                                                    >
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d={WA_SVG} />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                }) : (
                                    !isLoading && (
                                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                                            Tidak ada produk kuliner ditemukan.
                                        </div>
                                    )
                                )}
                            </div>

                            {hasNextPage && (
                                <div style={{ textAlign: "center", marginTop: "40px" }}>
                                    <button
                                        onClick={() => fetchNextPage()}
                                        disabled={isLoading}
                                        style={{ padding: '12px 32px', fontWeight: 700, background: 'white', border: '1.5px solid var(--cream-dark)', borderRadius: '50px', cursor: 'pointer', color: 'var(--text-secondary)' }}
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
