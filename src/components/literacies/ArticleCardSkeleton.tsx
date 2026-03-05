import { Skeleton } from "@/components/ui/skeleton";

export function ArticleCardSkeleton() {
  return (
    <article className="art-card">
      <div className="art-card-img">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="art-card-body">
        <div className="art-card-type mb-3">
          <Skeleton className="h-3 w-4 rounded-full" />
          <Skeleton className="h-3 w-16 px-2" />
        </div>

        <div className="space-y-2 mb-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>

        <div className="space-y-2 mb-6 flex-grow">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>

        <div className="art-card-footer">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </article>
  );
}