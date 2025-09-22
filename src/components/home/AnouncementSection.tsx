"use client"
import { Button } from "@/components/ui/button";
import { useInfiniteArticles } from "@/features/articles/hook";
import { formatDate } from "@/lib/format-date";
import Image from "next/image";


// Komponen Skeleton untuk tampilan loading
const AnnouncementCardSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center animate-pulse">
    <div className="md:col-span-2 space-y-3">
      <div className="h-4 bg-gray-200 rounded-md w-1/3"></div> 
      <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded-md w-full"></div>
      <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
    </div>
    <div className="w-full h-48 md:h-52 bg-gray-200 rounded-md"></div>
  </div>
);

export default function AnnouncementsSection() {
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } = useInfiniteArticles({ per_page: 4, category: "announcement" });

  const announcements = data?.pages.flatMap(page => page.data) ?? [];

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          Pengumuman
        </h2>
        
        <div className="space-y-12">
          {isLoading && (
            Array.from({ length: 4 }).map((_, index) => (
              <AnnouncementCardSkeleton key={`skeleton-${index}`} />
            ))
          )}

          {!isLoading && announcements.map((item) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
           
              <div className={item.thumbnail ? "md:col-span-2" : "md:col-span-3"}>
                 <p className="text-sm text-slate-500 mb-2">
                  {formatDate(item.created_at)}
                </p>
                <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-slate-600 line-clamp-3">{item.excerpt}</p>
              </div>
              
              {item.thumbnail && (
                <div className="relative w-full h-48 md:h-52 rounded-md overflow-hidden">
                  <Image
                    src={item.thumbnail.media_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {!isLoading && announcements.length === 0 && (
            <div className="text-center py-10">
                <p className="text-slate-500">Belum ada pengumuman.</p>
            </div>
        )}

        {hasNextPage && (
          <div className="flex justify-center mt-12">
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-6 py-2"
            >
              {isFetchingNextPage ? 'Memuat...' : 'Selengkapnya'}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}