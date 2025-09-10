"use client"
import { Product } from "@/types";
import { useState } from "react";
import { StarRating } from "./ProductStarRating";
import { ProductReviewList } from "./ProductReview";


interface CardRatingProps {
  product: Product
}

export function ProductRatingReview({ product }: CardRatingProps) {
  const [selectedFilter, setSelectedFilter] = useState<number | null>(null);
  const totalReviews = Object.values(product.rating_count).reduce((sum, count) => sum + count, 0);

  return (
    <>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Ulasan Pembeli </h2>
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
                <button className={`px-3 sm:px-4 py-2 ${selectedFilter == null ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}  rounded-full text-xs sm:text-sm`} onClick={() => setSelectedFilter(null)}>Semua</button>
                <button className={`px-3 sm:px-4 py-2 ${selectedFilter == 5 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}  rounded-full text-xs sm:text-sm `} onClick={() => setSelectedFilter(5)}>5★ ({product.rating_count[5]})</button>
                <button className={`px-3 sm:px-4 py-2 ${selectedFilter == 4 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}  rounded-full text-xs sm:text-sm `} onClick={() => setSelectedFilter(4)}>4★ ({product.rating_count[4]})</button>
              </div>
            </div>
          </div>
        </div>
      </div>


      <ProductReviewList store={product.store} rating_filter={selectedFilter} productId={product.id} />
    </>
  )
}
