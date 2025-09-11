"use client"
import { useProducts } from "@/features/products/hooks";
import Link from "next/link";
import SkeletonProductCard from "./ProductSkeletonCard";
import { ProductCard } from "./ProductCard";

export default function ProductSimilarProduct({category_slug}:{category_slug:string}) {

    const { data, isLoading } = useProducts({ per_page: 4,filter: category_slug ? {category__slug: category_slug} : undefined });

    const products = data?.data || []

    return (

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {isLoading
                ? Array(4).fill(null).map((_, index) => (
                    <SkeletonProductCard key={index} />
                ))
                : products.map((product) => (
                        <Link key={product.id} href={"/produk/" + product.id}>
                            <ProductCard product={product} />
                        </Link>
                ))}
        </div>
    );
}