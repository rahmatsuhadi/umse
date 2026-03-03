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

const WA_SVG = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

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

    const handleWhatsAppClick = (product: any) => {
        logVisitor({ product_id: product.id });
        const phone = product.store?.user?.phone_number || product.store?.phone || '';
        const message = `Halo, saya tertarik dengan produk ${product.name}`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
    };

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
        <div className="pb-20 md:pb-0 explore-page" style={{ background: "var(--cream)" }}>
            <Navbar />
            <main className="page active" id="page-explore">
                <div className="explore-header" style={{ paddingTop: '80px', paddingBottom: '32px' }}>
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
                                            <h4>Kecamatan</h4>
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
                                    <div className="filter-section" style={{ borderTop: '2px solid var(--cream-dark)' }}>
                                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontSize: '15px' }}>⚡</span> Siap Saji & Beku
                                        </h4>
                                        <label className="filter-option filter-option-special" style={filterOptionLayoutStyle}>
                                            <input type="checkbox" checked={isFastFood} onChange={e => setIsFastFood(e.target.checked)} />
                                            <span style={{ ...filterTextStyle, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span style={{ fontSize: '15px' }}>🍔</span> Fast Food Lokal
                                            </span>
                                            <span className="count" style={filterCountRightStyle}>{specialCounts.fastFood}</span>
                                        </label>
                                        <label className="filter-option filter-option-special" style={filterOptionLayoutStyle}>
                                            <input type="checkbox" checked={isFrozen} onChange={e => setIsFrozen(e.target.checked)} />
                                            <span style={{ ...filterTextStyle, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span style={{ fontSize: '15px' }}>🧊</span> Frozen Food
                                            </span>
                                            <span className="count" style={filterCountRightStyle}>{specialCounts.frozen}</span>
                                        </label>
                                        {/* Open now toggle */}
                                        <div className="filter-option" style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--cream-dark)' }}>
                                            <label className="explore-toggle-wrap">
                                                <input type="checkbox" checked={isOpenNow} onChange={e => setIsOpenNow(e.target.checked)} />
                                                <span className="explore-toggle-slider"></span>
                                            </label>
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <span className="time-dot" style={{ flexShrink: 0, background: isOpenNow ? '#27AE60' : '#ccc' }}></span> Buka Sekarang
                                            </span>
                                        </div>
                                    </div>

                                    {/* Harga */}
                                    <div className="filter-section">
                                        <h4>Harga</h4>
                                        <div className="price-range">
                                            <div className="price-input-wrap">
                                                <span style={{ fontSize: '12px', color: 'var(--text-muted)', width: '30px' }}>Min</span>
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
                                    {ratingOptions.some(r => (ratingCounts[r.key] || 0) > 0) && (
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
                                    )}

                                    {/* Reset */}
                                    <div style={{ padding: '0 12px 12px' }}>
                                        <button className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={resetFilters}>↺ Reset Filter</button>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* ── Results ── */}
                        <div style={{ minWidth: 0 }}>
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
                                    <div style={{ marginBottom: '32px' }}>
                                        <SlemanFoodSections />
                                    </div>
                                )}

                                {/* Fast Food section inside results */}
                                {fastFoodProducts.length > 0 && (
                                    <div id="exploreFFSection" className="catalog-special explore-special-section" style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
                                        <div className="catalog-special-header">
                                            <div className="catalog-special-icon-wrap" style={{ background: '#FFF3E0' }}>🍔</div>
                                            <div>
                                                <div className="catalog-special-label" style={{ color: '#e65100' }}>Fast Food Lokal</div>
                                                <div className="catalog-special-title" style={{ fontSize: 18 }}>Siap Saji dari UMKM</div>
                                            </div>
                                        </div>
                                        <div className="catalog-hscroll" id="exploreFFRow" style={{ padding: '16px 0' }}>
                                            {fastFoodProducts.map((product) => (
                                                <div key={`ff-${product.id}`} className="product-card explore-special-card" onClick={() => window.location.href = `/produk/${product.id}`} style={{ cursor: 'pointer', flexShrink: 0, width: 200 }}>
                                                    <div className="product-img" style={{ height: '180px', background: 'var(--cream-dark)', position: 'relative' }}>
                                                        {product.thumbnail?.media_url ? (
                                                            <Image src={product.thumbnail.media_url} alt={product.name} fill style={{ objectFit: 'cover' }} />
                                                        ) : <div style={{ fontSize: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>🎁</div>}
                                                    </div>
                                                    <div className="product-body" style={{ padding: '14px' }}>
                                                        <div className="product-name" style={{ fontWeight: 700, height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                            {product.name}
                                                        </div>
                                                        <div className="product-shop" style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>
                                                            🏪 {product.store?.name || 'Toko UMKM'}
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <div style={{ color: 'var(--terracotta)', fontWeight: 800 }}>
                                                                {product.price?.formatted?.split(",")[0] || `Rp ${(product.price?.amount || 0).toLocaleString('id-ID')}`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Frozen Food section inside results */}
                                {frozenProducts.length > 0 && (
                                    <div id="exploreFrozenSection" className="catalog-special explore-special-section" style={{ display: 'flex', flexDirection: 'column', paddingTop: '16px', marginBottom: '32px' }}>
                                        <div className="catalog-special-header">
                                            <div className="catalog-special-icon-wrap" style={{ background: '#E3F2FD' }}>🧊</div>
                                            <div>
                                                <div className="catalog-special-label" style={{ color: '#1565c0' }}>Frozen Food</div>
                                                <div className="catalog-special-title" style={{ fontSize: 18 }}>Homemade, Siap Masak</div>
                                            </div>
                                        </div>
                                        <div className="catalog-hscroll" id="exploreFrozenRow" style={{ padding: '16px 0' }}>
                                            {frozenProducts.map((product) => (
                                                <div key={`fz-${product.id}`} className="product-card explore-special-card" onClick={() => window.location.href = `/produk/${product.id}`} style={{ cursor: 'pointer', flexShrink: 0, width: 200 }}>
                                                    <div className="product-img" style={{ height: '180px', background: 'var(--cream-dark)', position: 'relative' }}>
                                                        {product.thumbnail?.media_url ? (
                                                            <Image src={product.thumbnail.media_url} alt={product.name} fill style={{ objectFit: 'cover' }} />
                                                        ) : <div style={{ fontSize: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>🎁</div>}
                                                    </div>
                                                    <div className="product-body" style={{ padding: '14px' }}>
                                                        <div className="product-name" style={{ fontWeight: 700, height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                            {product.name}
                                                        </div>
                                                        <div className="product-shop" style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>
                                                            🏪 {product.store?.name || 'Toko UMKM'}
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <div style={{ color: 'var(--terracotta)', fontWeight: 800 }}>
                                                                {product.price?.formatted?.split(",")[0] || `Rp ${(product.price?.amount || 0).toLocaleString('id-ID')}`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {showMainProductsHeader && (
                                    <div>
                                        <div id="exploreMainProductsHeader" className="catalog-main-header explore-main-products-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                                            <div className="catalog-main-title" style={{ fontSize: '17px' }}>Produk Lainnya</div>
                                        </div>
                                        <div style={{ height: '1px', background: 'var(--cream-dark)', marginBottom: '20px' }} />
                                    </div>
                                )}

                                <div className="product-grid explore-main-products-grid" id="exploreProductsGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                                    {mainGridProducts.map((product: any) => (
                                        <div
                                            key={product.id}
                                            className="product-card explore-main-card"
                                            onClick={() => window.location.href = `/produk/${product.id}`}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="product-img" style={{ position: 'relative', height: '180px' }}>
                                                {product.thumbnail?.media_url ? (
                                                    <Image src={product.thumbnail.media_url} alt={product.name} fill style={{ objectFit: 'cover' }} />
                                                ) : <div style={{ fontSize: '40px' }}>🎁</div>}
                                            </div>
                                            <div className="product-body" style={{ padding: '14px' }}>
                                                <div className="product-name" style={{ fontSize: '14px', fontWeight: 600, height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                    {product.name}
                                                </div>
                                                <div className="product-shop" style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>
                                                    🏪 {product.store?.name || 'Toko UMKM'}
                                                </div>
                                            </div>
                                            {/* Price + WA */}
                                            <div style={{ padding: '10px 14px 14px', borderTop: '1px solid var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--terracotta)' }}>
                                                        {product.price?.formatted?.split(",")[0] || `Rp ${(product.price?.amount || 0).toLocaleString('id-ID')}`}
                                                    </div>
                                                    <div style={{ fontSize: '11px', color: '#666', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                        <span style={{ color: '#F1C40F', fontSize: '12px' }}>★</span>
                                                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{product.rating_avg || '5.0'}</span>
                                                        <span>·</span>
                                                        <span>({product.sold_count || 0})</span>
                                                    </div>
                                                </div>
                                                <button
                                                    title="Pesan via WhatsApp"
                                                    style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#25D366', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, boxShadow: '0 2px 8px rgba(37,211,102,0.35)' }}
                                                    onClick={e => { e.stopPropagation(); handleWhatsAppClick(product); }}
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={WA_SVG} /></svg>
                                                </button>
                                            </div>
                                        </div>
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
