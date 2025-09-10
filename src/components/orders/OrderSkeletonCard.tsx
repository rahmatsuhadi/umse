import { Skeleton } from "../ui/skeleton";

export default function OrderSkeletonCard() {
    return (
        <div className="bg-white rounded-lg shadow-md mb-6 animate-pulse py-8 border px-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 pl-2 w-[14%] my-2" />
                <Skeleton className="h-10 pl-2 w-[14%] my-2" />
            </div>
            <Skeleton className="h-10 pl-2 w-[14%] my-2" />
            <Skeleton className="h-10 pl-2 w-full my-2" />
            <Skeleton className="h-10 pl-2 w-[14%] my-2" />
        </div>
    )
}