"use client";
import { motion } from 'framer-motion'; // 1. Impor motion dari framer-motion
import { useInfiniteProductsByStoreId } from "@/features/products/hooks";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import LoadMoreButton from '../shared/LoadMoreButton';
import { ProductCard } from './ProductCard';
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


const ProductListByStore = ({id}:{id:string}) => {

    // Panggil hook untuk mengambil data produk dengan filter saat ini
    // const { data: productsData, isLoading, isError } = useProducts({
    //     page,
    // });

    const searchParams = useSearchParams()

    const categoriesParams = searchParams.get('category') || ''

    const sortParams = searchParams.get('sort') || 'created_at:desc'

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteProductsByStoreId(id,{
        per_page: 12,
        sort: sortParams,

        filter: {
            category__slug: categoriesParams,

        },
        // sort: sortParams
    }); // Anda bisa menambahkan filter di sini, misal: { filter: { category_slug: 'makanan' }}


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

export default ProductListByStore



