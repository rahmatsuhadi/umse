import Link from 'next/link';
import { Plus, ClipboardList } from 'lucide-react';

export default function ReportPageHeader() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <ClipboardList className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Status Laporan Masalah</h1>
            <p className="text-gray-600">Pantau progress penyelesaian laporan masalah Anda</p>
          </div>
        </div>
        <Link href="/laporan/report-issue"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300">
          <Plus size={18} className="mr-2" />
          Laporkan Masalah Baru
        </Link>
      </div>
    </div>
  );
}
