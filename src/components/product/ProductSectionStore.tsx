"use client";
import { motion, useInView } from 'framer-motion'; // 1. Impor motion dari framer-motion
import { useInfiniteProducts, useInfiniteProductsByStoreId } from "@/features/products/hooks";
import Link from "next/link";
import { useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { CardProduct, CardProductSkleton } from './ProductSection';


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


const ProductSectionStore = ({id}:{id:string}) => {

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


    return (
        <section className="py-12 ">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Produk</h2>
                {!isLoading && products.length === 0 && (
                    <div className="text-center text-gray-500 py-12">
                        <i className="fas fa-box-open text-4xl mb-4 text-gray-400"></i>
                        <p className="text-lg font-medium">Produk tidak ditemukan</p>
                        <p className="text-sm">Coba ubah filter atau kata kunci pencarian Anda</p>
                    </div>
                )}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">


                    {isLoading
                        ? Array(8).fill(null).map((_, index) => (
                            <CardProductSkleton key={index} />
                        ))
                        : products.map((product) => (
                            <motion.div key={product.id} variants={itemVariants}>
                                <Link href={"/produk/" + product.id}>
                                    <CardProduct product={product} />
                                </Link>
                            </motion.div>
                        ))}

                    {isFetchingNextPage && Array(4).fill(null).map((_, index) => (
                        <CardProductSkleton key={`loading-${index}`} />
                    ))}
                </motion.div>

                {/* <Pagination/> */}
                {/* <ButtonLoadMore /> */}
                {hasNextPage && (
                    <div className="flex justify-center my-8">
                        <button onClick={() => fetchNextPage()} type="button" className="bg-primary hover:cursor-pointer  text-white px-10 py-3 rounded-full font-medium hover:bg-primary-dark transition duration-300">
                            Lihat Selengkapnya
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}

export default ProductSectionStore



