"use client"

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const CATEGORY_OPTIONS = [
    { value: "", label: "Semua Kategori" },
    { value: "panduan-bisnis", label: "Panduan Bisnis" },
    { value: "tips-trik", label: "Tips & Trik" },
    { value: "regulasi", label: "Regulasi" },
    { value: "teknologi", label: "Teknologi" },
    { value: "inspirasi", label: "Inspirasi" },
];

const LEVEL_OPTIONS = [
    { value: "", label: "Semua Level" },
    { value: "pemula", label: "Pemula" },
    { value: "menengah", label: "Menengah" },
    { value: "lanjutan", label: "Lanjutan" },
];

const SORT_OPTIONS = [
    { value: "-created_at", label: "Terbaru" },
    { value: "-views", label: "Terpopuler" },
    { value: "title", label: "A-Z" },
];

export default function LiteracyFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [level, setLevel] = useState(searchParams.get('level') || '');
    const [sort, setSort] = useState(searchParams.get('sort') || '-created_at');

    const handleFilterChange = (type: 'category' | 'level' | 'sort', value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (value) {
            params.set(type, value);
        } else {
            // Hapus parameter dari URL jika nilainya kosong (misal: "Semua Kategori")
            params.delete(type);
        }

        // Ganti URL tanpa memuat ulang halaman penuh
        router.replace(`/literasi?${params.toString()}`, { scroll: false });
    };

    useEffect(() => {
        setCategory(searchParams.get('category') || '');
        setLevel(searchParams.get('level') || '');
        setSort(searchParams.get('sort') || '-created_at');
    }, [searchParams]);

    return (
        <section className="py-6 bg-white border-b sticky top-0 z-40">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    
                    {/* Filter Section */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <span className="text-gray-700 font-medium hidden sm:block">Filter:</span>
                        
                        {/* Kategori Dropdown */}
                        <select
                            value={category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        >
                            {CATEGORY_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        
                        {/* Level Dropdown */}
                        <select
                            value={level}
                            onChange={(e) => handleFilterChange('level', e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        >
                            {LEVEL_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Section */}
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700 font-medium">Urutkan:</span>
                        <select
                            value={sort}
                            onChange={(e) => handleFilterChange('sort', e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        >
                            {SORT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                </div>
            </div>
        </section>
    );
}