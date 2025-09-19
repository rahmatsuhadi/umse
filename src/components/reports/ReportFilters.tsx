'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

// Opsi filter (bisa diambil dari API jika dinamis)
const STATUS_OPTIONS = [
  { value: "", label: "Semua Status" },
  { value: "pending", label: "Menunggu Respon" },
  { value: "in_progress", label: "Sedang Diproses" },
  { value: "resolved", label: "Selesai" },
  { value: "rejected", label: "Ditolak" },
  { value: "closed", label: "Ditutup" },
];

const CATEGORY_OPTIONS = [
  { value: "", label: "Semua Kategori" },
  { value: "payment", label: "Masalah Pembayaran" },
  { value: "product", label: "Masalah Produk" },
  { value: "shipping", label: "Masalah Pengiriman" },
  { value: "account", label: "Masalah Akun" },
  { value: "app", label: "Masalah Website/Aplikasi" },
  { value: "other", label: "Lainnya" },
];

export default function ReportFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State untuk setiap filter, diinisialisasi dari URL
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [query, setQuery] = useState(searchParams.get('q') || '');

  // Efek untuk memperbarui URL saat filter berubah
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Set atau hapus parameter berdasarkan nilai state
    status ? params.set('status', status) : params.delete('status');
    category ? params.set('category', category) : params.delete('category');
    query ? params.set('q', query) : params.delete('q');

    // Gunakan debounce untuk pencarian agar tidak memicu pencarian pada setiap ketikan
    const handler = setTimeout(() => {
      router.replace(`/laporan?${params.toString()}`, { scroll: false });
    }, 300); // Jeda 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [status, category, query, router, searchParams]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
            {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
            {CATEGORY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pencarian</label>
          <div className="relative">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nomor tiket atau judul..."
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}
