'use client';

import { FileQuestion } from 'lucide-react';
import { useInfiniteReports } from '@/features/reports/hook';
import ReportItemCard, { ReportItemCardSkeleton } from './ReportItemCard';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { Button } from '../ui/button';


export default function ReportList() {

  const searchParams = useSearchParams()



  const queryParams = useMemo(() => {
    const q = searchParams.get('q');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const filter: Record<string, string> = {};

    if (category) {
      filter['category'] = category;
    }
    if(status){
      filter['status'] = status
    }
    const params: { [key: string]: number | string | Record<string, string> } = {
      per_page: 5,
    };

    if (q) {
      params.q = q;
    }

    if (Object.keys(filter).length > 0) {
      params.filter = filter;
    }

    return params;
  }, [searchParams]);


   const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteReports(queryParams);

  const reports = data?.pages.flatMap(page => page.data) ?? [];

  return (
    <>
      <div className="space-y-4">

        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <ReportItemCardSkeleton key={i} />)
          : reports.map((report) => <ReportItemCard key={report.id} report={report} />)}

        {!isLoading && reports.length == 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FileQuestion className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-700">Tidak Ada Laporan</h3>
            <p className="mt-1 text-sm text-gray-500">Tidak ada laporan yang cocok dengan filter Anda.</p>
          </div>
        )}
      </div>
      {hasNextPage && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2"
          >
            {isFetchingNextPage ? 'Memuat...' : 'Muat Lebih Banyak'}
          </Button>
        </div>
      )}
      {/* TODO: Tambahkan komponen Pagination di sini */}
    </>
  );
}
