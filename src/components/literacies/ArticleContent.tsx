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


    const path = article.category == "announcement" ? "/pengumuman" :
        article.category == "exhibition" ? "/pameran" :
            article.category == "training" ? "/pelatihan" :
                "/literasi"


    return (
        <section style={{ background: 'var(--cream)', padding: '60px 0' }}>
            <div className="container">
                <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header Artikel */}
                    <header className="p-8 sm:p-10 pb-0">
                        <div className="flex items-center space-x-4 mb-6">
                            <span className="badge badge-terracotta text-sm font-semibold">
                                {article.category_label}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ color: 'var(--text-primary)' }}>
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
                    <div className="px-8 sm:px-10">
                        <div style={{ background: 'var(--cream-dark)', borderRadius: 'var(--radius-sm)', padding: '16px', marginBottom: '32px' }}>
                            <MetadataInfo content={article} />
                        </div>

                        {/* Render Konten HTML */}
                        <div
                            className="prose prose-lg max-w-none mb-10 ck-content"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Tombol Bagikan (Client Component) */}
                        <ShareButtons id={article.id} path={path} />

                    </div>
                    <div className="p-6"></div>
                </article>
            </div>
        </section>
    );
}
