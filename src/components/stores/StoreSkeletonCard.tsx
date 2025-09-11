import { Skeleton } from "../ui/skeleton";

export default function StoreSkeletonCard() {
    return (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
            <Skeleton className="mx-auto mb-4 w-[80px] h-[80px] rounded-full" />
            <Skeleton className="mx-auto h-4 w-[120px] mb-2" />
            <Skeleton className="mx-auto h-5 w-[150px] mb-2" />
            <Skeleton className="mx-auto h-3 w-[100px]" />
        </div>
    )
}