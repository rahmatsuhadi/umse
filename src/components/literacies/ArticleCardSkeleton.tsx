import { Skeleton } from "@/components/ui/skeleton"; 

export function ArticleCardSkeleton() {
  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col border">
      {/* Skeleton untuk Gambar */}
      <Skeleton className="h-48 w-full" />

      {/* Skeleton untuk Konten */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Skeleton untuk Judul */}
        <div className="space-y-2 mb-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
        </div>
        
        {/* Skeleton untuk Ringkasan */}
        <div className="space-y-2 flex-grow mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Skeleton untuk Footer */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
    </article>
  );
}