"use client";
import { motion, useInView } from 'framer-motion'; // 1. Impor motion dari framer-motion
import { useInfiniteProducts } from "@/features/products/hooks";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useRef } from 'react';
import { useSearchParams } from 'next/navigation';


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


const ProductSection = () => {

    // Panggil hook untuk mengambil data produk dengan filter saat ini
    // const { data: productsData, isLoading, isError } = useProducts({
    //     page,
    // });

    const searchParams = useSearchParams()
    
    const search = searchParams.get('q') || ''

    const categoriesParams = searchParams.get('category') || ''

    const sortParams = searchParams.get('sort') || 'created_at:desc'

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteProducts({
        per_page: 12,
        sort: sortParams,
        q: search,
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

export default ProductSection


export const CardProductSkleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 group h-full flex flex-col">
            {/* Skeleton untuk Gambar */}
            <div className="bg-gray-300 h-40 md:h-48 flex items-center justify-center relative">
                <div className="w-full h-full bg-gray-400 animate-pulse"></div>
            </div>

            {/* Skeleton untuk Konten */}
            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                    {/* Skeleton untuk Kategori */}
                    <div className="w-16 h-4 bg-gray-300 rounded-full animate-pulse"></div>

                    {/* Skeleton untuk Rating */}
                    <div className="flex items-center text-yellow-400">
                        <i className="fas fa-star text-xs"></i>
                        <div className="ml-1 w-12 h-3 bg-gray-300 rounded-full animate-pulse"></div>
                    </div>
                </div>

                {/* Skeleton untuk Nama Produk */}
                <div className="w-3/4 h-5 bg-gray-300 rounded-md animate-pulse mb-1"></div>

                {/* Skeleton untuk Nama Toko */}
                <div className="w-1/2 h-3 bg-gray-300 rounded-full animate-pulse mb-1"></div>

                {/* Skeleton untuk Alamat Toko */}
                <div className="w-3/4 h-3 bg-gray-300 rounded-full animate-pulse mb-3"></div>

                <div className="flex items-center justify-between mt-auto">
                    {/* Skeleton untuk Harga */}
                    <div>
                        <div className="w-24 h-6 bg-gray-300 rounded-md animate-pulse mb-2"></div>
                        <div className="w-16 h-3 bg-gray-300 rounded-full animate-pulse"></div>
                    </div>

                    {/* Skeleton untuk Button */}
                    <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}


interface CardProductProps {
    product: Product
}

export const CardProduct = ({ product }: CardProductProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });
    return (
        <div ref={ref} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 group h-full flex flex-col">
            <div className="bg-gray-300 h-40 md:h-48 flex items-center justify-center relative">
                {/* <i className="fas fa-image text-gray-500 text-2xl md:text-3xl"></i> */}
                {isInView && (
                    <Image
                        src={product.thumbnail?.media_url || '/hero/hero.png'}
                        alt={product.name}
                        fill
                        className="absolute inset-0 object-cover"
                        loading="lazy"
                    />
                )}
            </div>
            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                    <span className="bg-orange-100 text-orange-800 text-xs sm:text-xs md:text-base px-2 py-1 rounded-full flex-shrink-0 max-w-[60%] truncate">
                        {product.category.name}
                    </span>

                    <div className="flex items-center text-yellow-400"><i className="fas fa-star text-xs"></i><span className="text-gray-600 text-xs ml-1">{product.average_rating}</span></div>
                </div>
                <h3 className="font-bold text-gray-800 mb-1 text-sm md:text-base group-hover:text-primary">{product.name}</h3>
                <p className="text-xs text-gray-600 mb-1">{product.store ? product.store.name : "Store"}</p>
                <p className="text-xs text-gray-500 mb-3">{product.store ? product.store.address : "Location"}</p>
                <div className="flex items-center justify-between mt-auto">
                    <div><span className="text-primary font-bold text-sm md:text-lg">Rp {product.price.value.toLocaleString('id-ID')}</span><p className="text-xs text-gray-500">Stok: {product.stock_quantity}</p></div>
                    <button onClick={(e) => { console.log(e) }} className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition duration-300"><i className="fas fa-shopping-cart text-sm"></i></button>
                </div>
            </div>
        </div>
    )
}


