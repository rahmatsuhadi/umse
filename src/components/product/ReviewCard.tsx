"use client"

import { useReviews } from "@/features/reviews/hooks";
import { getInitials } from "@/lib/initial-getter";

export const StarRating = ({ rating, count, size = 'sm' }: { rating: number; count?: number, size?: 'xs' | 'sm' | 'base' }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const starSizeClass = `text-${size}`;

  return (
    <div className="flex items-center text-yellow-400">
      {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className={`fas fa-star ${starSizeClass}`}></i>)}
      {halfStar && <i className={`fas fa-star-half-alt ${starSizeClass}`}></i>}
      {[...Array(emptyStars)].map((_, i) => <i  key={`empty-${i}`} className={`far fa-star ${starSizeClass}`}></i>)}
      {count && <span className={`text-gray-600 ml-2 text-${size}`}>{rating.toFixed(1)} ({count} ulasan)</span>}
    </div>
  );
};

interface CardRatingProps {
  productData: {
    rating: number;
    reviewCount: number;
    reviews: {
      summary: { stars: number; count: number; percentage: number }[];
    };
  }
}

export function CardRating({ productData }: CardRatingProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Ulasan Pembeli ({productData.reviewCount})</h2>
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-center mb-4 sm:mb-0 sm:mr-8">
              <div className="text-3xl sm:text-4xl font-bold text-gray-800">{productData.rating.toFixed(1)}</div>
              <div className="flex items-center justify-center text-yellow-400 mb-1"><StarRating rating={productData.rating} /></div>
              <div className="text-xs sm:text-sm text-gray-600">{productData.reviewCount} ulasan</div>
            </div>
            <div className="flex-1">
              <div className="space-y-2">
                {productData.reviews.summary.map(item => (
                  <div key={item.stars} className="flex items-center text-sm">
                    <span className="w-8 sm:w-12">{item.stars}</span>
                    <i className="fas fa-star text-yellow-400 mr-2"></i>
                    <div className="flex-1 bg-gray-200 rounded-full h-2"><div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div></div>
                    <span className="ml-2 w-6 sm:w-8">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-3 text-sm sm:text-base">Filter Ulasan</h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 sm:px-4 py-2 bg-primary text-white rounded-full text-xs sm:text-sm">Semua</button>
              <button className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-xs sm:text-sm hover:bg-gray-300">5★ ({productData.reviews.summary[0].count})</button>
              <button className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-xs sm:text-sm hover:bg-gray-300">4★ ({productData.reviews.summary[1].count})</button>
              <button className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-xs sm:text-sm hover:bg-gray-300">Dengan Foto (45)</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


interface ReviewCardProps {
  productId: string;
}
export function ReviewCard({ productId }: ReviewCardProps) {

  const { data: reviewsData } = useReviews({ productId });

  const reviews = reviewsData?.data ?? [];

  return (
    <div className="space-y-6">
      {reviews.map(review => (
        <div key={review.id} className="border-b border-gray-200 pb-6">
          <div className="flex items-start mb-4">
            <div className="bg-primary rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0"><span className="text-white font-bold text-sm sm:text-base">{getInitials(review.reviewer.name)}</span></div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm sm:text-base">{review.reviewer.name}</h4>
                  <div className="flex items-center text-yellow-400 mb-1"><StarRating rating={review.rating} size="xs" /></div>
                </div>
                <span className="text-xs sm:text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700 mb-3 text-sm sm:text-base">{review.content}</p>
              {/* {review.sellerReply && (
                <div className="bg-orange-50 rounded-lg p-3 sm:p-4 mt-4 ml-4 sm:ml-8">
                  <div className="flex items-start">
                    <div className="bg-primary rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0"><i className="fas fa-store text-white text-xs sm:text-sm"></i></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center mb-2">
                        <span className="font-bold text-gray-800 text-xs sm:text-sm">{review.sellerReply.name}</span>
                        <span className="bg-primary text-white text-xs px-2 py-1 rounded-full sm:ml-2 mt-1 sm:mt-0 self-start">Penjual</span>
                      </div>
                      <p className="text-gray-700 text-xs sm:text-sm">{review.sellerReply.text}</p>
                      <span className="text-xs text-gray-500 mt-2 block">{review.sellerReply.date}</span>
                    </div>
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}