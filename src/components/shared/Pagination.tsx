"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton"; // Sesuaikan path
import { Meta } from '@/types';

type PaginationProps = {
  meta: Meta | undefined;
  isLoading?: boolean;
};

export default function Pagination({ meta, isLoading }: PaginationProps) {
  // Hooks baru dari next/navigation
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: string | null) => {
    if (!page) return;

    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set('page', page);

    router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
  };

  const getPageFromUrl = (url: string | null): string | null => {
    if (!url) return null;
    try {
      return new URL(url).searchParams.get('page');
    } catch (e) {
      return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center mt-12">
        <div className="flex items-center space-x-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-12 h-11 rounded-lg bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  if (!meta || !meta.links || meta.last_page === 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-12">
      <div className="flex items-center space-x-2">
        {meta.links.map((link, i) => {
          const isPrevButton = link.label.includes("Previous");
          const isNextButton = link.label.includes("Next");
          const pageNumber = getPageFromUrl(link.url);

          let buttonContent;
          if (isPrevButton) {
            buttonContent = <i className="fas fa-chevron-left"></i>;
          } else if (isNextButton) {
            buttonContent = <i className="fas fa-chevron-right"></i>;
          } else {
            buttonContent = link.label;
          }

          return (
            <button
              key={i}
              onClick={() => handlePageChange(pageNumber)}
              disabled={!link.url || isLoading}
              className={`px-4 py-2 rounded-lg  transition-colors duration-200
                ${link.active
                  ? "bg-primary text-white cursor-default"
                  : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                }
                disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
              `}
            >
              {buttonContent}
            </button>
          );
        })}
      </div>
    </div>
  );
}