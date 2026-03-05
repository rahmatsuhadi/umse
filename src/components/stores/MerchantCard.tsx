"use client";
import { Store } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useWebSettings } from "@/features/settings/hooks";

interface MerchantCardProps {
    store: Store;
}

// Deterministic soft pastel cover gradients
const COVER_GRADIENTS = [
    "linear-gradient(135deg, #E2F0D4 0%, #A8D5B5 100%)",
    "linear-gradient(135deg, #FEF3D0 0%, #F5D08A 100%)",
    "linear-gradient(135deg, #FDE8E2 0%, #F5A881 100%)",
    "linear-gradient(135deg, #EDE7F6 0%, #C5B3E0 100%)",
    "linear-gradient(135deg, #E0F2F1 0%, #80CBC4 100%)",
    "linear-gradient(135deg, #FFF3E0 0%, #FFCC80 100%)",
    "linear-gradient(135deg, #E8EAF6 0%, #9FA8DA 100%)",
    "linear-gradient(135deg, #FCE4EC 0%, #F48FB1 100%)",
];

export function MerchantCard({ store }: MerchantCardProps) {
    const { data: webSettings } = useWebSettings();
    const settings = webSettings?.data;

    // Deterministic cover gradient based on store id character sum
    const idSum = store.id
        ? store.id.toString().split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
        : 0;
    const coverIdx = idSum % COVER_GRADIENTS.length;
    const coverGradient = COVER_GRADIENTS[coverIdx];

    const districtName = store.district?.name ?? "";

    return (
        <Link href={`/umkm/${store.id}`} className="block">
            <div className="merchant-card">
                {/* Cover */}
                <div
                    className="merchant-card-cover"
                    style={{ background: coverGradient, overflow: "hidden" }}
                >
                    {/* Decorative batik-like pattern */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage:
                                "repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 22px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 22px)",
                        }}
                    />
                </div>

                {/* Body */}
                <div className="merchant-card-body">
                    {/* Overlapping avatar */}
                    <div
                        className="merchant-avatar-overlap"
                        style={{ overflow: "hidden", padding: 0, background: "var(--cream-dark)" }}
                    >
                        <Image
                            src={store.logo_url || settings?.site_identity?.logo_url || "/slemanmartlogo.png"}
                            alt={store.name}
                            width={64}
                            height={64}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "calc(var(--radius-md) - 3px)",
                            }}
                        />
                    </div>

                    <div className="merchant-card-name">{store.name}</div>

                    {districtName && (
                        <div className="merchant-card-area">
                            <span>📍</span> {districtName}, Sleman
                        </div>
                    )}

                    {store.description && (
                        <div
                            className="merchant-card-desc"
                            style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {store.description}
                        </div>
                    )}

                    {/* Badge: brand_name as speciality tag if available */}
                    {store.brand_name && store.brand_name !== store.name && (
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                            <span className="badge badge-forest" style={{ fontSize: 11 }}>
                                {store.brand_name}
                            </span>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="merchant-stats">
                        <div className="merchant-stat">
                            <div className="value">
                                ⭐{" "}
                                {store.average_rating
                                    ? Number(store.average_rating).toFixed(1)
                                    : "—"}
                            </div>
                            <div className="label">Rating</div>
                        </div>
                        <div className="merchant-stat">
                            <div className="value">{store.products_count ?? 0}</div>
                            <div className="label">Produk</div>
                        </div>
                        <div className="merchant-stat">
                            <div className="value">
                                <span
                                    className="badge badge-forest"
                                    style={{ fontSize: 10, padding: "2px 8px" }}
                                >
                                    ✓ Verified
                                </span>
                            </div>
                            <div className="label">Status</div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
