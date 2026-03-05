"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/format-date";
import { Article } from "@/types";
import { useState } from "react";

type ArticleCardProps = {
  article: Article & { date?: string };
};

export default function ArticleCard({ article }: ArticleCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/literasi/${article.id}`}
      className="art-card group h-full block"
    >
      <div className="art-card-img">
        <Image
          fill
          src={imgError ? "/assets/no-image.jpg" : (article.thumbnail?.media_url || "/assets/no-image.jpg")}
          alt={article.title}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImgError(true)}
        />
        <div className="art-card-cat-overlay" style={{ background: "rgba(0,0,0,0.52)", color: "white" }}>
          {article.category_label}
        </div>
        <div className="art-card-read-time">
          ⏱ 5 min
        </div>
      </div>

      <div className="art-card-body flex flex-col justify-between">
        <div>
          <h3 className="art-card-title group-hover:text-[var(--terracotta)] transition-colors">
            {article.title}
          </h3>

          <p className="art-card-excerpt">
            {article.excerpt}
          </p>
        </div>

        <div className="art-card-footer border-t border-[var(--cream-dark)] pt-4 mt-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="art-card-author text-[12px] font-semibold text-[var(--text-muted)]">
              ✍️ Sleman Mart
            </div>
            <div className="art-card-date text-[11px] text-[var(--text-muted)]">
              📅 {formatDate(article.updated_at)}
            </div>
          </div>
          <div className="art-read-btn">
            Baca <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
