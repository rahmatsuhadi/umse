"use client";
import { useStores } from "@/features/store/hooks";
import { useDistricts } from "@/features/locations/hooks";
import { useState, useMemo } from "react";
import { MerchantCard } from "./MerchantCard";
import { Meta } from "@/types";

export default function MerchantsPage() {
    const [activeDistrict, setActiveDistrict] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("rating");
    const [page, setPage] = useState<number>(1);

    // Fetch districts for Sleman (regency id 3404)
    const { data: districtsData } = useDistricts("3404");
    const districts = districtsData?.data ?? [];

    // Build filter params
    const filterParams = useMemo(() => {
        const params: Record<string, string | number | undefined> = {};
        if (activeDistrict !== "all") {
            params["district_id"] = activeDistrict;
        }
        return params;
    }, [activeDistrict]);

    // Sort mapping
    const sortMapping: Record<string, string | undefined> = {
        rating: "-average_rating",
        products: "-products_count",
        name: "name",
        newest: "-created_at",
    };

    const { isLoading, data } = useStores({
        page,
        per_page: 12,
        filter: filterParams as Record<string, string | number | undefined>,
        sort: sortMapping[sortBy],
    });

    const stores = data?.data ?? [];
    const meta = data?.meta;
    const totalCount = meta?.total ?? stores.length;

    const handleDistrictClick = (districtId: string) => {
        setActiveDistrict(districtId);
        setPage(1);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
        setPage(1);
    };

    const handlePageChange = (p: number) => {
        setPage(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            {/* Hero Section */}
            <div className="merchants-hero">
                <div className="merchants-hero-inner">
                    <h1>
                        🏪 Merchant{" "}
                        <span style={{ color: "var(--terracotta)" }}>Sleman</span>
                    </h1>
                    <p>Ribuan UMKM terpercaya siap melayani kebutuhanmu</p>

                    {/* District filter chips */}
                    <div className="merchants-hero-filters">
                        <span
                            style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "var(--text-muted)",
                            }}
                        >
                            Filter Kapanewon:
                        </span>
                        <button
                            className={`filter-chip${activeDistrict === "all" ? " active" : ""}`}
                            onClick={() => handleDistrictClick("all")}
                        >
                            Semua
                        </button>
                        {districts.slice(0, 12).map((d) => (
                            <button
                                key={d.id}
                                className={`filter-chip${activeDistrict === String(d.id) ? " active" : ""}`}
                                onClick={() => handleDistrictClick(String(d.id))}
                            >
                                {d.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="merchants-body">
                {/* Sort bar */}
                <div className="merchants-sort">
                    <span className="merchants-count">
                        {isLoading
                            ? "Memuat toko…"
                            : `Menampilkan ${totalCount} toko`}
                    </span>
                    <div
                        style={{
                            marginLeft: "auto",
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                        }}
                    >
                        <label
                            style={{ fontSize: 13, color: "var(--text-muted)" }}
                        >
                            Urutkan:
                        </label>
                        <select
                            className="sort-select"
                            value={sortBy}
                            onChange={handleSortChange}
                        >
                            <option value="rating">Rating Tertinggi</option>
                            <option value="products">Produk Terbanyak</option>
                            <option value="name">Nama A-Z</option>
                            <option value="newest">Terbaru</option>
                        </select>
                    </div>
                </div>

                {/* Merchant Grid */}
                {isLoading ? (
                    <div className="merchant-grid-layout">
                        {[...Array(8)].map((_, i) => (
                            <MerchantCardSkeleton key={i} />
                        ))}
                    </div>
                ) : stores.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "80px 20px",
                            color: "var(--text-muted)",
                        }}
                    >
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🏪</div>
                        <p style={{ fontSize: 16 }}>
                            Belum ada toko di kapanewon ini.
                        </p>
                    </div>
                ) : (
                    <div className="merchant-grid-layout">
                        {stores.map((store) => (
                            <MerchantCard key={store.id} store={store} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {meta && <InlinePagination meta={meta} isLoading={isLoading} onPageChange={handlePageChange} />}
            </div>
        </>
    );
}

/* ── Skeleton Card ── */
function MerchantCardSkeleton() {
    return (
        <div className="merchant-card" style={{ pointerEvents: "none" }}>
            <div
                className="merchant-card-cover"
                style={{ background: "var(--cream-dark)" }}
            />
            <div className="merchant-card-body">
                <div
                    className="merchant-avatar-overlap"
                    style={{ background: "var(--cream-dark)" }}
                />
                <div style={{ height: 18, background: "var(--cream-dark)", borderRadius: 6, marginBottom: 8, width: "70%" }} />
                <div style={{ height: 12, background: "var(--cream-dark)", borderRadius: 6, marginBottom: 8, width: "50%" }} />
                <div style={{ height: 12, background: "var(--cream-dark)", borderRadius: 6, marginBottom: 4, width: "90%" }} />
                <div style={{ height: 12, background: "var(--cream-dark)", borderRadius: 6, marginBottom: 12, width: "60%" }} />
                <div className="merchant-stats" style={{ borderTop: "1px solid var(--cream-dark)", paddingTop: 12 }}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="merchant-stat">
                            <div style={{ height: 16, background: "var(--cream-dark)", borderRadius: 4, marginBottom: 4 }} />
                            <div style={{ height: 11, background: "var(--cream-dark)", borderRadius: 4, width: "60%", margin: "0 auto" }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ── Inline Pagination ── */
function InlinePagination({
    meta,
    isLoading,
    onPageChange,
}: {
    meta: Meta;
    isLoading: boolean;
    onPageChange: (page: number) => void;
}) {
    if (isLoading || meta.last_page <= 1) return null;

    const pages = Array.from({ length: meta.last_page }, (_, i) => i + 1);

    return (
        <div style={{ marginTop: 32, display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            <button
                onClick={() => onPageChange(meta.current_page - 1)}
                disabled={meta.current_page === 1}
                className="filter-chip"
                style={{ borderRadius: "var(--radius-sm)", minWidth: 40 }}
            >
                ‹ Sebelumnya
            </button>

            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`filter-chip${meta.current_page === p ? " active" : ""}`}
                    style={{ borderRadius: "var(--radius-sm)", minWidth: 40 }}
                >
                    {p}
                </button>
            ))}

            <button
                onClick={() => onPageChange(meta.current_page + 1)}
                disabled={meta.current_page === meta.last_page}
                className="filter-chip"
                style={{ borderRadius: "var(--radius-sm)", minWidth: 40 }}
            >
                Berikutnya ›
            </button>
        </div>
    );
}
