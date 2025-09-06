"use client"

import { useReviews } from "@/features/reviews/hooks";
import { formatDate } from "@/lib/format-date";
import { getInitials } from "@/lib/initial-getter";
import { Product, Store } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState } from "react";
import { MediaPreview } from "../shared/MediaPreview";
import { ReviewListSkeleton } from "../order/review/ReviewListSkeleton";

export const StarRating = ({ rating, count, size = 'sm' }: { rating: number; count?: number, size?: 'xs' | 'sm' | 'base' }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const starSizeClass = `text-${size}`;

  return (
    <div className="flex items-center text-yellow-400">
      {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className={`fas fa-star ${starSizeClass}`}></i>)}
      {halfStar && <i className={`fas fa-star-half-alt ${starSizeClass}`}></i>}
      {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className={`far fa-star ${starSizeClass}`}></i>)}
      {count && <span className={`text-gray-600 ml-2 text-${size}`}>{rating.toFixed(1)} ({count} ulasan)</span>}
    </div>
  );
};

interface CardRatingProps {
  product: Product
}

export function CardRating({ product }: CardRatingProps) {
  const totalReviews = Object.values(product.rating_count).reduce((sum, count) => sum + count, 0);

  return (
    <div className="mb-6 sm:mb-8">
      {/* <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Ulasan Pembeli ({productData.reviewCount})</h2> */}
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-center mb-4 sm:mb-0 sm:mr-8">
              <div className="text-3xl sm:text-4xl font-bold text-gray-800">{Number(product.average_rating).toFixed(1)}</div>
              <div className="flex items-center justify-center text-yellow-400 mb-1"><StarRating rating={Number(product.average_rating)} /></div>
              <div className="text-xs sm:text-sm text-gray-600">{totalReviews} ulasan</div>
            </div>
            <div className="flex-1">
              <div className="space-y-2">
                {Object.entries(product.rating_count).map(([key, item]) => {

                  const percentage = totalReviews > 0 ? (Number(item) / totalReviews) * 100 : 0;
                  return (
                    <div key={key} className="flex items-center text-sm">
                      <span className="w-8 sm:w-12">{key}</span>
                      <i className="fas fa-star text-yellow-400 mr-2"></i>
                      <div className="flex-1 bg-gray-200 rounded-full h-2"><div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }}></div></div>
                      <span className="ml-2 w-6 sm:w-8">{item}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-3 text-sm sm:text-base">Filter Ulasan</h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 sm:px-4 py-2 bg-primary text-white rounded-full text-xs sm:text-sm">Semua</button>
              <button className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-xs sm:text-sm hover:bg-gray-300">5★ ({product.rating_count[5]})</button>
              <button className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-xs sm:text-sm hover:bg-gray-300">4★ ({product.rating_count[4]})</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


interface ReviewCardProps {
  productId: string;
  store: Store;
}
export function ReviewCard({ productId, store }: ReviewCardProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useReviews({ productId });
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
        <div key={review.id} className="border-b border-gray-200 pb-6">
          <div className="flex items-start mb-4">
            <Avatar className="w-10 h-10 sm:w-12 sm:h-12 mb-2 border-4 border-gray-200 mr-3 sm:mr-4 ">
              <AvatarImage
                src={review.reviewer.profile_url}
                alt="Profile"
                className="object-cover w-full h-full"
              />
              <AvatarFallback>
                {getInitials(review.reviewer.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm sm:text-base">{review.reviewer.name}</h4>
                  <div className="flex items-center text-yellow-400 mb-1"><StarRating rating={review.rating} size="xs" /></div>
                </div>
                <span className="text-xs sm:text-sm text-gray-500">{formatDate(review.created_at)}</span>
              </div>
              <p className="text-gray-700 mb-3 text-sm sm:text-base">{review.content}</p>

              {/* Render Media */}
              {review.media && review.media.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-4">
                  {review.media.map((media, index) => {
                    const mediaItem = media.media_url;
                    // Tentukan tipe media berdasarkan ekstensi
                    const isVideo = mediaItem.endsWith('.mp4');
                    const isImage = mediaItem.endsWith('.jpg') || mediaItem.endsWith('.png') || mediaItem.endsWith('.jpeg');

                    if (!isVideo && !isImage) return null; // Jika bukan format yang didukung

                    return (
                      <div key={index} className="w-24 h-24 sm:w-32 sm:h-32 relative group">
                        {isVideo ? (
                          <video
                            className="w-full h-full object-cover rounded-md cursor-pointer"
                            onClick={() => handlePreviewClick(mediaItem, 'video')}
                          >
                            <source src={mediaItem} type="video/mp4" />
                          </video>
                        ) : (
                          <img
                            src={mediaItem}
                            alt={`Review media ${index}`}
                            className="w-full h-full object-cover rounded-md cursor-pointer"
                            onClick={() => handlePreviewClick(mediaItem, 'image')}
                          />
                        )}
                        {/* Tambahkan ikon play untuk video sebagai indikator visual */}
                        {isVideo && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-md pointer-events-none group-hover:bg-opacity-50 transition-opacity">
                            <i className="fas fa-play text-white text-3xl"></i>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Balasan Penjual */}
              {review.reply_content && (

                <div className="bg-orange-50 rounded-lg p-3 sm:p-4 mt-4 ml-4 sm:ml-8">

                  <div className="flex items-start">

                    <div className="bg-primary rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0"><i className="fas fa-store text-white text-xs sm:text-sm"></i></div>

                    <div className="flex-1 min-w-0">

                      <div className="flex flex-col sm:flex-row sm:items-center mb-2">

                        <span className="font-bold text-gray-800 text-xs sm:text-sm">{store.name}</span>

                        <span className="bg-primary text-white text-xs px-2 py-1 rounded-full sm:ml-2 mt-1 sm:mt-0 self-start">Penjual</span>

                      </div>

                      <p className="text-gray-700 text-xs sm:text-sm">{review.reply_content}</p>
                      {review.replied_at && (
                        <span className="text-xs text-gray-500 mt-2 block">{formatDate(review.replied_at)}</span>
                      )}

                    </div>

                  </div>

                </div>

              )}
            </div>
          </div>
        </div>
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
