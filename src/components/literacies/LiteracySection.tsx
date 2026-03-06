"use client";

import { motion } from "framer-motion";
import ArticleCard from "./ArticleCard";
import { useInfiniteArticles, useArticleCategoryCounts } from "@/features/articles/hook";
import { useRouter, useSearchParams } from "next/navigation";
import { ArticleCardSkeleton } from "./ArticleCardSkeleton";
import { CategoryArticle, Article, PaginatedApiResponse } from "@/types";
import { useState, useMemo } from "react";

// Varian animasi
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 1, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function LiteracySection({
  category,
  path,
}: {
  path: string;
  category: CategoryArticle;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "-created_at";
  const [view, setView] = useState<"grid" | "list">("grid");
  const itemsPerPage = 6;

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteArticles({
    category: category || undefined,
    per_page: itemsPerPage,
    sort: sort,
  });

  const articles = useMemo(() =>
    data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  const totalArticles = data?.pages[0]?.meta.total ?? 0;

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    router.push(`${path}?${params.toString()}`, { scroll: false });
  };

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`${path}?${params.toString()}`, { scroll: false });
  };

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

  return (
    <div>
      {/* ── Category Capsules ── */}
      <div className="art-type-bar mb-6">
        {categories.map((cat) => (
          <div
            key={cat.slug}
            className={`art-type-chip ${category === cat.slug ? "active" : ""}`}
            onClick={() => handleCategoryClick(cat.slug)}
            style={{ cursor: "pointer" }}
          >
            <span
              className="art-type-dot"
              style={{ background: category === cat.slug ? "white" : "var(--terracotta)" }}
            ></span>
            {cat.icon} {cat.name} {cat.slug !== "" && (
              <span className="opacity-60 text-xs ml-1">
                ({categoryResults.some(r => r.isLoading) ? "..." : getCategoryCount(cat.slug)})
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ── Sort bar ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div className="art-count"><strong>{totalArticles}</strong> artikel ditemukan</div>

        <div className="flex items-center gap-3">
          <select
            className="sort-select"
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            style={{ fontSize: '13px', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid var(--cream-dark)' }}
          >
            <option value="-created_at">Terbaru</option>
            <option value="created_at">Terlama</option>
            <option value="title">A – Z</option>
          </select>
          <div className="art-view-btns">
            <button
              className={`art-view-btn ${view === "grid" ? "active" : ""}`}
              onClick={() => setView("grid")}
              title="Grid"
            >⊞</button>
            <button
              className={`art-view-btn ${view === "list" ? "active" : ""}`}
              onClick={() => setView("list")}
              title="List"
            >☰</button>
          </div>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`art-grid ${view === "list" ? "list-view" : ""}`}
      >
        {isLoading ? (
          [...Array(itemsPerPage)].map((_, index) => (
            <motion.div key={`skeleton-${index}`} variants={itemVariants}>
              <ArticleCardSkeleton />
            </motion.div>
          ))
        ) : articles.length > 0 ? (
          articles?.map((article) => (
            <motion.div key={article.id} variants={itemVariants}>
              <ArticleCard article={article} />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="art-empty-icon text-5xl mb-4">🗞️</div>
            <h3 className="text-xl font-bold">Belum ada artikel</h3>
            <p className="text-slate-500 mt-2">Coba kategori atau tipe konten lain</p>
          </div>
        )}
      </motion.div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="mt-12 flex justify-center"
          style={{ padding: 50 }}>
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="btn btn-primary"
            style={{ padding: '12px 32px' }}
          >
            {isFetchingNextPage ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span> Memuat...
              </span>
            ) : (
              "Muat Lebih Banyak"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
