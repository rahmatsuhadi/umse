// Skeleton untuk setiap item cart
const CartItemCardSkeleton = () => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-gray-100 space-y-4 sm:space-y-0 animate-pulse">
    <div className="flex items-start sm:items-center">
      {/* Checkbox Skeleton */}
      <div className="mr-3 w-4 h-4 bg-gray-300 rounded-full"></div>

      {/* Gambar Produk Skeleton */}
      <div className="bg-gray-200 rounded w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
        <div className="bg-gray-300 w-12 h-12 rounded-full"></div>
      </div>

      <div className="flex-1 min-w-0">
        {/* Teks Skeleton */}
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      </div>
    </div>

    <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
      {/* Quantity Controls Skeleton */}
      <div className="flex items-center  border-gray-300 rounded">
        <div className="px-2 py-1 bg-gray-300 w-8 h-8 rounded-full"></div>
        <div className="px-3 py-1 bg-gray-300 w-12 h-8 rounded-full"></div>
        <div className="px-2 py-1 bg-gray-300 w-8 h-8 rounded-full"></div>
      </div>
      {/* Harga Skeleton */}
      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      {/* Hapus Button Skeleton */}
      <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
    </div>
  </div>
);

// Skeleton untuk StoreCartItem
export const StoreCartItemSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md mb-6 animate-pulse">
    {/* Header Skeleton */}
    <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
      <div className="flex items-center">
        {/* Checkbox Skeleton */}
        <div className="mr-3 w-4 h-4 bg-gray-300 rounded-full"></div>

        {/* Gambar Toko Skeleton */}
        <div className="bg-gray-300 rounded-full w-8 h-8 sm:w-10 sm:h-10 mr-3"></div>

        <div>
          {/* Teks Skeleton */}
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    {/* Items Skeleton */}
    <div className="p-4 sm:p-6">
      {Array(3).fill(null).map((_, index) => (
        <CartItemCardSkeleton key={index} />
      ))}

      {/* Checkout Button Skeleton */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 space-y-3 sm:space-y-0">
        <div className="text-xs sm:text-sm text-gray-600 space-y-2 sm:space-y-0">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>

        <div className="text-left sm:text-right">
          <div className="h-8 bg-gray-300 rounded w-32 sm:w-40"></div>
        </div>
      </div>
    </div>
  </div>
);

