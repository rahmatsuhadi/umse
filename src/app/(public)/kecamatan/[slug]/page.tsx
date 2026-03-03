'use client';

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import ContactSection from "@/components/landing/Contact";
import { useCategories } from "@/features/categories/hooks";
import { useDistricts } from "@/features/locations/hooks";
import { useInfiniteProducts, useProducts } from "@/features/products/hooks";
import { useInfiniteStores } from "@/features/store/hooks";
import Link from "next/link";
import Image from "next/image";
import { MerchantCard } from "@/components/stores/MerchantCard";
import type { Product, Store, Category } from "@/types";

type TabKey = "semua" | "fast-food" | "frozen-food" | "toko";

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
  type DistrictLite = { id: string | number; name: string; products_count?: number; logo?: string | null; };
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

  // ─── Helpers ───
  const getMediaUrl = (p: Product) =>
    p?.media?.[0]?.media_url || p?.thumbnail?.media_url || "/assets/no-image.jpg";

  const getPrice = (p: Product) => {
    const priceObj = p?.variants_exists ? p?.lowest_price : p?.price;
    return priceObj?.formatted?.split(",")[0] || `Rp ${(priceObj?.value || 0).toLocaleString("id-ID")}`;
  };

  // A product is "unavailable" when stock is out (store open/close not in API, use stock_status)
  const isUnavailable = (p: Product) => p?.stock_status === "out_of_stock";

  // ─── Mini product card for horizontal scroll sections ───
  const KecProdCard = ({ p }: { p: Product }) => {
    const unavailable = isUnavailable(p);
    return (
      <Link
        href={`/produk/${p.id}`}
        style={{ textDecoration: "none", opacity: unavailable ? 0.65 : 1 }}
      >
        <div
          className="kec-prod-card"
          style={{ filter: unavailable ? "grayscale(60%)" : "none" }}
        >
          <div className="kec-prod-img">
            <Image
              src={getMediaUrl(p)}
              alt={p.name}
              width={180}
              height={140}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {unavailable && (
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(0,0,0,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{
                  background: "rgba(0,0,0,0.75)", color: "white",
                  fontSize: 11, fontWeight: 800, padding: "4px 10px",
                  borderRadius: 20, border: "1.5px solid rgba(255,255,255,0.2)",
                }}>Stok Habis</span>
              </div>
            )}
          </div>
          <div className="kec-prod-body">
            <div className="kec-prod-name">{p.name}</div>
            {p.store?.name && <div className="kec-prod-shop">🏪 {p.store.name}</div>}
            <div className="kec-prod-footer">
              <div className="kec-prod-price">{getPrice(p)}</div>
              <div
                className="kec-prod-wa"
                style={unavailable ? { background: "#bbb", boxShadow: "none", cursor: "not-allowed" } : {}}
              >
                💬
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  // ─── Skeleton placeholders for scroll rows ───
  const SkeletonProdCards = ({ count = 5 }: { count?: number }) => (
    <>
      {Array(count).fill(null).map((_, i) => (
        <div key={i} className="kec-prod-card" style={{ opacity: 0.5, pointerEvents: "none" }}>
          <div className="kec-prod-img" style={{ background: "var(--cream-dark)" }} />
          <div className="kec-prod-body">
            <div className="kec-prod-name" style={{ height: 28, background: "var(--cream-dark)", borderRadius: 4 }} />
            <div className="kec-prod-shop" style={{ height: 14, background: "var(--cream-dark)", borderRadius: 4, width: "60%" }} />
            <div className="kec-prod-footer">
              <div style={{ width: 60, height: 16, background: "var(--cream-dark)", borderRadius: 4 }} />
              <div className="kec-prod-wa" style={{ background: "var(--cream-dark)" }} />
            </div>
          </div>
        </div>
      ))}
    </>
  );

  // ─── Full product grid (for Fast Food / Frozen Food tabs) ───
  const KecAllGrid = ({ products, loading }: { products: Product[]; loading: boolean }) => {
    if (loading) {
      return (
        <div className="kec-all-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="kec-prod-card" style={{ opacity: 0.5, pointerEvents: "none" }}>
              <div className="kec-prod-img" style={{ height: 140, background: "var(--cream-dark)" }} />
              <div className="kec-prod-body">
                <div style={{ height: 28, background: "var(--cream-dark)", borderRadius: 4, marginBottom: 6 }} />
                <div style={{ height: 14, background: "var(--cream-dark)", borderRadius: 4, width: "60%", marginBottom: 6 }} />
                <div style={{ height: 14, background: "var(--cream-dark)", borderRadius: 4, width: "40%" }} />
              </div>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="kec-all-grid">
        {products.map((p: Product) => (
          <KecProdCard key={p.id} p={p} />
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
            <div key={i} className="merchant-card" style={{ pointerEvents: "none" }}>
              <div className="merchant-card-cover" style={{ background: "var(--cream-dark)" }} />
              <div className="merchant-card-body">
                <div className="merchant-avatar-overlap" style={{ background: "var(--cream-dark)" }} />
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
          <div className="kec-empty-text">Belum ada toko di kecamatan ini</div>
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
    activeTab === "semua" || activeTab === "fast-food" || activeTab === "frozen-food";

  return (
    <div style={{ background: "var(--cream)" }}>
      <Navbar />
      <main>

        {/* ── HERO ── */}
        <div className="kec-hero">
          <div className="kec-hero-inner">
            <button onClick={() => history.back()} className="kec-back-btn">
              ← Kembali ke Beranda
            </button>
            <div className="kec-hero-row">
              <div className="kec-icon-big" style={{ background: "#E2F0D4", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: district?.logo ? 0 : undefined }}>
                {district?.logo ? (
                  <Image src={district.logo} alt={`Logo Kecamatan ${district?.name || nameFromSlug || id}`} fill style={{ objectFit: "cover" }} />
                ) : (
                  "🌿"
                )}
              </div>
              <div className="kec-hero-text">
                <h1>Kecamatan {district?.name || nameFromSlug || id}</h1>
                <p>Kecamatan di Kabupaten Sleman, D.I. Yogyakarta</p>
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
              className={`kec-tab${activeTab === "toko" ? " active" : ""}`}
              onClick={() => setActiveTab("toko")}
            >
              🏪 Toko
            </button>

            <div className="kec-toolbar-right" style={{ gap: 12 }}>
              {showCategoryFilter && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
                    Kategori:
                  </span>
                  <select
                    className="kec-sort-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={{ minWidth: 120 }}
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
                  <div className="kec-special-icon" style={{ background: "#FFF3E0" }}>🍔</div>
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
                    <SkeletonProdCards count={5} />
                  ) : fastFoodPreview.length === 0 ? (
                    <div className="kec-empty" style={{ padding: "28px 20px", width: "100%" }}>
                      <div className="kec-empty-icon">🍔</div>
                      <div className="kec-empty-text">Belum ada fast food di kecamatan ini</div>
                    </div>
                  ) : (
                    fastFoodPreview.map((p: Product) => <KecProdCard key={p.id} p={p} />)
                  )}
                </div>
              </div>

              {/* Frozen Food Section */}
              <div className="kec-special-section">
                <div className="kec-special-header">
                  <div className="kec-special-icon" style={{ background: "#E3F2FD" }}>🧊</div>
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
                    <SkeletonProdCards count={5} />
                  ) : frozenPreview.length === 0 ? (
                    <div className="kec-empty" style={{ padding: "28px 20px", width: "100%" }}>
                      <div className="kec-empty-icon">🧊</div>
                      <div className="kec-empty-text">Belum ada frozen food di kecamatan ini</div>
                    </div>
                  ) : (
                    frozenPreview.map((p: Product) => <KecProdCard key={p.id} p={p} />)
                  )}
                </div>
              </div>

              {/* Semua Produk — horizontal scroll (same behavior as Fast Food / Frozen Food) */}
              <div className="kec-special-section">
                <div className="kec-special-header">
                  <div className="kec-special-icon" style={{ background: "#E2F0D4" }}>🛍️</div>
                  <div>
                    <div className="kec-special-title">
                      Semua Produk
                      {productsTotal ? (
                        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)", marginLeft: 8 }}>
                          ({productsTotal} produk)
                        </span>
                      ) : null}
                    </div>
                    <div className="kec-special-sub">Semua kategori produk dari kecamatan ini</div>
                  </div>
                </div>
                <div className="kec-scroll-row">
                  {isLoadingAll ? (
                    <SkeletonProdCards count={5} />
                  ) : allGridProducts.length === 0 ? (
                    <div className="kec-empty" style={{ padding: "28px 20px", width: "100%" }}>
                      <div className="kec-empty-icon">🛍️</div>
                      <div className="kec-empty-text">Belum ada produk di kecamatan ini</div>
                    </div>
                  ) : (
                    allGridProducts.map((p: Product) => <KecProdCard key={p.id} p={p} />)
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
                  <div className="kec-empty-text">Belum ada fast food di kecamatan ini</div>
                </div>
              ) : (
                <>
                  <KecAllGrid products={fastFoodGridProducts} loading={false} />
                  {isFetchingMoreFastFood && (
                    <div style={{ textAlign: "center", padding: "16px", color: "var(--text-muted)" }}>Memuat...</div>
                  )}
                  {hasMoreFastFood && !isFetchingMoreFastFood && (
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
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
                  <div className="kec-empty-text">Belum ada frozen food di kecamatan ini</div>
                </div>
              ) : (
                <>
                  <KecAllGrid products={frozenGridProducts} loading={false} />
                  {isFetchingMoreFrozen && (
                    <div style={{ textAlign: "center", padding: "16px", color: "var(--text-muted)" }}>Memuat...</div>
                  )}
                  {hasMoreFrozen && !isFetchingMoreFrozen && (
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                      <button className="kec-filter-chip" onClick={() => fetchNextFrozen()}>
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
                <div style={{ textAlign: "center", padding: "16px", color: "var(--text-muted)" }}>Memuat...</div>
              )}
              {hasMoreStores && !isFetchingMoreStores && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
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
