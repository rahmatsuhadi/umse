"use client";

import { usePaginationArticles } from "@/features/articles/hook";
import Link from "next/link";
import Image from "next/image";

const ARTICLE_ICONS = ["📝", "🌿", "☕", "🎨", "🛍️", "📚"];

const Skeleton = () => (
    <div className="blog-card" style={{ opacity: 0.7, pointerEvents: "none" }}>
        <div className="blog-img" style={{ background: "rgba(255,255,255,0.05)", animation: "pulse 1.5s infinite" }} />
        <div className="blog-body">
            <div className="blog-cat" style={{ height: 12, width: "30%", background: "rgba(255,255,255,0.1)", borderRadius: 4, marginBottom: 8 }} />
            <div className="blog-title" style={{ height: 16, width: "90%", background: "rgba(255,255,255,0.1)", borderRadius: 4, marginBottom: 6 }} />
            <div className="blog-excerpt" style={{ height: 14, width: "100%", background: "rgba(255,255,255,0.1)", borderRadius: 4, marginBottom: 12 }} />
            <div className="blog-meta" style={{ height: 12, width: "40%", background: "rgba(255,255,255,0.1)", borderRadius: 4 }} />
        </div>
    </div>
);

export function TopLiteracies() {
    const { data, isLoading } = usePaginationArticles({
        category: "literature",
        page: 1,
        per_page: 3,
    });
    const articles = data?.data ?? [];

    return (
        <section className="blog-bg">
            <div className="container">
                {/* Header */}
                <div className="section-header" style={{ marginBottom: 28 }}>
                    <div>
                        <h2 className="section-title" style={{ color: "white" }}>
                            Tips & <span>Artikel</span>
                        </h2>
                        <p className="section-subtitle" style={{ color: "rgba(255,255,255,0.5)" }}>
                            Inspirasi belanja dan cerita UMKM lokal
                        </p>
                    </div>
                    <Link href="/literasi" className="see-all-link" style={{ color: "var(--saffron)" }}>
                        Semua Artikel →
                    </Link>
                </div>

                {/* Grid */}
                <div className="blog-grid" id="blogGrid">
                    {isLoading
                        ? Array(3).fill(null).map((_, i) => <Skeleton key={i} />)
                        : articles.map((article, i) => (
                            <Link
                                key={article.slug ?? article.id}
                                href={`/literasi/${article.id}`}
                                style={{ textDecoration: "none", display: "block" }}
                                className="blog-card"
                            >
                                <div className="blog-img" style={{ padding: 0, overflow: "hidden", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>
                                    {article.thumbnail?.media_url ? (
                                        <Image
                                            src={article.thumbnail.media_url}
                                            alt={article.title}
                                            fill
                                            style={{ objectFit: "cover" }}
                                        />
                                    ) : (
                                        ARTICLE_ICONS[i % ARTICLE_ICONS.length]
                                    )}
                                </div>
                                <div className="blog-body">
                                    <div className="blog-cat">{article.category_label ?? article.category}</div>
                                    <div className="blog-title">{article.title}</div>
                                    {article.excerpt && (
                                        <div className="blog-excerpt">{article.excerpt}</div>
                                    )}
                                    <div className="blog-meta">
                                        📅 {article.created_at ? new Date(article.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : ""}
                                    </div>
                                </div>
                            </Link>
                        ))}
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
