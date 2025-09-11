import { Skeleton } from "../ui/skeleton"

export const CategorySkeletonCard = () => {
    return (
        <div  className="flex flex-col items-center p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Skeleton className="w-12 h-10 mb-2" />
            <Skeleton className="w-24 h-6" />
        </div>
    )
}