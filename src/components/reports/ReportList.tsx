'use client';

import { useSearchParams } from 'next/navigation';
import ReportItemCard, { Report } from './ReportItemCard';
import { FileQuestion } from 'lucide-react';

// Data dummy untuk simulasi
const DUMMY_REPORTS: Report[] = [
    { id: '1', ticketNumber: '#RPT-2024-001234', title: 'Produk tidak sesuai dengan deskripsi', category: 'Masalah Produk', status: 'in-progress', createdAt: '2024-08-15T10:00:00Z', updatedAt: '2024-08-16T11:00:00Z', assignedTo: 'Tim Support' },
    { id: '2', ticketNumber: '#RPT-2024-001233', title: 'Pembayaran tidak terdeteksi', category: 'Masalah Pembayaran', status: 'resolved', createdAt: '2024-08-14T09:00:00Z', updatedAt: '2024-08-15T14:00:00Z', assignedTo: 'Tim Finance' },
    { id: '3', ticketNumber: '#RPT-2024-001232', title: 'Website tidak bisa diakses', category: 'Masalah Website/Aplikasi', status: 'waiting', createdAt: '2024-08-13T15:00:00Z', updatedAt: '2024-08-14T08:00:00Z', assignedTo: 'Tim Technical' },
];

export default function ReportList() {
  
  // TODO: Ganti ini dengan data fetching hook (misal: useInfiniteReports)
  // const { data: reports, isLoading } = useInfiniteReports({
  //   status: searchParams.get('status') || '',
  //   category: searchParams.get('category') || '',
  //   q: searchParams.get('q') || '',
  // });
  const isLoading = false; // Ganti dengan state dari hook
  const reports = DUMMY_REPORTS; // Ganti dengan data dari hook

  // if (isLoading) {
  //   return <div>Loading Skeleton...</div>
  // }
  
  if (!isLoading && reports.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <FileQuestion className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-4 text-lg font-semibold text-gray-700">Tidak Ada Laporan</h3>
        <p className="mt-1 text-sm text-gray-500">Tidak ada laporan yang cocok dengan filter Anda.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {reports.map(report => (
          <ReportItemCard key={report.id} report={report} />
        ))}
      </div>
      {/* TODO: Tambahkan komponen Pagination di sini */}
    </>
  );
}
