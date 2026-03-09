"use client"
import { Product } from "@/types";
import { useState } from "react";
import { ProductReviewList } from "./ProductReview";
// formatDate import removed as it is not used in this file

interface CardRatingProps {
  product: Product
}

export function ProductRatingReview({ product }: CardRatingProps) {
  const [selectedFilter] = useState<number | null>(null);
  // const totalReviews = Object.values(product.rating_count).reduce((sum, count) => sum + count, 0);
  // const avgRating = Number(product.average_rating);

  // // Build star string
  // const renderStars = (rating: number) => {
  //   const full = Math.floor(rating);
  //   const half = rating - full >= 0.5;
  //   let stars = '★'.repeat(full);
  //   if (half) stars += '★';
  //   return stars.padEnd(5, '☆');
  // };

  // // Bar percentages per rating
  // const ratingEntries = [5, 4, 3, 2, 1].map(star => ({
  //   star,
  //   count: product.rating_count[String(star)] ?? 0,
  //   pct: totalReviews > 0 ? ((product.rating_count[String(star)] ?? 0) / totalReviews) * 100 : 0,
  // }));

  // const barColors: Record<number, string> = {
  //   5: 'var(--saffron)',
  //   4: 'var(--terracotta-light)',
  //   3: '#ccc',
  //   2: '#ccc',
  //   1: '#ccc',
  // };

  return (
    <div className="reviews-section">
      <div style={{ marginBottom: '16px' }}>
        <h2 className="section-title" style={{ fontSize: '22px' }}>
          Ulasan <span>Pembeli</span>
        </h2>
      </div>

      {/* Summary */}
      {/* <div className="review-summary">
        <div className="review-score">
          <div className="score">{avgRating.toFixed(1)}</div>
          <div className="stars">{renderStars(avgRating)}</div>
          <div className="count">{totalReviews} ulasan</div>
        </div>
        <div className="review-bars">
          {ratingEntries.map(({ star, count, pct }) => (
            <div key={star} className="review-bar-row">
              <span style={{ width: '24px' }}>{star}★</span>
              <div className="review-bar-bg">
                <div
                  className="review-bar-fill"
                  style={{ width: `${pct}%`, background: barColors[star] }}
                />
              </div>
              <span style={{ width: '28px', textAlign: 'right' }}>{count}</span>
            </div>
          ))}
        </div>
      </div> */}

      {/* Review List */}
      <ProductReviewList
        store={product.store}
        rating_filter={selectedFilter}
        productId={product.id}
      />
    </div>
  );
}
