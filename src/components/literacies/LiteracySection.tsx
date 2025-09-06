"use client"

import { motion } from 'framer-motion';
import ArticleCard, { Article } from "./ArticleCard";
import Pagination from "../shared/Pagination";

// 1. Data Dummy untuk artikel (mensimulasikan respons API)
const dummyArticles: Article[] = [
  {
    slug: 'transformasi-digital-umkm',
    title: 'Transformasi Digital untuk UMKM: Langkah Awal yang Tepat',
    excerpt: 'Panduan praktis untuk memulai transformasi digital dalam bisnis UMKM dengan teknologi yang terjangkau dan mudah diimplementasikan.',
    imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    category: { name: 'Teknologi', slug: 'teknologi' },
    reading_time: 8,
    published_at: '2025-09-05T10:00:00Z',
  },
  {
    slug: 'strategi-pemasaran-media-sosial',
    title: '5 Strategi Pemasaran Efektif di Media Sosial untuk Pemula',
    excerpt: 'Pelajari cara memanfaatkan kekuatan media sosial untuk menjangkau lebih banyak pelanggan dan meningkatkan penjualan produk Anda.',
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-6d22e4f1d6d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    category: { name: 'Pemasaran', slug: 'pemasaran' },
    reading_time: 10,
    published_at: '2025-09-04T14:30:00Z',
  },
  {
    slug: 'mengelola-keuangan-bisnis',
    title: 'Tips Cerdas Mengelola Keuangan untuk Bisnis Kecil',
    excerpt: 'Manajemen keuangan yang baik adalah kunci keberhasilan. Temukan tips praktis untuk mengatur arus kas dan membuat anggaran.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-1696413565d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    category: { name: 'Keuangan', slug: 'keuangan' },
    reading_time: 7,
    published_at: '2025-09-02T09:00:00Z',
  },
  {
    slug: 'memahami-regulasi-pajak',
    title: 'Memahami Regulasi Pajak Terbaru untuk UMKM di 2025',
    excerpt: 'Tetap patuh pada peraturan pajak terbaru. Artikel ini merangkum poin-poin penting yang perlu diketahui setiap pemilik UMKM.',
    imageUrl: 'https://images.unsplash.com/photo-1586486855363-202375b455a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=871&q=80',
    category: { name: 'Regulasi', slug: 'regulasi' },
    reading_time: 12,
    published_at: '2025-08-28T11:00:00Z',
  },
  {
    slug: 'cerita-sukses-kopi-lokal',
    title: 'Inspirasi dari Balik Secangkir Kopi: Kisah Sukses Brand Lokal',
    excerpt: 'Bagaimana sebuah kedai kopi kecil di sudut kota bisa menjadi brand yang dicintai banyak orang? Simak perjalanan inspiratifnya.',
    imageUrl: 'https://images.unsplash.com/photo-1511920183353-3c7c90757d5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
    category: { name: 'Inspirasi', slug: 'inspirasi' },
    reading_time: 6,
    published_at: '2025-08-25T16:45:00Z',
  },
  {
    slug: 'layanan-pelanggan-terbaik',
    title: 'Membangun Loyalitas Melalui Layanan Pelanggan Prima',
    excerpt: 'Pelanggan yang puas adalah aset berharga. Pelajari cara memberikan layanan yang tidak hanya memuaskan tetapi juga mengesankan.',
    imageUrl: 'https://images.unsplash.com/photo-1556742044-1a93c8d4a4c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    category: { name: 'Panduan Bisnis', slug: 'panduan-bisnis' },
    reading_time: 9,
    published_at: '2025-08-22T08:00:00Z',
  },
];

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


export default function LiteracySection() {
  return (
    <div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {dummyArticles.map((article) => (
          <motion.div key={article.slug} variants={itemVariants}>
            <ArticleCard article={article} />
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-12">
        <Pagination />
      </div>
    </div>
  )
}