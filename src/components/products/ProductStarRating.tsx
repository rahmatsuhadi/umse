
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