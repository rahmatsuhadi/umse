"use client";
import { motion } from 'framer-motion'; // 1. Impor motion dari framer-motion
import { useInfiniteProductsByStoreId } from "@/features/products/hooks";
import type { Store } from "@/types";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import LoadMoreButton from '../shared/LoadMoreButton';
import { ProductCard } from '../shared/ProductCard';
import { EmptyState } from '../shared/EmptyState';
import ProductSkeletonCard from './ProductSkeletonCard';


// 2. Definisikan varian animasi untuk container dan item
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


const ProductListByStore = ({ id, store }: { id: string, store?: Store }) => {
    const searchParams = useSearchParams()
    const categoriesParams = searchParams.get('category') || ''
    const sortParams = searchParams.get('sort') || 'created_at:desc'

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteProductsByStoreId(id, {
        per_page: 12,
        sort: sortParams,
        filter: {
            category__slug: categoriesParams,
        },
    });


    const products = data?.pages.flatMap(page => page.data) ?? [];

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="product-grid-lg">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} style={{ width: '100%', maxWidth: '220px', display: 'flex' }}>
                            <ProductSkeletonCard />
                        </div>
                    ))}
                </div>
            );
        }

        if (products.length === 0) {
            return (
                <EmptyState
                    title='Produk tidak ditemukan'
                    message='Coba ubah filter atau kata kunci pencarian Anda'
                />
            );
        }

        return (
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="product-grid-lg"
            >
                {products.map((product) => (
                    <motion.div key={product.id} variants={itemVariants} style={{ width: '100%', maxWidth: '220px', display: 'flex' }}>
                        <Link href={`/produk/${product.id}`} style={{ width: '100%', display: 'block', textDecoration: 'none' }}>
                            <ProductCard product={store ? { ...product, store } : product} />
                        </Link>
                    </motion.div>
                ))}
                {isFetchingNextPage && Array.from({ length: 4 }).map((_, index) => (
                    <div key={`loading-${index}`} style={{ width: '100%', maxWidth: '220px', display: 'flex' }}>
                        <ProductSkeletonCard />
                    </div>
                ))}
            </motion.div>
        );
    };

    return (
        <div className="w-full">
            {renderContent()}

            {hasNextPage && !isFetchingNextPage && (
                <div className="flex justify-center my-8">
                    <LoadMoreButton onClick={() => fetchNextPage()} label='Lihat Selengkapnya' />
                </div>
            )}
        </div>
    );
}

export default ProductListByStore



