import { Skeleton } from "../ui/skeleton";

export default function OrderSkeletonCard() {
  return (
    <div className="cart-store-container animate-pulse">
      {/* Top Gradient Header Bar */}
      <div className="cart-store-header-bar" />

      {/* Header Info */}
      <div className="cart-store-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 bg-[var(--cream)] border-b-[1.5px] border-[var(--cream-dark)]">
        <div className="space-y-2 w-1/3">
          <Skeleton className="h-5 w-2/3 bg-gray-200" />
          <Skeleton className="h-4 w-1/2 bg-gray-200" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full bg-gray-200" />
      </div>

      <div>
        {/* Item Row */}
        <div 
          style={{ padding: '16px 20px' }}
          className="flex items-center justify-between gap-4 border-b border-[var(--cream-dark)] last:border-b-0"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 rounded-md flex-shrink-0 bg-gray-200" />
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-5 w-3/4 bg-gray-200" />
              <Skeleton className="h-4 w-1/3 bg-gray-200" />
              <Skeleton className="h-4 w-1/4 bg-gray-200" />
            </div>
          </div>
        </div>

        {/* Summary and Actions Footer Container */}
        <div style={{ padding: '0 20px 20px' }}>
          {/* Order Summary Box */}
          <div style={{ background: "var(--cream)", border: "1.5px dashed var(--cream-dark)", borderRadius: 12, padding: 16, marginBottom: 16, marginTop: 16 }}>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-1/4 bg-gray-200" />
              <Skeleton className="h-5 w-1/3 bg-gray-200" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 justify-end" style={{ paddingTop: 12 }}>
            <Skeleton className="h-9 w-20 rounded-md bg-gray-200" />
            <Skeleton className="h-9 w-24 rounded-md bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}