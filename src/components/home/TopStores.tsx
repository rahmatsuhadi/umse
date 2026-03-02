"use client";

import { usePaginationStores } from "@/features/store/hooks";
import Link from "next/link";

const Skeleton = () => (
    <div className="merchant-card-mini" style={{ opacity: 0.7, pointerEvents: "none" }}>
        <div className="merchant-avatar" style={{ background: "#F5E9E2", animation: "pulse 1.5s infinite" }} />
        <div className="merchant-mini-info" style={{ width: "100%" }}>
            <div className="name" style={{ height: 14, width: "80%", background: "#F5E9E2", marginBottom: 6, borderRadius: 4 }} />
            <div className="area" style={{ height: 12, width: "50%", background: "#F5E9E2", borderRadius: 4 }} />
        </div>
    </div>
);

const STORE_ICONS = ["🍜", "🎨", "☕", "🛍️", "🎋", "🌿", "🥮", "🍃"];
const STORE_COLORS = [
    "#FDE8D8", "#FEF3D0", "#D4EFDF", "#E8F4FD", "#F3E8FF", "#FFF0E8",
];

export function TopStores() {
    const { isLoading, data } = usePaginationStores(1);
    const stores = data?.data?.slice(0, 8) ?? [];

    return (
        <section className="section" style={{ paddingTop: 48, paddingBottom: 48 }}>
            <div className="container">
                <div className="section-header" style={{ marginBottom: 20 }}>
                    <div>
                        <h2 className="section-title">Toko <span>Pilihan</span></h2>
                        <p className="section-subtitle">UMKM terpercaya dan aktif</p>
                    </div>
                    <Link href="/umkm" className="see-all-link">Semua →</Link>
                </div>

                <div className="top-card-scroll">
                    <div className="top-card-list">
                        {isLoading
                            ? Array(5).fill(null).map((_, i) => <Skeleton key={i} />)
                            : stores.map((store, i) => (
                                <Link
                                    key={store.id ?? i}
                                    href={`/umkm/${store.id}`}
                                    style={{ textDecoration: "none", display: "flex" }}
                                    className="merchant-card-mini"
                                >
                                    <div
                                        className="merchant-avatar"
                                        style={{ background: STORE_COLORS[i % STORE_COLORS.length], overflow: "hidden", padding: 0 }}
                                    >
                                        {store.logo_url ? (
                                            <img src={store.logo_url} alt={store.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }} />
                                        ) : (
                                            STORE_ICONS[i % STORE_ICONS.length]
                                        )}
                                    </div>
                                    <div className="merchant-mini-info">
                                        <div className="name">{store.name}</div>
                                        <div className="area">📍 {store.district?.name || "Sleman"}</div>
                                        <div className="rating">★ {Number(store.average_rating || 0).toFixed(1)}</div>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>
            <style>{`
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: .5; }
            }
            `}</style>
        </section >
    );
}
