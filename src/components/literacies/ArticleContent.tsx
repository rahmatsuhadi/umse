import { formatDate } from "@/lib/format-date";
import { ShareButtons } from "./ShareButtons";
import { Article } from "@/types";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { IoLocation } from "react-icons/io5";

type Props = {
    article: Article;
};


const MetadataInfo = ({ content }: { content: Article & { date?: string } }) => {

    switch (content.category) {
        case 'exhibition':
        case 'training':    
            return (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-slate-600 gap-4">
                    {/* Tampilkan Tanggal Acara jika ada */}
                    {content.date && (
                        <div className="flex items-center">
                            <Calendar />
                            <p>
                                <strong>Tanggal Acara:</strong> {formatDate(content.date)}
                            </p>
                        </div>
                    )}
                    {/* Tampilkan Lokasi jika ada */}
                    {content.metadata?.location && (
                        <div className="flex items-center">
                            <IoLocation />
                            <p>
                                <strong>Lokasi:</strong> {content.metadata.location}
                            </p>
                        </div>
                    )}
                </div>
            );

        case 'literature':
        default:
            // Untuk artikel atau kategori lainnya, tampilkan tanggal publikasi
            return (
                <div className="flex items-center justify-between text-sm text-slate-500">
                    <time>Dipublikasikan: {formatDate(content.updated_at)}</time>
                </div>
            );
    }
};


export default function ArticleContent({ article }: Props) {


    const path = article.category=="announcement" ? "/pengumuman" : 
                article.category=="exhibition" ? "/pameran" : 
                article.category=="training" ? "/pelatihan" : 
                "/literasi"


    return (
        <section className="py-8 bg-slate-50">
            <div className="container mx-auto px-4">
                <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header Artikel */}
                    <header className="p-6 sm:p-8 pb-0">
                        <div className="flex items-center space-x-4 mb-6">
                            <span className="bg-purple-100 text-purple-800 text-sm font-semibold px-4 py-1.5 rounded-full">
                                {article.category_label}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6 leading-tight">
                            {article.title}
                        </h1>
                        <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden mb-6">
                            <Image
                                fill

                                src={article.thumbnail?.media_url || "/assets/no-image.jpg"}
                                alt={article.title}
                                className="object-cover"
                                priority // Prioritaskan gambar utama
                            />
                        </div>
                    </header>

                    {/* Konten Utama */}
                    <div className="px-6 sm:px-8">
                        <div className="bg-slate-50 rounded-lg p-4 mb-8">
                            <div className="bg-slate-50 rounded-lg p-4 mb-8">
                                <MetadataInfo content={article} />
                            </div>
                        </div>

                        {/* Render Konten HTML */}
                        <div
                            className="prose prose-lg max-w-none mb-8 ck-content"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Tombol Bagikan (Client Component) */}
                        <ShareButtons title={article.title} id={article.id}  path={path}  />

                    </div>
                    <div className="p-6"></div>
                </article>
            </div>
        </section>
    );
}
