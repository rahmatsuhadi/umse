"use client";

import { useState, useMemo } from "react";

import ContactSection from "@/components/landing/Contact";
import { Navbar } from "@/components/shared/Navbar";
import { useInfiniteProducts } from "@/features/products/hooks";
import { useInfiniteStores } from "@/features/store/hooks";
import { useDistricts } from "@/features/locations/hooks";
import { useJasaCategories } from "@/features/categories/hooks";
import { ServiceCard } from "@/components/shared/ServiceCard";
import Image from "next/image";

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

export default function SlemanJasaPage() {
    const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
    const [openNow, setOpenNow] = useState(true);
    const [sort, setSort] = useState("-rating_avg");

    const [priceMinInput, setPriceMinInput] = useState<string>("");
    const [priceMaxInput, setPriceMaxInput] = useState<string>("");
    const [searchInput, setSearchInput] = useState<string>("");
    const [searchKeyword, setSearchKeyword] = useState<string>("");

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [activeTab, setActiveTab] = useState<'services' | 'stores'>('services');

    const { data: categoriesData } = useJasaCategories();
    const categories = categoriesData?.data || [];

    const handleReset = () => {
        setSelectedDistricts([]);
        setOpenNow(false);
        setSort("-rating_avg");
        setPriceMinInput("");
        setPriceMaxInput("");
        setSearchInput("");
        setSearchKeyword("");
        setSelectedCategories([]);
        setIsOpen(false);
    };

    // 1. Fetch Districts
    const { data: districtsData } = useDistricts("3404");
    const subdistricts = districtsData?.data || [];

    // Construct filters
    const filters: Record<string, string | number | undefined> = {
        district_id: selectedDistricts.length > 0 ? selectedDistricts.join(',') : undefined,
        category__slug: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
        min_price: priceMinInput ? Number(priceMinInput) : undefined,
        max_price: priceMaxInput ? Number(priceMaxInput) : undefined,
    };
    if (openNow) filters["is_open_store"] = 1;
    if (isOpen) filters["is_open"] = 1;

    // Jasa specific filters (type=service)
    filters["type"] = "service";

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

    // --- Dynamic Facet Logic ---
    const { data: productsForDistrictFacet } = useInfiniteProducts({
        q: searchKeyword.trim() !== "" ? searchKeyword.trim() : undefined,
        filter: {
            ...filters,
            district_id: undefined
        }
    });
    const allProductsNoDist = useMemo(() => productsForDistrictFacet?.pages.flatMap(p => p.data) || [], [productsForDistrictFacet]);

    const { data: productsForCatFacet } = useInfiniteProducts({
        q: searchKeyword.trim() !== "" ? searchKeyword.trim() : undefined,
        filter: {
            ...filters,
            category__slug: undefined
        }
    });
    const allProductsNoCat = useMemo(() => productsForCatFacet?.pages.flatMap(p => p.data) || [], [productsForCatFacet]);

    const districtCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        allProductsNoDist.forEach((p: any) => {
            const id = (p.district_id ?? p.store?.district_id)?.toString();
            if (id) counts[id] = (counts[id] || 0) + 1;
        });
        return counts;
    }, [allProductsNoDist]);

    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        allProductsNoCat.forEach((p: any) => {
            const slug = p.category?.slug;
            if (slug) counts[slug] = (counts[slug] || 0) + 1;
        });
        return counts;
    }, [allProductsNoCat]);

    const toggleDistrict = (id: string) => {
        setSelectedDistricts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const visibleDistricts = subdistricts.filter((d: any) => {
        const count = districtCounts[d.id?.toString()] || 0;
        return selectedDistricts.includes(d.id?.toString()) || count > 0;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const visibleCategories = categories.filter((c: any) => {
        const count = categoryCounts[c.slug] || 0;
        return selectedCategories.includes(c.slug) || count > 0;
    });

    const filterOptionLayoutStyle = { display: 'flex', alignItems: 'center', gap: '8px', width: '100%', marginBottom: '4px' } as const;
    const filterTextStyle = { flex: 1, minWidth: 0, textAlign: 'left' as const };
    const filterCountRightStyle = { marginLeft: 'auto', textAlign: 'right' as const };
    // ----------------------------

    // 4. Fetch Stores
    const {
        data: storesData,
        fetchNextPage: fetchNextStores,
        hasNextPage: hasNextStores,
        isLoading: isLoadingStores
    } = useInfiniteStores({
        search: searchKeyword.trim() !== "" ? searchKeyword.trim() : undefined,
        filter: {
            district_id: selectedDistricts.length > 0 ? selectedDistricts.join(',') : undefined,
            category__slug: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
            is_open_store: openNow ? 1 : undefined,
            has_service: 1
        }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stores = (storesData?.pages.flatMap(page => page.data) as any[]) || [];
    const totalStores = storesData?.pages[0]?.meta?.total || stores.length;

    // Fetch Open Stores specifically for the header stat
    // Fetch Open Products (Services) specifically for the header stat
    const { data: openProductsData } = useInfiniteProducts({
        q: searchKeyword.trim() !== "" ? searchKeyword.trim() : undefined,
        filter: {
            district_id: selectedDistricts.length > 0 ? selectedDistricts.join(',') : undefined,
            category__slug: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
            is_open_store: 1,
            type: "service"
        }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalOpenStores = openProductsData?.pages[0]?.meta?.total || (openProductsData?.pages.flatMap((page: any) => page.data).length || 0);

    // Fetch Base Stores specifically for the header stat (unfiltered by open_now)
    const { data: baseStoresData } = useInfiniteStores({
        search: searchKeyword.trim() !== "" ? searchKeyword.trim() : undefined,
        filter: {
            district_id: selectedDistricts.length > 0 ? selectedDistricts.join(',') : undefined,
            category__slug: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
            has_service: 1
        }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const absoluteTotalStores = baseStoresData?.pages[0]?.meta?.total || (baseStoresData?.pages.flatMap((page: any) => page.data).length || 0);

    return (
        <div className="pb-20 md:pb-0" style={{ background: 'var(--cream)', minHeight: '100vh' }}>
            <Navbar />
            <div className="page active" id="page-jasa">

                {/* ── Header (mirrors explore-header, purple theme) ── */}
                <div className="jasa-explore-header">
                    <div className="jasa-explore-header-inner">
                        <div className="jasa-explore-eyebrow">🛠️ Layanan Profesional Lokal</div>
                        <h1 className="jasa-explore-heading">Sleman <em>Jasa</em></h1>

                        {/* Search bar */}
                        <div className="jasa-explore-search-bar">
                            <span className="jasa-explore-search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Cari layanan, misal: laundry, jahit, pijat…"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') setSearchKeyword(searchInput);
                                }}
                            />
                            <button onClick={() => setSearchKeyword(searchInput)}>Cari</button>
                        </div>

                        {/* Live stats */}
                        <div className="jasa-explore-stats">
                            <span className="jasa-explore-stat"><strong id="jasaStatLayanan">{totalProducts}</strong> Layanan</span>
                            <span className="jasa-explore-stat"><strong id="jasaStatToko">{absoluteTotalStores}</strong> Toko</span>
                            <span className="jasa-explore-stat" id="jasaOpenStat" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span className="time-dot" id="jasaHeaderDot" style={openNow ? { animation: "pulseGreen 2s infinite" } : { background: '#999', animation: 'none' }}></span>
                                <strong id="jasaStatOpenHeader">{totalOpenStores}</strong> Buka Sekarang
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Body: sidebar + results ── */}
                <div className="jasa-explore-body">
                    <div className="jasa-explore-layout">

                        {/* ── Filter Sidebar ── */}
                        <aside>
                            <div className="filter-sidebar">
                                <div className="filter-panel">
                                    <div className="filter-header" style={{ background: 'linear-gradient(135deg,rgba(123,31,162,0.12),rgba(156,39,176,0.06))', cursor: 'pointer', color: 'black' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                                        Filter &amp; Urutkan
                                    </div>

                                    {/* Kecamatan */}
                                    {visibleDistricts.length > 0 && (
                                        <div className="filter-section">
                                            <h4>Kapanewon</h4>
                                            <div id="filterSubdistricts">
                                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                {visibleDistricts.map((dist: any) => {
                                                    const count = districtCounts[dist.id?.toString()] || 0;
                                                    return (
                                                        <label key={dist.id} className="filter-option" style={filterOptionLayoutStyle}>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedDistricts.includes(dist.id?.toString())}
                                                                onChange={() => toggleDistrict(dist.id?.toString())}
                                                            />
                                                            <span style={filterTextStyle}>{dist.name}</span>
                                                            <span className="count" style={filterCountRightStyle}>{count}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Kategori Jasa */}
                                    {visibleCategories.length > 0 && (
                                        <div className="filter-section">
                                            <h4>Kategori Jasa</h4>
                                            <label className="filter-option" style={filterOptionLayoutStyle}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.length === 0}
                                                    onChange={() => setSelectedCategories([])}
                                                />
                                                <span style={filterTextStyle}>Semua Kategori</span>
                                                <span className="count" style={filterCountRightStyle}>–</span>
                                            </label>
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {visibleCategories.map((cat: any) => {
                                                const count = categoryCounts[cat.slug] || 0;
                                                return (
                                                    <label key={cat.id} className="filter-option" style={filterOptionLayoutStyle}>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCategories.includes(cat.slug)}
                                                            onChange={() => {
                                                                setSelectedCategories(prev =>
                                                                    prev.includes(cat.slug)
                                                                        ? prev.filter(c => c !== cat.slug)
                                                                        : [...prev, cat.slug]
                                                                );
                                                            }}
                                                        />
                                                        <span style={filterTextStyle}>{cat.name}</span>
                                                        <span className="count" style={filterCountRightStyle}>{count}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Buka Sekarang */}
                                    <div className="filter-section" >
                                        <h4 className="filter-section-title">Jam Operasi</h4>
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

                                    {/* Harga */}
                                    <div className="filter-section">
                                        <h4>Harga (Rp)</h4>
                                        <div className="price-range">
                                            <input
                                                className="price-input"
                                                type="number"
                                                placeholder="Min"
                                                value={priceMinInput}
                                                onChange={(e) => setPriceMinInput(e.target.value)}
                                            />
                                            <input
                                                className="price-input"
                                                type="number"
                                                placeholder="Maks"
                                                value={priceMaxInput}
                                                onChange={(e) => setPriceMaxInput(e.target.value)}
                                            />
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

                        {/* ── Results ── */}
                        <div style={{ minWidth: 0 }}>

                            {/* Tabs (mirrors explore-tabs) */}
                            <div className="explore-tabs">
                                <button className={`explore-tab ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')} id="tabBtnServices">
                                    Layanan ({totalProducts})
                                </button>
                                <button className={`explore-tab ${activeTab === 'stores' ? 'active' : ''}`} onClick={() => setActiveTab('stores')} id="tabBtnStores">
                                    Toko Jasa ({totalStores})
                                </button>
                            </div>

                            {/* Sort bar (mirrors explore sort-bar) */}
                            <div className="sort-bar">
                                <label>Urutkan:</label>
                                <select
                                    className="sort-select"
                                    value={sort}
                                    style={{ borderColor: 'var(--cream-dark)' }}
                                    onChange={(e) => setSort(e.target.value)}
                                >
                                    {/* <option value="-rating_avg">Rating Tertinggi</option> */}
                                    <option value="price">Harga Terendah</option>
                                    <option value="-price">Harga Tertinggi</option>
                                    <option value="-sold_count">Terlaris</option>
                                </select>
                                <span className="result-count">
                                    {activeTab === 'services'
                                        ? (isLoading ? "Memuat..." : `${totalProducts} hasil ditemukan`)
                                        : (isLoadingStores ? "Memuat..." : `${totalStores} hasil ditemukan`)}
                                </span>

                                <div className="art-view-btns" style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
                                    <button
                                        className={`art-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                        style={viewMode === 'grid' ? { background: '#7B1FA2', borderColor: '#7B1FA2', color: 'white' } : {}}
                                        onClick={() => setViewMode('grid')}
                                        title="Grid"
                                    >
                                        ⊞
                                    </button>
                                    <button
                                        className={`art-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                        style={viewMode === 'list' ? { background: '#7B1FA2', borderColor: '#7B1FA2', color: 'white' } : {}}
                                        onClick={() => setViewMode('list')}
                                        title="List"
                                    >
                                        ☰
                                    </button>
                                </div>
                            </div>

                            {/* Services Tab */}
                            <div id="jasaExploreTabServices" style={{ display: activeTab === 'services' ? 'block' : 'none' }}>
                                <div className={`jasa-grid ${viewMode === 'list' ? 'list-view' : ''}`} id="jasaExploreGrid">
                                    {visibleProducts.length > 0 ? visibleProducts.map((product: ProductItem) => (
                                        <ServiceCard key={product.id} product={product} />
                                    )) : (
                                        <div className="jasa-empty" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px 20px' }}>
                                            <div className="jasa-empty-icon text-5xl mb-4">🔍</div>
                                            <div className="jasa-empty-title text-lg font-bold text-gray-800 mb-2">{isLoading ? 'Memuat layanan...' : 'Layanan tidak ditemukan'}</div>
                                            <div className="jasa-empty-sub text-sm text-gray-500">Coba ubah kata kunci atau reset filter</div>
                                            {!isLoading}
                                        </div>
                                    )}
                                </div>

                                {hasNextPage && (
                                    <div style={{ textAlign: "center", marginTop: "40px" }}>
                                        <button
                                            onClick={() => fetchNextPage()}
                                            disabled={isLoading}
                                            className="btn btn-outline"
                                            style={{ borderColor: '#7B1FA2', color: '#7B1FA2' }}
                                        >
                                            {isLoading ? 'Memuat...' : 'Lihat Lebih Banyak'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Stores Tab */}
                            <div id="jasaExploreTabStores" style={{ display: activeTab === 'stores' ? 'block' : 'none' }}>
                                <div className="merchant-grid-list" id="exploreMerchantsGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {stores.length > 0 ? stores.map((store: any) => (
                                        <div key={store.id} onClick={() => window.location.href = `/toko/${store.slug}`} style={{ background: 'white', borderRadius: '16px', border: '1.5px solid var(--cream-dark)', padding: '20px', display: 'flex', gap: '16px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                            <div style={{ width: '72px', height: '72px', background: 'var(--cream-dark)', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', flexShrink: 0, position: 'relative' }}>
                                                {store.logo_url ? <Image src={store.logo_url} alt={store.name} fill style={{ objectFit: 'cover', borderRadius: '12px' }} /> : '🏪'}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{store.name}</h3>
                                                <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                                                    📍 {store.district?.name || 'Sleman'}, Sleman
                                                </div>
                                                {store.description && (
                                                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                        {store.description}
                                                    </div>
                                                )}
                                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                                    {/* <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>⭐ {store.rating_avg || '0'}</span> */}
                                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>📦 {store.services_count ?? store.products_count ?? 0} layanan</span>
                                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>💬 {store.reviews_count || 0} ulasan</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', flexShrink: 0 }}>
                                                <button onClick={e => { e.stopPropagation(); const phone = store.user?.phone_number || store.phone || ''; window.open(`https://wa.me/${phone}?text=${encodeURIComponent('Halo, saya tertarik dengan layanan dari ' + store.name)}`, '_blank'); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '12px', background: '#25D366', color: 'white', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer', marginTop: '8px' }}>
                                                    💬 Chat
                                                </button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="jasa-empty" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px 20px' }}>
                                            <div className="jasa-empty-icon text-5xl mb-4">🏪</div>
                                            <div className="jasa-empty-title text-lg font-bold text-gray-800 mb-2">{isLoadingStores ? 'Memuat toko...' : 'Toko tidak ditemukan'}</div>
                                            <div className="jasa-empty-sub text-sm text-gray-500">Coba ubah kata kunci atau reset filter</div>
                                        </div>
                                    )}
                                </div>
                                {hasNextStores && (
                                    <div style={{ textAlign: "center", marginTop: "40px" }}>
                                        <button
                                            onClick={() => fetchNextStores()}
                                            disabled={isLoadingStores}
                                            className="btn btn-outline"
                                            style={{ borderColor: '#7B1FA2', color: '#7B1FA2' }}
                                        >
                                            {isLoadingStores ? 'Memuat...' : 'Lihat Lebih Banyak'}
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>{/* /results */}

                    </div>{/* /layout */}
                </div>{/* /body */}

            </div>
            <ContactSection />
        </div>
    );
}
