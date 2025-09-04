"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/features/categories/hooks";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CategoriesSection() {
  const { data, isLoading } = useCategories();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const categoryParam = searchParams.get('category');
  const initialCategories = categoryParam ? categoryParam.split(',') : [];
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);

  const categories = data?.data || [];

  // Sinkronkan state jika URL berubah
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategories(category.split(','));
    } else {
      setSelectedCategories([]);
    }
  }, [searchParams]);

  const handleCategoryClick = (slug: string) => {
    let updatedCategories = [...selectedCategories];
    
    if (updatedCategories.includes(slug)) {
      updatedCategories = updatedCategories.filter(category => category !== slug);
    } else {
      updatedCategories.push(slug);
    }

    setSelectedCategories(updatedCategories);

    const params = new URLSearchParams(searchParams.toString());

    if (updatedCategories.length > 0) {
      // Gabungkan kategori yang dipilih menjadi string yang dipisahkan koma
      params.set('category', updatedCategories.join(','));
    } else {
      params.delete('category');
    }

    // Update URL
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Kategori Pilihan</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {isLoading ? (
            Array(6).fill(null).map((_, index) => (
              <div key={index} className="flex flex-col items-center p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200">
                <Skeleton className="w-12 h-10 mb-2" />
                <Skeleton className="w-24 h-6" />
              </div>
            ))
          ) : (
            categories.map((category) => {
              // 4. Pengecekan 'isActive' untuk banyak kategori
              const isActive = selectedCategories.includes(category.slug);
              return (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.slug)}
                  className={`flex flex-col items-center p-3 sm:p-4 ${isActive ? 'bg-primary text-white' : 'bg-orange-50'} hover:bg-orange-100 rounded-lg border ${isActive ? 'border-primary' : 'border-orange-200'} hover:border-primary transition duration-300 group cursor-pointer`}
                >
                  <div className={`rounded-lg w-10 h-8 sm:w-12 sm:h-10 flex items-center justify-center mb-2 ${isActive ? 'bg-white' : 'bg-primary'}`}>
                    <Image className="object-cover w-full h-full rounded-sm"  src={category.icon_url} width={32} height={32} alt={category.name}/>
                  </div>
                  <h3 className={`text-xs sm:text-sm font-medium text-center leading-tight ${isActive ? 'text-white' : 'text-gray-800'}`}>
                    {category.name}
                  </h3>
                </div>
              )
            })
          )}
        </div>
      </div>
    </section>
  );
}
