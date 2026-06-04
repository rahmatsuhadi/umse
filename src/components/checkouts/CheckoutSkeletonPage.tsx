import { Skeleton } from "../ui/skeleton";

export default function CheckoutSkeletonPage() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Delivery Details Form Skeleton */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-6">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div>
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-3 w-64 mt-2" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              {/* Recipient Name Field Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>

              {/* Recipient Phone Field Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>

              {/* Full Address Field Skeleton */}
              <div className="md:col-span-2 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>

              {/* Province Select Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>

              {/* Regency Select Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>

              {/* District Select Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>

              {/* Village Select Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>

              {/* Postal Code Field Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>

            {/* Note Skeleton */}
            <div className="border-t border-gray-100 pt-6 mt-6 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          </div>
        </div>

        {/* Right Side: Sticky Checkout Card Summary Skeleton */}
        <div className="lg:col-span-5 space-y-6">
          {/* Store Info Card Skeleton */}
          <div className="bg-orange-50/30 border border-orange-100/50 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <Skeleton className="w-14 h-14 rounded-2xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-16 rounded-full" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>

          {/* Items & Order Details Summary Skeleton */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16 rounded-lg" />
            </div>

            <div className="space-y-4">
              {Array(2)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 bg-gray-50/30 border border-gray-100 rounded-xl p-3.5"
                  >
                    <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20 rounded-full" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-4 w-20 flex-shrink-0" />
                  </div>
                ))}
            </div>

            {/* Receipt Summary Skeleton */}
            <div className="border-t border-dashed border-gray-200 pt-5 mt-5 space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="border-t border-gray-100 pt-4 mt-2 flex justify-between items-center">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-6 w-28" />
              </div>
            </div>

            {/* Checkout Action Button Skeleton */}
            <div className="mt-6">
              <Skeleton className="w-full h-12 rounded-xl" />
              <Skeleton className="h-3 w-40 mx-auto mt-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}