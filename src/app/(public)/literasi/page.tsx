"use client";

import LiteracySection from "@/components/literacies/LiteracySection";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { useSearchParams, useRouter } from "next/navigation";
import { CategoryArticle, Article, PaginatedApiResponse } from "@/types";
import { usePaginationArticles, useArticleCategoryCounts } from "@/features/articles/hook";
import { Suspense } from "react";

function LiterasiContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = (searchParams.get("category") || "") as CategoryArticle;

  // Fetch for dynamic counts (Total Articles)
  const { data: globalData } = usePaginationArticles({
    page: 1,
    per_page: 1
  });

  const categories = [
    { name: "Semua", slug: "", icon: "📚" },
    { name: "Literasi", slug: "literature", icon: "📖" },
    { name: "Pengumuman", slug: "announcement", icon: "📢" },
    { name: "Pameran", slug: "exhibition", icon: "🎨" },
    { name: "Pelatihan", slug: "training", icon: "🎓" },
  ];

  const categoryResults = useArticleCategoryCounts(categories.filter(c => c.slug !== ""));

  const getCategoryCount = (slug: string) => {
    const index = categories.filter(c => c.slug !== "").findIndex(c => c.slug === slug);
    if (index === -1) return 0;
    const result = categoryResults[index];
    return (result.data as PaginatedApiResponse<Article>)?.meta.total || 0;
  };

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`/literasi?${params.toString()}`, { scroll: false });
  };

  return (
    <div style={{ background: "var(--cream)" }}>
      <Navbar />

      {/* Hero Section */}
      <div className="articles-hero">
        <div className="articles-hero-inner">
          <div className="articles-hero-eyebrow">📰 Pojok Cerita & Inspirasi</div>
          <h1>
            Inspirasi & Cerita dari
            <br />
            <em>UMKM Sleman</em>
          </h1>
          <p className="articles-hero-sub">
            Tips belanja, kisah inspiratif pelaku usaha, panduan kuliner, dan
            kabar terbaru dari ekosistem UMKM Kabupaten Sleman.
          </p>
          <div className="articles-hero-stats">
            <div>
              <div className="ah-stat-val">{globalData?.meta.total || "..."}</div>
              <div className="ah-stat-lbl">Total Artikel</div>
            </div>
            <div>
              <div className="ah-stat-val">{categories.filter(c => c.slug !== "").length}</div>
              <div className="ah-stat-lbl">Kategori</div>
            </div>
            <div>
              <div className="ah-stat-val">↗ Mar</div>
              <div className="ah-stat-lbl">Update Terakhir</div>
            </div>
          </div>
        </div>
      </div>

      <div className="articles-body">
        {/* Category Explorer */}
        <div className="articles-section-title">
          <span>🗂️</span> Jelajahi Kategori
        </div>

        <div className="articles-layout">
          {/* Main Content */}
          <div>
            <LiteracySection category={currentCategory} path="/literasi" />
          </div>

          {/* Sidebar */}
          <aside className="art-sidebar">
            <div className="art-sidebar-section">
              <div className="art-sidebar-title">🗂️ Semua Kategori</div>
              <div className="art-sidebar-cat-list">
                {categories.filter(c => c.slug !== "").map((cat) => (
                  <div
                    key={cat.slug}
                    className="art-sidebar-cat-item"
                    onClick={() => handleCategoryClick(cat.slug)}
                  >
                    <div className="art-sidebar-cat-label">
                      <span>{cat.icon}</span> {cat.name}
                    </div>
                    {/* Dynamic count */}
                    <div className="art-sidebar-cat-count">
                      {categoryResults.some(r => r.isLoading) ? "..." : getCategoryCount(cat.slug)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function LiterasiPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading page...</div>}>
      <LiterasiContent />
    </Suspense>
  );
}
