"use client"

import { motion } from 'framer-motion';
import ArticleCard from "./ArticleCard";
import Pagination from "../shared/Pagination";
import { usePaginationArticles } from '@/features/articles/hook';
import { useSearchParams } from 'next/navigation';
import { ArticleCardSkeleton } from './ArticleCardSkeleton';
import { FileText } from 'lucide-react';
import { API_URL } from '@/lib/envConfig';
import { CategoryArticle } from '@/types';
import Link from 'next/link';


// Varian animasi (tidak berubah)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};


export default function LiteracySection({ category, path }: { path: string, category: CategoryArticle }) {

  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const itemsPerPage = 6; // Tentukan jumlah item per halaman

  const { data, isLoading } = usePaginationArticles({
    category: category,
    page: page,
    per_page: itemsPerPage,
  });

  const articles = data?.data ?? [];

  return (
    <div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {isLoading ? (
          [...Array(itemsPerPage)].map((_, index) => (
            <motion.div key={`skeleton-${index}`} variants={itemVariants}>
              <ArticleCardSkeleton />
            </motion.div>
          ))

        ) : articles.length > 0 ? (
          articles?.map((article) => (
            <motion.div key={article.slug} variants={itemVariants}>
              <Link href={`${path}/${article.id}`} className="group block h-full">
                <ArticleCard article={article} />
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-slate-50 rounded-lg text-center">
            <FileText size={48} className="text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700">Data Tidak Ditemukan</h3>
            <p className="text-slate-500 mt-2">
              Belum ada  yang dipublikasikan.
            </p>
          </div>
        )}
      </motion.div>

      <div className="mt-12">
        <Pagination meta={data?.meta} isLoading={isLoading} />
      </div>
    </div>
  )
}