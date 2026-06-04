// Skeleton untuk setiap item cart
const CartItemCardSkeleton = () => (
  <div className="cart-item-row animate-pulse">
    <div className="cart-item-left">
      {/* Checkbox Skeleton */}
      <div className="w-4 h-4 bg-gray-200 rounded-md"></div>

      {/* Gambar Produk Skeleton */}
      <div className="cart-item-img-wrapper">
        <div className="bg-gray-200 w-12 h-12 rounded-lg"></div>
      </div>

      <div className="flex-1 min-w-0">
        {/* Teks Skeleton */}
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>

    <div className="cart-item-right">
      {/* Quantity Controls Skeleton */}
      <div className="cart-item-qty-adjuster">
        <div className="w-8 h-8 bg-gray-100"></div>
        <div className="w-8 h-8 bg-gray-50"></div>
        <div className="w-8 h-8 bg-gray-100"></div>
      </div>
      {/* Harga Skeleton */}
      <div className="h-4 bg-gray-200 rounded w-16"></div>
      {/* Hapus Button Skeleton */}
      <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

// Skeleton untuk StoreCartItem
export const StoreCartItemSkeleton = () => (
  <div className="cart-store-container animate-pulse">
    {/* Top gradient accent bar */}
    <div className="cart-store-header-bar" />

    {/* Header Skeleton */}
    <div className="cart-store-header">
      <div className="cart-store-info">
        {/* Checkbox Skeleton */}
        <div className="w-4 h-4 bg-gray-200 rounded-md"></div>

        {/* Gambar Toko Skeleton */}
        <div className="cart-store-logo-wrapper">
          <div className="bg-gray-200 w-full h-full"></div>
        </div>

        <div>
          {/* Teks Skeleton */}
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>

    {/* Items Skeleton */}
    <div className="pb-2">
      {Array(2).fill(null).map((_, index) => (
        <CartItemCardSkeleton key={index} />
      ))}
    </div>

    {/* Checkout Button Skeleton */}
    <div className="cart-store-footer">
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-28"></div>
        <div className="h-5 bg-gray-200 rounded w-36"></div>
      </div>

      <div className="h-9 bg-gray-200 rounded-md w-32 self-end"></div>
    </div>
  </div>
);

