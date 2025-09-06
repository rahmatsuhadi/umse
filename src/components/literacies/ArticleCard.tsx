import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/format-date"; // Asumsi Anda punya fungsi ini
import { Clock, ArrowRight } from "lucide-react";

// Definisikan tipe untuk props agar komponen bisa digunakan kembali
export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: {
    name: string;
    slug: string;
  };
  reading_time: number; // dalam menit
  published_at: string;
};

type ArticleCardProps = {
  article: Article;
};

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    // Seluruh kartu sekarang menjadi sebuah link yang dapat diklik
    <Link href={`/literasi/${article.slug}`} className="group block">
      <article className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300 border">
        
        {/* Bagian Gambar */}
        <div className="relative h-48 w-full">
          <Image
            fill
            src={article.imageUrl || "/assets/no-image.jpg"}
            alt={article.title}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Bagian Konten */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-3 text-sm">
            <span className="bg-sky-100 text-sky-800 font-medium px-3 py-1 rounded-full text-xs">
              {article.category.name}
            </span>
            <time className="text-slate-500">
              {formatDate(article.published_at)}
            </time>
          </div>

          <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors duration-300">
            {article.title}
          </h3>

          <p className="text-slate-600 mb-4 line-clamp-3 text-sm flex-grow">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
            <div className="flex items-center text-xs text-slate-500">
              <Clock size={14} className="mr-2" />
              <span>{article.reading_time} menit baca</span>
            </div>
            <div className="flex items-center text-primary font-semibold text-sm">
              Baca Selengkapnya
              <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}