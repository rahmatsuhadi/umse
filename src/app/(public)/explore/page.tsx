"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import ContactSection from "@/components/landing/Contact";
import { useInfiniteProducts } from "@/features/products/hooks";
import { useCategories } from "@/features/categories/hooks";
import { useDistricts } from "@/features/locations/hooks";
import { Filter } from "lucide-react";
import { useCreateVisitorLog } from "@/features/visitor-logs/hooks";
import { useInfiniteStores } from "@/features/store/hooks";
import { useInfiniteArticles } from "@/features/articles/hooks";
import Image from "next/image";
import { SlemanFoodSections } from "@/components/home/SlemanFoodSections";
import { ProductCard } from "@/components/shared/ProductCard";

function formatDate(dateStr: string) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatInputRupiah(value: string) {
    const n = value.replace(/\D/g, '');
    if (!n) return '';
    return new Intl.NumberFormat('id-ID').format(parseInt(n));
}

function ExplorePageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get("q") || "";

    const [searchInput, setSearchInput] = useState(query);
    const [activeTab, setActiveTab] = useState("products");

    // Filters
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("relevant");
    const [isFastFood, setIsFastFood] = useState(false);
    const [isFrozen, setIsFrozen] = useState(false);
    const [isOpenNow, setIsOpenNow] = useState(false);
    const [selectedRating, setSelectedRating] = useState<string | null>(null);

    const { mutate: logVisitor } = useCreateVisitorLog();

    useEffect(() => { setSearchInput(query); }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) router.push(`/explore?q=${encodeURIComponent(searchInput.trim())}`);
    };

    const { data: categoriesData } = useCategories();
    const { data: districtsData } = useDistricts("3404");

    const minP = minPrice ? parseInt(minPrice.replace(/\./g, '')) : undefined;
    const maxP = maxPrice ? parseInt(maxPrice.replace(/\./g, '')) : undefined;

    const sortMap: Record<string, string | undefined> = {
        'relevant': undefined,
        'price-asc': 'price',
        'price-desc': '-price',
        'rating': '-rating_avg',
        'sold': '-sold_count',
    };

    // ── Product query (all active filters applied)
    const {
        data: productsData,
        fetchNextPage: fetchNextProducts,
        hasNextPage: hasMoreProducts,
        isLoading: isLoadingProducts
    } = useInfiniteProducts({
        q: query,
        filter: {
            category__slug: selectedCategories.length ? selectedCategories.join(',') : undefined,
            district_id: selectedDistricts.length ? selectedDistricts.join(',') : undefined,
            min_price: minP,
            max_price: maxP,
            category__is_ready_to_serve: isFastFood ? 1 : undefined,
            category__is_frozen: isFrozen ? 1 : undefined,
            is_open: isOpenNow ? 1 : undefined,
            min_rating: selectedRating ? parseInt(selectedRating) : undefined
        },
        sort: sortMap[sortBy]
    });

    // ── Store query (category + district filters only)
    const {
        data: storesData,
        fetchNextPage: fetchNextStores,
        hasNextPage: hasMoreStores,
        isLoading: isLoadingStores
    } = useInfiniteStores({
        search: query,
        filter: {
            district_id: selectedDistricts.length ? selectedDistricts.join(',') : undefined,
            is_open: isOpenNow ? 1 : undefined,
        }
    });

    // ── Article query (title search only, via search param)
    const {
        data: articlesData,
        fetchNextPage: fetchNextArticles,
        hasNextPage: hasMoreArticles,
        isLoading: isLoadingArticles
    } = useInfiniteArticles({ search: query });

    const allProducts = useMemo(() => productsData?.pages.flatMap(page => page.data) || [], [productsData]);
    const stores = storesData?.pages.flatMap(page => page.data) || [];
    const articles = articlesData?.pages.flatMap(page => page.data) || [];

    const totalProducts = productsData?.pages[0]?.meta?.total || 0;
    const totalStores = storesData?.pages[0]?.meta?.total || 0;
    const totalArticles = articlesData?.pages[0]?.meta?.total || 0;

    // ── Dynamic faceted counts
    const { data: productsForDistrictFacet } = useInfiniteProducts({
        q: query,
        filter: {
            category__slug: selectedCategories.length ? selectedCategories.join(',') : undefined,
            min_price: minP,
            max_price: maxP,
        }
    });
    const allProductsNoDist = useMemo(() => productsForDistrictFacet?.pages.flatMap(p => p.data) || [], [productsForDistrictFacet]);

    const { data: productsForCatFacet } = useInfiniteProducts({
        q: query,
        filter: {
            district_id: selectedDistricts.length ? selectedDistricts.join(',') : undefined,
            min_price: minP,
            max_price: maxP,
        }
    });
    const allProductsNoCat = useMemo(() => productsForCatFacet?.pages.flatMap(p => p.data) || [], [productsForCatFacet]);

    const districtCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        allProductsNoDist.forEach((p: any) => {
            const id = (p.district_id ?? p.store?.district_id)?.toString();
            if (id) counts[id] = (counts[id] || 0) + 1;
        });
        return counts;
    }, [allProductsNoDist]);

    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        allProductsNoCat.forEach((p: any) => {
            const slug = p.category?.slug;
            if (slug) counts[slug] = (counts[slug] || 0) + 1;
        });
        return counts;
    }, [allProductsNoCat]);

    const ratingCounts = useMemo(() => {
        const counts: Record<string, number> = { '5': 0, '4': 0, '3': 0 };
        allProducts.forEach((p: any) => {
            const avg = parseFloat(p.average_rating || '0');
            if (avg >= 5.0) { counts['5']++; counts['4']++; counts['3']++; }
            else if (avg >= 4.0) { counts['4']++; counts['3']++; }
            else if (avg >= 3.0) { counts['3']++; }
        });
        return counts;
    }, [allProducts]);

    const specialCounts = useMemo(() => {
        let fastFood = 0;
        let frozen = 0;
        allProducts.forEach((p: any) => {
            if (p.category?.is_ready_to_serve) fastFood++;
            if (p.category?.is_frozen) frozen++;
        });
        return { fastFood, frozen };
    }, [allProducts]);


    // ── Grid Renderers

    const handleStoreWhatsApp = (store: any) => {
        logVisitor({ product_id: store.id });
        const phone = store.user?.phone_number || store.phone || '';
        const message = `Halo, saya tertarik dengan produk dari toko ${store.name}`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
    };

    const toggleDistrict = (id: string) => {
        setSelectedDistricts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };
    const toggleCategory = (slug: string) => {
        setSelectedCategories(prev => prev.includes(slug) ? prev.filter(x => x !== slug) : [...prev, slug]);
    };
    const resetFilters = () => {
        setSelectedCategories([]);
        setSelectedDistricts([]);
        setMinPrice("");
        setMaxPrice("");
        setIsFastFood(false);
        setIsFrozen(false);
        setIsOpenNow(false);
        setSelectedRating(null);
    };

    const districts = (districtsData?.data || []) as any[];
    const categories = (categoriesData?.data || []) as any[];

    const visibleDistricts = districts.filter((d: any) => {
        const count = districtCounts[d.id?.toString()] || 0;
        return selectedDistricts.includes(d.id?.toString()) || count > 0;
    });

    const visibleCategories = categories.filter((c: any) => {
        const count = categoryCounts[c.slug] || 0;
        return selectedCategories.includes(c.slug) || count > 0;
    });

    const ratingOptions = [
        { label: '★★★★★ 5.0', key: '5' },
        { label: '★★★★☆ 4.0+', key: '4' },
        { label: '★★★☆☆ 3.0+', key: '3' },
    ];

    const filterOptionLayoutStyle = { display: 'flex', alignItems: 'center', gap: '8px', width: '100%', marginBottom: '4px' } as const;
    const filterTextStyle = { flex: 1, minWidth: 0, textAlign: 'left' as const };
    const filterCountRightStyle = { marginLeft: 'auto', textAlign: 'right' as const };

    // Filter products client-side for the special sections (if they match the query/filters, they are in allProducts)
    const fastFoodProducts = allProducts.filter(p => p.category?.is_ready_to_serve);
    const frozenProducts = allProducts.filter(p => p.category?.is_frozen);

    // Remaining products not in the special sections
    const remainingProducts = allProducts.filter(p => !p.category?.is_ready_to_serve && !p.category?.is_frozen);
    const mainGridProducts = remainingProducts.length > 0
        ? remainingProducts
        : (!fastFoodProducts.length && !frozenProducts.length ? allProducts : []);
    const showMainProductsHeader = mainGridProducts.length > 0;

    return (
        <div className="pb-20 md:pb-0 explore-page bg-cream">
            <Navbar />
            <main className="page active" id="page-explore">
                <div className="explore-header pt-80 pb-32">
                    <div className="explore-header-inner">
                        <p className="explore-title">Hasil pencarian untuk:</p>
                        <h1 className="explore-keyword" id="exploreKeyword">&quot;{query || "Semua Produk"}&quot;</h1>
                        <form className="explore-search-bar" onSubmit={handleSearch}>
                            <input type="text" id="exploreSearchInput" placeholder="Cari lagi..." value={searchInput} onChange={e => setSearchInput(e.target.value)} />
                            <button type="submit">Cari</button>
                        </form>
                        <div className="explore-stats">
                            <span className="explore-stat" id="exploreStatProduk"><strong>{totalProducts}</strong> Produk</span>
                            <span className="explore-stat" id="exploreStatToko"><strong>{totalStores}</strong> Toko</span>
                            <span className="explore-stat" id="exploreStatArtikel"><strong>{totalArticles}</strong> Artikel</span>
                        </div>
                    </div>
                </div>

                <div className="explore-body">
                    <div className="explore-layout">

                        {/* ── Filter Sidebar ── */}
                        <aside>
                            <div className="filter-sidebar">
                                <div className="filter-panel">
                                    <div className="filter-header">
                                        <Filter size={16} />
                                        Filter & Urutkan
                                    </div>

                                    {/* Kecamatan */}
                                    {visibleDistricts.length > 0 && (
                                        <div className="filter-section">
                                            <h4>Kapanewon</h4>
                                            <div id="filterSubdistricts">
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

                                    {/* Kategori */}
                                    {visibleCategories.length > 0 && (
                                        <div className="filter-section">
                                            <h4>Kategori</h4>
                                            <label className="filter-option" style={filterOptionLayoutStyle}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.length === 0}
                                                    onChange={() => setSelectedCategories([])}
                                                />
                                                <span style={filterTextStyle}>Semua Kategori</span>
                                                <span className="count" style={filterCountRightStyle}>–</span>
                                            </label>
                                            {visibleCategories.map((cat: any) => {
                                                const count = categoryCounts[cat.slug] || 0;
                                                return (
                                                    <label key={cat.id} className="filter-option" style={filterOptionLayoutStyle}>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCategories.includes(cat.slug)}
                                                            onChange={() => toggleCategory(cat.slug)}
                                                        />
                                                        <span style={filterTextStyle}>{cat.name}</span>
                                                        <span className="count" style={filterCountRightStyle}>{count}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* 🍔 Fast Food & 🧊 Frozen Food — SPECIAL FILTERS */}
                                    <div className="filter-section border-t-cream">
                                        <h4 className="flex-center gap-6">
                                            <span className="font-15">⚡</span> Siap Saji & Beku
                                        </h4>
                                        <label className="filter-option filter-option-special" style={filterOptionLayoutStyle}>
                                            <input type="checkbox" checked={isFastFood} onChange={e => setIsFastFood(e.target.checked)} />
                                            <span className="filter-text-flex">
                                                <span style={{ fontSize: '15px' }}>🍔</span> Fast Food Lokal
                                            </span>
                                            <span className="count" style={filterCountRightStyle}>{specialCounts.fastFood}</span>
                                        </label>
                                        <label className="filter-option filter-option-special" style={filterOptionLayoutStyle}>
                                            <input type="checkbox" checked={isFrozen} onChange={e => setIsFrozen(e.target.checked)} />
                                            <span className="filter-text-flex">
                                                <span style={{ fontSize: '15px' }}>🧊</span> Frozen Food
                                            </span>
                                            <span className="count" style={filterCountRightStyle}>{specialCounts.frozen}</span>
                                        </label>
                                        {/* Open now toggle */}
                                        <div className="filter-option filter-divider">
                                            <label style={{ position: "relative", display: "inline-block", width: "34px", height: "20px", cursor: "pointer", flex: "none" }}>
                                                <input
                                                    type="checkbox"
                                                    checked={isOpenNow}
                                                    onChange={e => setIsOpenNow(e.target.checked)}
                                                    style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
                                                />
                                                <span style={{ position: "absolute", inset: 0, borderRadius: "20px", transition: "0.2s", background: isOpenNow ? "var(--forest)" : "var(--cream-dark)" }}></span>
                                                <span style={{ position: "absolute", width: "16px", height: "16px", borderRadius: "50%", background: "white", top: "2px", left: "2px", transition: "0.2s", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)", transform: isOpenNow ? "translateX(14px)" : "translateX(0)" }}></span>
                                            </label>
                                            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                                                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: isOpenNow ? '#27AE60' : '#ccc' }}></span> Buka Sekarang
                                            </span>
                                        </div>
                                    </div>

                                    {/* Harga */}
                                    <div className="filter-section">
                                        <h4>Harga</h4>
                                        <div className="price-range">
                                            <div className="price-input-wrap">
                                                <span className="price-input-label">Min</span>
                                                <input className="price-input" type="text" placeholder="Min" value={minPrice} onChange={e => setMinPrice(formatInputRupiah(e.target.value))} />
                                            </div>
                                            <div className="price-input-wrap">
                                                <span style={{ fontSize: '12px', color: 'var(--text-muted)', width: '30px' }}>Maks</span>
                                                <input className="price-input" type="text" placeholder="Maks" value={maxPrice} onChange={e => setMaxPrice(formatInputRupiah(e.target.value))} />
                                            </div>
                                        </div>
                                        <button className="btn btn-primary btn-sm filter-apply" onClick={() => { fetchNextProducts() }}>Terapkan Filter</button>
                                    </div>


                                    {/* Rating */}
                                    {/* {ratingOptions.some(r => (ratingCounts[r.key] || 0) > 0) && (
                                        <div className="filter-section">
                                            <h4>Rating</h4>
                                            {ratingOptions.map((r, i) => {
                                                const count = ratingCounts[r.key] || 0;
                                                if (count === 0 && selectedRating !== r.key) return null;
                                                return (
                                                    <label key={i} className="filter-option" style={filterOptionLayoutStyle}>
                                                        <input
                                                            type="radio"
                                                            name="ratingFilter"
                                                            checked={selectedRating === r.key}
                                                            onChange={() => setSelectedRating(r.key === selectedRating ? null : r.key)}
                                                            onClick={() => {
                                                                if (selectedRating === r.key) setSelectedRating(null);
                                                            }}
                                                        />
                                                        <span style={filterTextStyle}>{r.label}</span>
                                                        <span className="count" style={filterCountRightStyle}>{count}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )} */}


                                    {/* Reset */}
                                    <div style={{ padding: "16px" }}>
                                        <button
                                            onClick={resetFilters}
                                            className="btn-reset-filter">Reset Filter
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* ── Results ── */}
                        <div className="min-w-0">
                            <div className="explore-tabs">
                                <button className={`explore-tab ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')} id="tabBtnProducts">Produk ({totalProducts})</button>
                                <button className={`explore-tab ${activeTab === 'merchants' ? 'active' : ''}`} onClick={() => setActiveTab('merchants')} id="tabBtnMerchants">Toko ({totalStores})</button>
                                <button className={`explore-tab ${activeTab === 'articles' ? 'active' : ''}`} onClick={() => setActiveTab('articles')} id="tabBtnArticles">Artikel ({totalArticles})</button>
                            </div>

                            <div className="sort-bar">
                                <label>Urutkan:</label>
                                <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                    <option value="relevant">Paling Relevan</option>
                                    <option value="price-asc">Harga Terendah</option>
                                    <option value="price-desc">Harga Tertinggi</option>
                                    <option value="rating">Rating Tertinggi</option>
                                    <option value="sold">Terlaris</option>
                                </select>
                                <span className="result-count">
                                    {activeTab === "products" ? totalProducts : activeTab === "merchants" ? totalStores : totalArticles} hasil ditemukan
                                </span>
                            </div>

                            {/* Products Tab */}
                            <div id="exploreTabProducts" style={{ display: activeTab === 'products' ? 'block' : 'none' }}>

                                {/* Sleman Food Sections (Fast Food & Frozen) */}
                                {/* Only show when no specific filters are applied for a cleaner default explore view */}
                                {!query && selectedCategories.length === 0 && selectedDistricts.length === 0 && !minPrice && !maxPrice && !isFastFood && !isFrozen && !isOpenNow && !selectedRating && (
                                    <div className="mb-32">
                                        <SlemanFoodSections />
                                    </div>
                                )}

                                {/* Fast Food section inside results */}
                                {fastFoodProducts.length > 0 && (
                                    <div id="exploreFFSection" className="catalog-special explore-special-section flex-col mb-24">
                                        <div className="catalog-special-header">
                                            <div className="catalog-special-icon-wrap bg-orange-light">🍔</div>
                                            <div>
                                                <div className="catalog-special-label text-orange-dark">Fast Food Lokal</div>
                                                <div className="catalog-special-title font-18">Siap Saji dari UMKM</div>
                                            </div>
                                        </div>
                                        <div className="catalog-hscroll py-16" id="exploreFFRow">
                                            {fastFoodProducts.map((product) => (
                                                <ProductCard key={`ff-${product.id}`} product={product} className="cat-card-scroll" />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Frozen Food section inside results */}
                                {frozenProducts.length > 0 && (
                                    <div id="exploreFrozenSection" className="catalog-special explore-special-section flex-col pt-16 mb-32">
                                        <div className="catalog-special-header">
                                            <div className="catalog-special-icon-wrap bg-blue-light">🧊</div>
                                            <div>
                                                <div className="catalog-special-label text-blue-dark">Frozen Food</div>
                                                <div className="catalog-special-title" style={{ fontSize: 18 }}>Homemade, Siap Masak</div>
                                            </div>
                                        </div>
                                        <div className="catalog-hscroll" id="exploreFrozenRow" style={{ padding: '16px 0' }}>
                                            {frozenProducts.map((product) => (
                                                <ProductCard key={`fz-${product.id}`} product={product} className="cat-card-scroll" />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {showMainProductsHeader && (
                                    <div>
                                        <div id="exploreMainProductsHeader" className="catalog-main-header explore-main-products-header flex-between gap-8 mb-10 flex-wrap">
                                            <div className="catalog-main-title font-17">Produk Lainnya</div>
                                        </div>
                                        <div className="divider-20" />
                                    </div>
                                )}

                                <div className="product-grid explore-main-products-grid" id="exploreProductsGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                                    {mainGridProducts.map((product: any) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                    {allProducts.length === 0 && !isLoadingProducts && (
                                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                            Tidak ada produk ditemukan
                                        </div>
                                    )}
                                </div>
                                {hasMoreProducts && (
                                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                                        <button onClick={() => fetchNextProducts()} disabled={isLoadingProducts} style={{ padding: '10px 30px', borderRadius: '12px', border: '2px solid var(--cream-dark)', background: 'white', fontWeight: 600, cursor: 'pointer' }}>
                                            {isLoadingProducts ? 'Memuat...' : 'Lihat Lebih Banyak'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Merchants Tab */}
                            <div id="exploreTabMerchants" style={{ display: activeTab === 'merchants' ? 'block' : 'none' }}>
                                <div className="merchant-grid-list" id="exploreMerchantsGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                                    {stores.length > 0 ? stores.map((store: any) => (
                                        <div key={store.id} style={{ background: 'white', borderRadius: '16px', border: '1.5px solid var(--cream-dark)', padding: '20px', display: 'flex', gap: '16px', cursor: 'pointer', transition: 'all 0.2s' }}>
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
                                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>⭐ {store.rating_avg || '5.0'}</span>
                                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>📦 {store.products_count || 0} produk</span>
                                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>💬 {store.reviews_count || 0} ulasan</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', flexShrink: 0 }}>
                                                <button onClick={e => { e.stopPropagation(); handleStoreWhatsApp(store); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '12px', background: '#25D366', color: 'white', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer', marginTop: '8px' }}>
                                                    💬 Chat
                                                </button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                            {isLoadingStores ? 'Memuat toko...' : 'Tidak ada toko ditemukan'}
                                        </div>
                                    )}
                                </div>
                                {hasMoreStores && (
                                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                        <button onClick={() => fetchNextStores()} disabled={isLoadingStores} style={{ padding: '10px 30px', borderRadius: '12px', border: '2px solid var(--cream-dark)', background: 'white', fontWeight: 600, cursor: 'pointer' }}>
                                            {isLoadingStores ? 'Memuat...' : 'Lihat Lebih Banyak'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Articles Tab */}
                            <div id="exploreTabArticles" style={{ display: activeTab === 'articles' ? 'block' : 'none' }}>
                                <div className="article-grid" id="exploreArticlesGrid">
                                    {articles.length > 0 ? articles.map((article: any) => (
                                        <div key={article.id} style={{ background: 'white', borderRadius: '16px', border: '1.5px solid var(--cream-dark)', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}>
                                            <div style={{ height: '140px', background: 'var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', position: 'relative', overflow: 'hidden' }}>
                                                {article.thumbnail?.media_url ? <Image src={article.thumbnail.media_url} alt={article.title} fill style={{ objectFit: 'cover' }} /> : '📰'}
                                            </div>
                                            <div style={{ padding: '16px' }}>
                                                {article.category_label && (
                                                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--terracotta)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                                                        {article.category_label}
                                                    </div>
                                                )}
                                                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: '8px' }}>
                                                    {article.title}
                                                </div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    📅 {formatDate(article.created_at)}
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                            {isLoadingArticles ? 'Memuat artikel...' : 'Tidak ada artikel ditemukan'}
                                        </div>
                                    )}
                                </div>
                                {hasMoreArticles && (
                                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                        <button onClick={() => fetchNextArticles()} disabled={isLoadingArticles} style={{ padding: '10px 30px', borderRadius: '12px', border: '2px solid var(--cream-dark)', background: 'white', fontWeight: 600, cursor: 'pointer' }}>
                                            {isLoadingArticles ? 'Memuat...' : 'Lihat Lebih Banyak'}
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

                <div style={{ background: 'var(--brown-dark)', padding: '24px', textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                    © 2025 Sleman Mart. Kabupaten Sleman, D.I. Yogyakarta
                </div>
            </main>

            <ContactSection />
            <style jsx global>{`
                .explore-page .explore-special-card,
                .explore-page .explore-special-card:hover {
                    box-shadow: none;
                    transform: none;
                    border-color: var(--cream-dark);
                }
            `}</style>
        </div>
    );
}

export default function ExplorePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ExplorePageContent />
        </Suspense>
    );
}
