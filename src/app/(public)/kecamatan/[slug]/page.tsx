'use client';

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import ContactSection from "@/components/landing/Contact";
import { useCategories } from "@/features/categories/hooks";
import { useDistricts } from "@/features/locations/hooks";
import { useInfiniteProducts, useProducts } from "@/features/products/hooks";
import { useInfiniteStores } from "@/features/store/hooks";

import Image from "next/image";
import { MerchantCard } from "@/components/stores/MerchantCard";
import { ProductCard, SkeletonProductCard } from "@/components/shared/ProductCard";
import { ServiceCard, SkeletonServiceCard } from "@/components/shared/ServiceCard";
import { TopService } from "@/components/home/TopService";
import type { Product, Store, Category } from "@/types";

type TabKey = "semua" | "fast-food" | "frozen-food" | "service" | "toko";

export default function KecamatanDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const id = useMemo(() => {
    const idx = slug.lastIndexOf("~");
    return idx >= 0 ? slug.slice(idx + 1) : slug;
  }, [slug]);

  const nameFromSlug = useMemo(() => {
    const idx = slug.lastIndexOf("~");
    return idx >= 0 ? slug.slice(0, idx).replace(/-/g, " ") : undefined;
  }, [slug]);

  const [activeTab, setActiveTab] = useState<TabKey>("semua");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rating");

  // ─── District info ───
  const { data: districtsData } = useDistricts("3404");
  type DistrictLite = { id: string | number; name: string; products_count?: number; logo?: string | null; icon?: string | null; emoji?: string | null; };
  const district = useMemo(() => {
    const all = (districtsData?.data || []) as DistrictLite[];
    return all.find((d) => String(d.id) === String(id));
  }, [districtsData, id]);

  const sortParam =
    sortBy === "sold" ? "-sold_count"
      : sortBy === "price-asc" ? "price"
        : sortBy === "price-desc" ? "-price"
          : sortBy === "name" ? "name"
            : "-average_rating";

  // ─── STAT: Total all products in this district (no extra filters, just district_id) ───
  // We only need the total from meta; per_page=1 is enough to get meta.total
  const { data: allProductsStatData } = useProducts({
    per_page: 1,
    filter: { district_id: id },
  });
  const productsTotal = allProductsStatData?.meta?.total ?? district?.products_count ?? 0;

  // ─── STAT: Fast Food total (is_ready_to_serve=1) ───
  const { data: fastFoodStatData } = useProducts({
    per_page: 1,
    filter: { district_id: id, is_ready_to_serve: 1 },
  });
  const fastFoodTotal = fastFoodStatData?.meta?.total ?? 0;

  // ─── STAT: Frozen Food total (is_frozen=1) ───
  const { data: frozenStatData } = useProducts({
    per_page: 1,
    filter: { district_id: id, is_frozen: 1 },
  });
  const frozenTotal = frozenStatData?.meta?.total ?? 0;

  // ─── STAT: Jasa total (type=service) ───
  const { data: serviceStatData } = useProducts({
    per_page: 1,
    filter: { district_id: id, type: 'service' },
  });
  const serviceTotal = serviceStatData?.meta?.total ?? 0;

  // ─── SEMUA TAB: Fast Food preview scroll (up to 10) ───
  const { data: fastFoodPreviewData, isLoading: isLoadingFFPreview } = useProducts({
    per_page: 10,
    filter: { district_id: id, is_ready_to_serve: 1 },
    sort: sortParam,
  });
  const fastFoodPreview: Product[] = (fastFoodPreviewData?.data as Product[]) || [];

  // ─── SEMUA TAB: Frozen Food preview scroll (up to 10) ───
  const { data: frozenPreviewData, isLoading: isLoadingFrozenPreview } = useProducts({
    per_page: 10,
    filter: { district_id: id, is_frozen: 1 },
    sort: sortParam,
  });
  const frozenPreview: Product[] = (frozenPreviewData?.data as Product[]) || [];

  // (otherPreview removed — Semua Produk section uses allGridProducts with infinite scroll)

  // ─── FAST FOOD TAB: infinite scroll ───
  const {
    data: fastFoodInfiniteData,
    fetchNextPage: fetchNextFastFood,
    hasNextPage: hasMoreFastFood,
    isFetchingNextPage: isFetchingMoreFastFood,
    isLoading: isLoadingFastFoodGrid,
  } = useInfiniteProducts({
    filter: {
      district_id: id,
      is_ready_to_serve: 1,
      ...(categoryFilter !== "all" ? { category__slug: categoryFilter } : {}),
    },
    sort: sortParam,
    per_page: 12,
  });
  const fastFoodGridProducts: Product[] =
    fastFoodInfiniteData?.pages.flatMap((p) => p.data as Product[]) || [];

  // ─── FROZEN FOOD TAB: infinite scroll ───
  const {
    data: frozenInfiniteData,
    fetchNextPage: fetchNextFrozen,
    hasNextPage: hasMoreFrozen,
    isFetchingNextPage: isFetchingMoreFrozen,
    isLoading: isLoadingFrozenGrid,
  } = useInfiniteProducts({
    filter: {
      district_id: id,
      is_frozen: 1,
      ...(categoryFilter !== "all" ? { category__slug: categoryFilter } : {}),
    },
    sort: sortParam,
    per_page: 12,
  });
  const frozenGridProducts: Product[] =
    frozenInfiniteData?.pages.flatMap((p) => p.data as Product[]) || [];

  // ─── SERVICE TAB: infinite scroll ───
  const {
    data: serviceInfiniteData,
    fetchNextPage: fetchNextService,
    hasNextPage: hasMoreService,
    isFetchingNextPage: isFetchingMoreService,
    isLoading: isLoadingServiceGrid,
  } = useInfiniteProducts({
    filter: {
      district_id: id,
      type: 'service',
      ...(categoryFilter !== "all" ? { category__slug: categoryFilter } : {}),
    },
    sort: sortParam,
    per_page: 12,
  });
  const serviceGridProducts: Product[] =
    serviceInfiniteData?.pages.flatMap((p) => p.data as Product[]) || [];

  // ─── SEMUA (all) TAB when category filter is applied OR for tab-based browsing ───
  const {
    data: allProductsData,
    isLoading: isLoadingAll,
  } = useInfiniteProducts({
    filter: {
      district_id: id,
      ...(categoryFilter !== "all" ? { category__slug: categoryFilter } : {}),
    },
    sort: sortParam,
    per_page: 12,
  });
  const allGridProducts: Product[] =
    allProductsData?.pages.flatMap((p) => p.data as Product[]) || [];

  // ─── Stores ───
  const {
    data: storesData,
    fetchNextPage: fetchNextStores,
    hasNextPage: hasMoreStores,
    isFetchingNextPage: isFetchingMoreStores,
    isLoading: isLoadingStores,
  } = useInfiniteStores({
    filter: { district_id: id },
    sort: "-average_rating",
    per_page: 12,
  });
  const stores: Store[] = storesData?.pages.flatMap((p) => p.data as Store[]) || [];
  const storesTotal = storesData?.pages?.[0]?.meta?.total ?? stores.length;

  // ─── Categories ───
  const { data: categoriesData } = useCategories();
  const categories = (categoriesData?.data || []) as Category[];

  // ─── Full product grid (for Fast Food / Frozen Food tabs) ───
  const KecAllGrid = ({ products, loading }: { products: Product[]; loading: boolean }) => {
    if (loading) {
      return (
        <div className="kec-all-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonProductCard key={i} />
          ))}
        </div>
      );
    }
    return (
      <div className="kec-all-grid">
        {products.map((p: Product) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    );
  };

  // ─── Full service grid ───
  const KecServiceGrid = ({ products, loading }: { products: Product[]; loading: boolean }) => {
    if (loading) {
      return (
        <div className="kec-all-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonServiceCard key={i} />
          ))}
        </div>
      );
    }
    return (
      <div className="kec-all-grid">
        {products.map((p: Product) => (
          <ServiceCard key={p.id} product={p} />
        ))}
      </div>
    );
  };

  // ─── Stores grid ───
  const renderStoresGrid = () => {
    if (isLoadingStores) {
      return (
        <div className="kec-merchant-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="merchant-card pointer-events-none">
              <div className="merchant-card-cover bg-cream-dark" />
              <div className="merchant-card-body">
                <div className="merchant-avatar-overlap bg-cream-dark" />
                <div style={{ height: 18, background: "var(--cream-dark)", borderRadius: 6, marginBottom: 8, width: "70%" }} />
                <div style={{ height: 12, background: "var(--cream-dark)", borderRadius: 6, width: "50%" }} />
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (stores.length === 0) {
      return (
        <div className="kec-empty">
          <div className="kec-empty-icon">🏪</div>
          <div className="kec-empty-text">Belum ada toko di pakanewon ini</div>
        </div>
      );
    }
    return (
      <div className="kec-merchant-grid">
        {stores.map((store: Store) => (
          <MerchantCard key={store.id} store={store} />
        ))}
      </div>
    );
  };

  const showCategoryFilter =
    activeTab === "semua" || activeTab === "fast-food" || activeTab === "frozen-food" || activeTab === "service";

  return (
    <div className="bg-cream">
      <Navbar />
      <main>

        {/* ── HERO ── */}
        <div className="kec-hero">
          <div className="kec-hero-inner">
            <button onClick={() => history.back()} className="kec-back-btn">
              ← Kembali ke Beranda
            </button>
            <div className="kec-hero-row">
              <div className="kec-icon-big" style={{ position: "relative", background: "#ffffffff", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: district?.logo ? 0 : undefined }}>
                {district?.logo && (
                  <Image src={district.logo} alt={`Logo Kecamatan ${district?.name || nameFromSlug || id}`} width={100} height={100} className="w-full h-full object-cover" />
                )}
                {!district?.logo && (district?.icon || district?.emoji || "🌿")}
              </div>
              <div className="kec-hero-text">
                <h1>Kapanewon {district?.name || nameFromSlug || id}</h1>
                <p>Kapanewon di Kabupaten Sleman, D.I. Yogyakarta</p>
              </div>
            </div>
            <div className="kec-stats-row">
              <div className="kec-stat">
                <div className="kec-stat-value">{storesTotal || "–"}</div>
                <div className="kec-stat-label">Toko Aktif</div>
              </div>
              <div className="kec-stat">
                <div className="kec-stat-value">{productsTotal || "–"}</div>
                <div className="kec-stat-label">Produk</div>
              </div>
              <div className="kec-stat">
                <div className="kec-stat-value">{fastFoodTotal || "–"}</div>
                <div className="kec-stat-label">Fast Food</div>
              </div>
              <div className="kec-stat">
                <div className="kec-stat-value">{frozenTotal || "–"}</div>
                <div className="kec-stat-label">Frozen Food</div>
              </div>

              <div className="kec-stat">
                <div className="kec-stat-value">{serviceTotal || "–"}</div>
                <div className="kec-stat-label">Jasa</div>
              </div>

            </div>
          </div>
        </div>

        {/* ── STICKY TAB TOOLBAR ── */}
        <div className="kec-toolbar">
          <div className="kec-toolbar-inner">
            <button
              className={`kec-tab${activeTab === "semua" ? " active" : ""}`}
              onClick={() => setActiveTab("semua")}
            >
              Semua Produk
            </button>
            <button
              className={`kec-tab${activeTab === "fast-food" ? " active" : ""}`}
              onClick={() => setActiveTab("fast-food")}
            >
              🍔 Fast Food
            </button>
            <button
              className={`kec-tab${activeTab === "frozen-food" ? " active" : ""}`}
              onClick={() => setActiveTab("frozen-food")}
            >
              🧊 Frozen Food
            </button>
            <button
              className={`kec-tab${activeTab === "service" ? " active" : ""}`}
              onClick={() => setActiveTab("service")}
            >
              🛠️ Jasa
            </button>
            <button
              className={`kec-tab${activeTab === "toko" ? " active" : ""}`}
              onClick={() => setActiveTab("toko")}
            >
              🏪 Toko
            </button>

            <div className="kec-toolbar-right gap-12">
              {showCategoryFilter && (
                <div className="flex-center gap-8">
                  <span className="text-muted fw-600 font-12">
                    Kategori:
                  </span>
                  <select
                    className="kec-sort-select min-w-120"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">Semua</option>
                    {categories.map((c: Category) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <select
                className="kec-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">⭐ Rating</option>
                <option value="sold">🔥 Terlaris</option>
                <option value="price-asc">💰 Harga Terendah</option>
                <option value="price-desc">💰 Harga Tertinggi</option>
                <option value="name">A–Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="kec-body">

          {/* ══ TAB: Semua ══ */}
          {activeTab === "semua" && (
            <div>
              {/* Fast Food Section */}
              <div className="kec-special-section">
                <div className="kec-special-header">
                  <div className="kec-special-icon bg-orange-light">🍔</div>
                  <div>
                    <div className="kec-special-title">Fast Food Lokal</div>
                    <div className="kec-special-sub">Makanan siap saji dari UMKM setempat</div>
                  </div>
                  <button className="kec-special-see-all" onClick={() => setActiveTab("fast-food")}>
                    Lihat Semua →
                  </button>
                </div>
                <div className="kec-scroll-row">
                  {isLoadingFFPreview ? (
                    Array(5).fill(null).map((_, i) => <SkeletonProductCard key={i} className="cat-card-scroll" />)
                  ) : fastFoodPreview.length === 0 ? (
                    <div className="kec-empty kec-empty-box">
                      <div className="kec-empty-icon">🍔</div>
                      <div className="kec-empty-text">Belum ada fast food di kapanewon ini</div>
                    </div>
                  ) : (
                    fastFoodPreview.map((p: Product) => <ProductCard key={p.id} product={p} className="cat-card-scroll" />)
                  )}
                </div>
              </div>

              {/* Frozen Food Section */}
              <div className="kec-special-section">
                <div className="kec-special-header">
                  <div className="kec-special-icon bg-blue-light">🧊</div>
                  <div>
                    <div className="kec-special-title">Frozen Food Homemade</div>
                    <div className="kec-special-sub">Produk beku siap masak dari dapur lokal</div>
                  </div>
                  <button className="kec-special-see-all" onClick={() => setActiveTab("frozen-food")}>
                    Lihat Semua →
                  </button>
                </div>
                <div className="kec-scroll-row">
                  {isLoadingFrozenPreview ? (
                    Array(5).fill(null).map((_, i) => <SkeletonProductCard key={i} className="cat-card-scroll" />)
                  ) : frozenPreview.length === 0 ? (
                    <div className="kec-empty kec-empty-box">
                      <div className="kec-empty-icon">🧊</div>
                      <div className="kec-empty-text">Belum ada frozen food di kapanewon ini</div>
                    </div>
                  ) : (
                    frozenPreview.map((p: Product) => <ProductCard key={p.id} product={p} className="cat-card-scroll" />)
                  )}
                </div>
              </div>

              <div style={{ marginLeft: -16, marginRight: -16 }}>
                <TopService districtId={id} />
              </div>

              {/* Semua Produk — horizontal scroll (same behavior as Fast Food / Frozen Food) */}
              <div className="kec-special-section">
                <div className="kec-special-header">
                  <div className="kec-special-icon bg-green-light">🛍️</div>
                  <div>
                    <div className="kec-special-title">
                      Semua Produk
                      {productsTotal ? (
                        <span className="text-muted fw-600 font-14 ml-8">
                          ({productsTotal} produk)
                        </span>
                      ) : null}
                    </div>
                    <div className="kec-special-sub">Semua kategori produk dari kapanewon ini</div>
                  </div>
                </div>
                <div className="kec-scroll-row">
                  {isLoadingAll ? (
                    Array(5).fill(null).map((_, i) => <SkeletonProductCard key={i} className="cat-card-scroll" />)
                  ) : allGridProducts.length === 0 ? (
                    <div className="kec-empty kec-empty-box">
                      <div className="kec-empty-icon">🛍️</div>
                      <div className="kec-empty-text">Belum ada produk di kapanewon ini</div>
                    </div>
                  ) : (
                    allGridProducts.map((p: Product) => <ProductCard key={p.id} product={p} className="cat-card-scroll" />)
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══ TAB: Fast Food ══ */}
          {activeTab === "fast-food" && (
            <div>
              {isLoadingFastFoodGrid ? (
                <KecAllGrid products={[]} loading />
              ) : fastFoodGridProducts.length === 0 ? (
                <div className="kec-empty">
                  <div className="kec-empty-icon">🍔</div>
                  <div className="kec-empty-text">Belum ada fast food di kapanewon ini</div>
                </div>
              ) : (
                <>
                  <KecAllGrid products={fastFoodGridProducts} loading={false} />
                  {isFetchingMoreFastFood && (
                    <div className="empty-state-msg">Memuat...</div>
                  )}
                  {hasMoreFastFood && !isFetchingMoreFastFood && (
                    <div className="flex-center mt-24">
                      <button className="kec-filter-chip" onClick={() => fetchNextFastFood()}>
                        Muat Lebih Banyak
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ══ TAB: Frozen Food ══ */}
          {activeTab === "frozen-food" && (
            <div>
              {isLoadingFrozenGrid ? (
                <KecAllGrid products={[]} loading />
              ) : frozenGridProducts.length === 0 ? (
                <div className="kec-empty">
                  <div className="kec-empty-icon">🧊</div>
                  <div className="kec-empty-text">Belum ada frozen food di kapanewon ini</div>
                </div>
              ) : (
                <>
                  <KecAllGrid products={frozenGridProducts} loading={false} />
                  {isFetchingMoreFrozen && (
                    <div className="empty-state-msg">Memuat...</div>
                  )}
                  {hasMoreFrozen && !isFetchingMoreFrozen && (
                    <div className="flex-center mt-24">
                      <button className="kec-filter-chip" onClick={() => fetchNextFrozen()}>
                        Muat Lebih Banyak
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ══ TAB: Jasa ══ */}
          {activeTab === "service" && (
            <div>
              {isLoadingServiceGrid ? (
                <KecServiceGrid products={[]} loading />
              ) : serviceGridProducts.length === 0 ? (
                <div className="kec-empty">
                  <div className="kec-empty-icon">🛠️</div>
                  <div className="kec-empty-text">Belum ada jasa di kapanewon ini</div>
                </div>
              ) : (
                <>
                  <KecServiceGrid products={serviceGridProducts} loading={false} />
                  {isFetchingMoreService && (
                    <div className="empty-state-msg">Memuat...</div>
                  )}
                  {hasMoreService && !isFetchingMoreService && (
                    <div className="flex-center mt-24">
                      <button className="kec-filter-chip" onClick={() => fetchNextService()}>
                        Muat Lebih Banyak
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ══ TAB: Toko ══ */}
          {activeTab === "toko" && (
            <div>
              {renderStoresGrid()}
              {isFetchingMoreStores && (
                <div className="empty-state-msg">Memuat...</div>
              )}
              {hasMoreStores && !isFetchingMoreStores && (
                <div className="flex-center mt-24">
                  <button className="kec-filter-chip" onClick={() => fetchNextStores()}>
                    Muat Lebih Banyak
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* ── Footer mini ── */}
        <div style={{
          background: "var(--brown-dark)", padding: "24px",
          textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.4)",
        }}>
          © 2025 Sleman Mart. Kabupaten Sleman, D.I. Yogyakarta
        </div>
      </main>
      <ContactSection />
    </div>
  );
}
