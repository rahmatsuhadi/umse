"use client"

import { useReviews } from "@/features/reviews/hooks";
import { Store } from "@/types";
import { useState } from "react";
import Image from "next/image";
import { MediaPreview } from "../shared/MediaPreview";
import ProductReviewCard from "./ProductReviewCard";
import { ReviewListSkeleton } from "../orders/modal/review/ReviewListSkeleton";

interface ReviewCardProps {
  productId: string;
  store: Store;
  rating_filter: number | null;
}

export function ProductReviewList({ productId, store, rating_filter }: ReviewCardProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useReviews({ productId, filter: { ...(rating_filter ? { rating: rating_filter } : {}) } });

  const reviews = data?.pages.flatMap(page => page.data) ?? [];

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [currentPreviewMedia, setCurrentPreviewMedia] = useState<{ url: string; type: 'image' | 'video'; } | null>(null);
  const [showOnlyMedia, setShowOnlyMedia] = useState(false);

  const handlePreviewClick = (url: string, type: 'image' | 'video') => {
    setCurrentPreviewMedia({ url, type });
    setPreviewModalOpen(true);
  };

  // Kumpulkan seluruh media foto dan video dari ulasan yang tersedia
  const allReviewMedia = reviews
    .flatMap((review) =>
      (review.media || []).map((m) => ({
        ...m,
        reviewerName: review.reviewer?.name,
      }))
    )
    .filter((m) => Boolean(m?.media_url));

  const displayedReviews = showOnlyMedia
    ? reviews.filter((r) => r.media && r.media.length > 0)
    : reviews;

  if (status === 'pending') {
    return <ReviewListSkeleton count={1} />;
  }

  if (status === 'success' && reviews.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <i className="fas fa-comment-slash text-4xl text-gray-300 mb-4"></i>
        <h3 className="text-lg font-semibold text-gray-700">Belum Ada Ulasan</h3>
        <p className="text-sm text-gray-500 mt-1">Jadilah yang pertama memberikan ulasan untuk produk ini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Galeri Foto & Video Ulasan */}
      {allReviewMedia.length > 0 && (
        <div className="p-4 rounded-xl border border-[var(--cream-dark)] bg-white shadow-xs">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                Foto &amp; Video Pembeli
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--cream)] text-[var(--terracotta)] border border-[var(--cream-dark)]">
                {allReviewMedia.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowOnlyMedia((prev) => !prev)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                showOnlyMedia
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <i className="fas fa-camera text-xs"></i>
              {showOnlyMedia ? "Tampilkan Semua" : "Hanya Ulasan Bergambar"}
            </button>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
            {allReviewMedia.map((media, index) => {
              const mediaUrl = media.media_url;
              const isVideo =
                media.media_type === "video" ||
                /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(mediaUrl);

              return (
                <button
                  key={`${mediaUrl}-${index}`}
                  type="button"
                  onClick={() =>
                    handlePreviewClick(mediaUrl, isVideo ? "video" : "image")
                  }
                  className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-gray-200 hover:border-primary hover:opacity-95 transition cursor-pointer group bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-primary"
                  title={media.name || `Foto ulasan oleh ${media.reviewerName || "pembeli"}`}
                >
                  {isVideo ? (
                    <video
                      src={mediaUrl}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={mediaUrl}
                      alt={media.name || `Foto ulasan ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      unoptimized
                    />
                  )}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/35 group-hover:bg-black/20 transition">
                      <span className="text-white text-xs">▶</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {displayedReviews.length === 0 && showOnlyMedia ? (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">
            Tidak ada ulasan dengan foto atau video yang sesuai filter.
          </p>
        </div>
      ) : (
        displayedReviews.map((review) => (
          <ProductReviewCard
            review={review}
            store={store}
            handlePreviewClick={handlePreviewClick}
            key={review.id}
          />
        ))
      )}

      <div className="mt-8 flex justify-center">
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2 font-semibold bg-primary hover:cursor-pointer text-white rounded-lg disabled:bg-gray-400"
          >
            {isFetchingNextPage
              ? 'Memuat...'
              : 'Muat Ulasan Lainnya'}
          </button>
        )}
      </div>

      {isFetchingNextPage && <div className="mt-4 text-sm text-center text-gray-500">Memuat ulasan selanjutnya...</div>}

      {!hasNextPage && reviews.length > 0 && (
        <div className="mt-8 text-center text-gray-500">
          Semua ulasan telah ditampilkan
        </div>
      )}

      {/* MODAL / DIALOG UNTUK PREVIEW MEDIA (Gaya Lightbox) */}
      <MediaPreview
        open={previewModalOpen}
        onOpenChange={setPreviewModalOpen}
        media={currentPreviewMedia}
      />
    </div>
  )
}
