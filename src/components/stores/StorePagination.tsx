import { Meta } from "@/types";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";

interface StorePaginationProps {
  isLoading: boolean
  meta?: Meta
}

export default function StorePagination({ isLoading, meta }: StorePaginationProps) {
  const router = useRouter();
  return (
    <div className="mt-8 text-center">
      <div className="inline-flex items-center space-x-2">
        {/* Cek apakah data masih loading */}
        {isLoading ? (
          // Skeleton UI untuk pagination
          [...Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-16 h-10 bg-gray-300 rounded-md" />
          ))
        ) : (
          // Tombol Paginasi Sebenarnya
          meta?.links.map((link, i) => {
            const isNextButton = link.label === "Next &raquo;";
            const isPrevButton = link.label === "&laquo; Previous";
            const isActive = link.active;
            const isLastPage = meta.current_page === meta.last_page;

            return (
              <button
                key={i}
                onClick={() => router.push(`?page=${link.page}`, { scroll: false })}
                disabled={
                  // Disable "Next" when it's on the last page or if it's the current active page
                  (isNextButton && isLastPage) || (isPrevButton && meta.current_page === 1)
                }
                className={` px-4 py-2 ${isActive ? "bg-primary text-white" : "bg-gray-200  hover:bg-gray-300 text-gray-700"} hover:scale-105 disabled:transition-none disabled:scale-100 transition-all disabled:bg-gray-300 rounded focus:cursor-pointer`}
              >
                {/* Mengganti label tombol */}
                {link.label === "&laquo; Previous" ? "Sebelumnya" : link.label === "Next &raquo;" ? "Berikutnya" : link.label}
              </button>
            );
          })
        )}
      </div>
    </div>
  )
}