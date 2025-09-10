import { ReviewItemSkeleton } from "./ReviewItemSkeleton";

interface ReviewListSkeletonProps {
    count?: number;
}

export function ReviewListSkeleton({ count = 3 }: ReviewListSkeletonProps) {
    return (
        <div className="space-y-6">
            {Array.from({ length: count }).map((_, index) => (
                <ReviewItemSkeleton key={index} />
            ))}
        </div>
    );
}