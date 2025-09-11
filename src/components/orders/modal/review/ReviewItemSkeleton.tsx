export function ReviewItemSkeleton() {
  return (
    <div className="flex items-start space-x-4 border-b border-gray-200 pb-6">
      {/* Avatar Skeleton */}
      <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
      
      <div className="flex-1 space-y-3">
        {/* User Info Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-1/3 rounded bg-gray-200 animate-pulse"></div>
          <div className="h-3 w-1/4 rounded bg-gray-200 animate-pulse"></div>
        </div>
        
        {/* Review Content Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-200 animate-pulse"></div>
          <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse"></div>
        </div>
        
        {/* Media Skeleton */}
        <div className="flex space-x-4 pt-2">
          <div className="h-24 w-24 rounded-md bg-gray-200 animate-pulse"></div>
          <div className="h-24 w-24 rounded-md bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}