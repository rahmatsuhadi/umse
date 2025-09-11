"use client"
import { motion } from 'framer-motion';
import { useInfiniteProducts } from "@/features/products/hooks";
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import LoadMoreButton from '../shared/LoadMoreButton';
import Link from 'next/link';
import ProductSkeletonCard from './ProductSkeletonCard';
import { EmptyState } from '../shared/EmptyState';
import { ProductCard } from './ProductCard';



//definisi animasi

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.07, // Jeda animasi antar kartu (dalam detik)
        },
    },
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 }, // Mulai dari bawah & transparan
    visible: { opacity: 1, y: 0 }, // Muncul ke posisi normal
};


export default function ProductList() {

    const searchParams = useSearchParams();


    const queryParams = useMemo(() => {
        const q = searchParams.get('q');
        const category__slug = searchParams.get('category');
        const max_price = searchParams.get('maxPrice');
        const min_price = searchParams.get('minPrice');
        const sort = searchParams.get('sort');

        const filter: Record<string, string> = {};

        // 2. Bangun objek filter secara dinamis
        //    Hanya tambahkan properti ke filter jika nilainya ada di URL
        if (category__slug) {
            filter['category__slug'] = category__slug;
        }
        if (max_price) {
            filter['max_price'] = max_price;
        }
        if (min_price) {
            filter['min_price'] = min_price;
        }

        const params: { [key: string]: number | string | Record<string, string> } = {
            per_page: 12,
            sort: sort || '-created_at', // Gunakan default sort jika tidak ada
        };

        if (q) {
            params.q = q;
        }

        // Hanya tambahkan objek filter jika tidak kosong
        if (Object.keys(filter).length > 0) {
            params.filter = filter;
        }

        return params;
    }, [searchParams]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteProducts(queryParams);

    const products = data?.pages.flatMap(page => page.data) ?? [];


    const renderContent = () => {
        // State: Loading
        if (isLoading) {
            return (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <ProductSkeletonCard key={index} />
                    ))}
                </div>
            );
        }

        // State: Produk tidak ditemukan
        if (products.length === 0) {
            return (
                <EmptyState
                    title='Produk tidak ditemukan'
                    message='Coba ubah filter atau kata kunci pencarian Anda'
                />
            );
        }

        // State: Product
        return (
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6"
            >
                {products.map((product) => (
                    <motion.div key={product.id} variants={itemVariants}>
                        <Link href={`/produk/${product.id}`}>
                            <ProductCard product={product} />
                        </Link>
                    </motion.div>
                ))}
                {/* Skeleton  halaman berikutnya */}
                {isFetchingNextPage && Array.from({ length: 4 }).map((_, index) => (
                    <ProductSkeletonCard key={`loading-${index}`} />
                ))}
            </motion.div>
        );
    };

    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Produk</h2>

                {renderContent()}

                {hasNextPage && !isFetchingNextPage && (
                    <div className="flex justify-center my-8">
                        <LoadMoreButton onClick={() => fetchNextPage()} label='Lihat Selengkapnya' />
                    </div>
                )}
            </div>
        </section>
    );
}