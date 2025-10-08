import Image from "next/image";
import { formatDate, formatDateOnly } from "@/lib/format-date"; // Asumsi Anda punya fungsi ini
import { Clock, ArrowRight, MapPin } from "lucide-react";
import { Article } from "@/types";

type ArticleCardProps = {
  article: Article & { date?: string };
};

export default function ArticleCard({ article }: ArticleCardProps) {
  const displayDate =
    article.category === "literature"
      ? article.updated_at
      : article.date || article.created_at;
  return (
    // Seluruh kartu sekarang menjadi sebuah link yang dapat diklik
    <article className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300 border">
      {/* Bagian Gambar */}
      <div className="relative h-48 w-full">
        <Image
          fill
          src={article.thumbnail?.media_url || "/assets/no-image.jpg"}
          alt={article.title}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Bagian Konten */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3 text-sm">
          <span className="bg-sky-100 text-sky-800 font-medium px-3 py-1 rounded-full text-xs">
            {article.category_label}
          </span>
          {!!article.date && article.category != "literature" && (
            <time className="text-slate-500 text-xs">
              {formatDateOnly(article.date)}
            </time>
          )}
        </div>

        <h3
          className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors duration-300
               overflow-hidden whitespace-nowrap text-ellipsis"
        >
          {article.title}
        </h3>

        <p className="text-slate-600 mb-4 line-clamp-3 text-sm flex-grow">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <CardFooterInfo content={article} />
          <div className="flex items-center text-primary font-semibold text-sm">
            Selengkapnya
            <ArrowRight
              size={16}
              className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

const CardFooterInfo = ({
  content,
}: {
  content: Article & { date?: string };
}) => {
  switch (content.category) {
    case "exhibition":
    case "training":
      if (content.metadata?.location) {
        return (
          <div className="flex items-center text-xs text-slate-500">
            <MapPin size={14} className="mr-2 flex-shrink-0" />
            <span className="truncate">{content.metadata.location}</span>
          </div>
        );
      }
      // Jika tidak ada lokasi, tampilkan tanggal acara
      return (
        <div className="flex items-center text-xs text-slate-500">
          <Clock size={14} className="mr-2" />
          <span>{content.date ? formatDate(content.date) : "Segera"}</span>
        </div>
      );

    case "literature":
    default:
      // Untuk artikel, tampilkan tanggal publikasi
      return (
        <div className="flex items-center text-xs text-slate-500">
          <Clock size={14} className="mr-2" />
          <span>{formatDate(content.updated_at)}</span>
        </div>
      );
  }
};
