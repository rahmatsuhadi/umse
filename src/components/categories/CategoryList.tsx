"use client";

import { useCategories } from "@/features/categories/hooks";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CategorySkeletonCard } from "../categories/CategorySkeletonCard";

export default function CategoryList() {
  const { data, isLoading } = useCategories();
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get("category");
  const initialCategories = categoryParam ? categoryParam.split(",") : [];

  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(initialCategories);

  const categories = data?.data || [];

  // Sinkronkan state jika URL berubah
  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setSelectedCategories(category.split(","));
    } else {
      setSelectedCategories([]);
    }
  }, [searchParams]);

  const handleCategoryClick = (slug: string) => {
    let updatedCategories = [...selectedCategories];

    if (updatedCategories.includes(slug)) {
      updatedCategories = updatedCategories.filter(
        (category) => category !== slug
      );
    } else {
      updatedCategories.push(slug);
    }

    setSelectedCategories(updatedCategories);

    const params = new URLSearchParams(searchParams.toString());

    if (updatedCategories.length > 0) {
      // Gabungkan kategori yang dipilih menjadi string yang dipisahkan koma
      params.set("category", updatedCategories.join(","));
    } else {
      params.delete("category");
    }

    // Update URL
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const renderContent = () => {
    if (isLoading) {
      return Array(6)
        .fill(null)
        .map((_, index) => <CategorySkeletonCard key={index} />);
    } else if (!isLoading && categories.length > 0) {
      return categories.map((category) => {
        // 4. Pengecekan 'isActive' untuk banyak kategori
        const isActive = selectedCategories.includes(category.slug);
        return (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.slug)}
            className={`
    flex flex-col items-center justify-center gap-2
    p-3 sm:p-4 rounded-xl border cursor-pointer
    transition-all duration-300 ease-in-out
    ${
      isActive
        ? "bg-primary text-white border-primary shadow-md scale-105"
        : "bg-orange-50 border-orange-200 text-gray-700 hover:shadow-md hover:scale-105 hover:border-primary"
    }
  `}
          >
            {/* Icon wrapper */}
            <div
              className={`
      flex items-center justify-center
      w-12 h-12 sm:w-14 sm:h-14 
      transition-all duration-300
      ${isActive ? "bg-white/20" : "bg-primary/10 group-hover:bg-primary/20"}
    `}
            >
              <Image
                className="object-contain w-8 h-8 sm:w-20 sm:h-20"
                src={category.icon_url || "/assets/no-image.jpg"}
                width={100}
                height={100}
                alt={"icon-" + category.id}
              />
            </div>

            {/* Category Name */}
            <h3
              className={`
      text-xs sm:text-sm font-medium text-center leading-tight line-clamp-1
      transition-colors duration-300
      ${isActive ? "text-white" : "text-gray-800 group-hover:text-primary"}
    `}
            >
              {category.name}
            </h3>
          </div>
        );
      });
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Kategori Pilihan
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {renderContent()}
        </div>
      </div>
    </section>
  );
}
