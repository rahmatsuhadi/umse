"use client";

import Link from "next/link";
import Image from "next/image";
import { useDistricts } from "@/features/locations/hooks";
import { useProducts } from "@/features/products/hooks";

const ICONS = ["🏢", "🏛️", "🌳", "🛤️", "🗿", "⛰️", "🌿", "🌻", "🌾", "🏔️", "🌴", "🎋", "🏡", "🌺", "🎯", "🏞️", "🗺️"];
const ICON_COLORS = [
    { bg: "#FDE8D8", text: "#D45508" },
    { bg: "#FEF3D0", text: "#9B6E00" },
    { bg: "#D4EFDF", text: "#219653" },
    { bg: "#E8F4FD", text: "#1A6FA0" },
    { bg: "#F3E8FF", text: "#7C3AED" },
    { bg: "#FFF0E8", text: "#D45508" },
];

const getIcon = (i: number) => ICONS[i % ICONS.length];
const getColor = (i: number) => ICON_COLORS[i % ICON_COLORS.length];

// Build a slug the same way the kecamatan detail page resolves it
const buildSlug = (name: string, id: string | number) =>
    String(name || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") + `~${id}`;

function SubdistrictCard({
    districtId,
    name,
    index,
    logo,
    icon,
}: {
    districtId: string | number;
    name: string;
    index: number;
    logo?: string | null;
    icon?: string | null;
}) {
    const col = getColor(index);
    const slug = buildSlug(name, districtId);

    const { data, isLoading } = useProducts({
        per_page: 1,
        filter: { district_id: String(districtId) },
    });

    const productCount = data?.meta?.total ?? 0;

    return (
        <Link
            href={`/kecamatan/${slug}`}
            style={{ textDecoration: "none" }}
            className="subdistrict-card"
        >
            <div className="subdistrict-icon" style={{ position: "relative", background: col.bg, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: logo ? 0 : undefined }}>
                {logo && (
                    <Image src={logo} alt={`Logo ${name}`} width={100} height={100} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
                {!logo && (icon || getIcon(index))}
            </div>
            <div className="subdistrict-name">{name}</div>
            <div className="subdistrict-count">
                {isLoading ? (
                    <span style={{ display: "inline-block", width: 40, height: 12, background: "#F5E9E2", borderRadius: 4, verticalAlign: "middle" }} />
                ) : (
                    `${productCount} produk`
                )}
            </div>
        </Link>
    );
}

const SubdistrictSkeleton = () => (
    <div className="subdistrict-card" style={{ opacity: 0.7, pointerEvents: "none" }}>
        <div className="subdistrict-icon" style={{ background: "#F5E9E2", animation: "pulse 1.5s infinite" }}></div>
        <div className="subdistrict-name" style={{ height: 14, width: "70%", background: "#F5E9E2", margin: "10px auto", borderRadius: 4 }}></div>
        <div className="subdistrict-count" style={{ height: 12, width: "40%", background: "#F5E9E2", margin: "0 auto", borderRadius: 4 }}></div>
    </div>
);

export function Subdistricts() {
    const { data, isLoading } = useDistricts("3404");
    const subdistricts = data?.data || [];

    return (
        <section className="section">
            <div className="container">
                <div className="section-header">
                    <div>
                        <h2 className="section-title">Jelajahi per <span>Kecamatan</span></h2>
                        {isLoading ? (
                            <div style={{ height: 20, width: 200, background: "#F5E9E2", borderRadius: 4, marginTop: 6, animation: "pulse 1.5s infinite" }} />
                        ) : (
                            <p className="section-subtitle">{subdistricts.length} kecamatan, ratusan UMKM siap melayani</p>
                        )}
                    </div>
                    <Link href="/umkm" className="see-all-link">Lihat Semua →</Link>
                </div>

                <div className="subdistrict-grid">
                    {isLoading
                        ? Array(8).fill(null).map((_, i) => <SubdistrictSkeleton key={i} />)
                        : subdistricts.slice(0, 17).map((item, index) => {
                            return (
                                <SubdistrictCard
                                    key={item.id}
                                    districtId={item.id}
                                    name={item.name}
                                    index={index}
                                    logo={item.logo}
                                    icon={(item as { icon?: string | null, emoji?: string | null }).icon || (item as { icon?: string | null, emoji?: string | null }).emoji || undefined}
                                />
                            );
                        })}
                </div>
            </div>

            <style>{`
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: .5; }
            }
            `}</style>
        </section>
    );
}
