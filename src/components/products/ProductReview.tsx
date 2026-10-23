"use client"

import { useReviews } from "@/features/reviews/hooks";
import { Store } from "@/types";
import { useState } from "react";
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

  const handlePreviewClick = (url: string, type: 'image' | 'video') => {
    setCurrentPreviewMedia({ url, type });
    setPreviewModalOpen(true);
  };

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
      {reviews.map(review => (
        <ProductReviewCard
        review={review}
        store={store}
        handlePreviewClick={handlePreviewClick}
        key={review.id}/>
      ))}

      <div className="mt-8 flex justify-center">
        {isFetchingNextPage && (

          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2 font-semibold bg-primary hover:cursor-pointer  text-white rounded-lg  disabled:bg-gray-400"
          >
            {isFetchingNextPage
              ? 'Memuat...'
              : 'Muat Ulasan Lainnya'}
          </button>
        )}
      </div>


      {isFetchingNextPage && <div className="mt-4 text-sm text-gray-500">Memuat ulasan selanjutnya...</div>}

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
