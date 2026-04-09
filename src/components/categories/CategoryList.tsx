"use client";

import { useCategories } from "@/features/categories/hooks";
import Image from "next/image";
import Link from "next/link";

const ICON_COLORS = [
  "#FDE8D8", "#FEF3D0", "#D4EFDF", "#E8F4FD",
  "#F3E8FF", "#FFF0E8", "#D4EFDF", "#FDE8D8",
  "#FEF9E0", "#E8F4FD", "#F0E8FF", "#E8FFE8",
];

const SkeletonCard = () => (
  <div className="category-card" style={{ opacity: 0.7, pointerEvents: "none" }}>
    <div
      className="category-icon-wrap"
      style={{
        background: "#F5E9E2",
        animation: "pulse 1.5s infinite",
      }}
    />
    <div className="category-name" style={{ height: 14, width: "80%", background: "#F5E9E2", margin: "10px auto 6px", borderRadius: 4 }} />
    <div className="category-count" style={{ height: 12, width: "50%", background: "#F5E9E2", margin: "0 auto", borderRadius: 4 }} />
  </div>
);

export default function CategoryList() {
  const { data, isLoading } = useCategories();
  const categories = data?.data || [];

  return (
    <section className="section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div>
            <h2 className="section-title">Kategori <span>Produk</span></h2>
            <p className="section-subtitle">Apa yang kamu cari hari ini?</p>
          </div>
        </div>

        {/* Category Grid */}
        <div className="category-grid" id="categoryGrid">
          {isLoading
            ? Array(8).fill(null).map((_, i) => <SkeletonCard key={i} />)
            : categories.map((category, index) => {
              const bgColor = ICON_COLORS[index % ICON_COLORS.length];
              return (
                <Link
                  key={category.id}
                  href={`/produk?category=${category.slug}`}
                  style={{ textDecoration: "none" }}
                  className="category-card"
                >
                  <div
                    className="category-icon-wrap"
                    style={{ background: bgColor }}
                  >
                    {category.icon_url ? (
                      <Image
                        src={category.icon_url}
                        alt={category.name}
                        width={36}
                        height={36}
                        style={{ objectFit: "contain", width: 36, height: 36 }}
                      />
                    ) : (
                      "🛍️"
                    )}
                  </div>
                  <div className="category-name">{category.name}</div>
                  <div className="category-count">{category.products_count ?? 0} produk</div>
                </Link>
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
