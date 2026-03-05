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
        <section style={{ background: 'var(--cream)', padding: '0' }}>
            <div className="article-container">
                {/* Header Artikel */}
                <header className="article-header">
                    <h1 className="article-title-main">
                        {article.title}
                    </h1>
                    <div className="article-meta-row">
                        <span className="badge badge-terracotta">
                            {article.category_label}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(article.updated_at)}
                        </span>
                        <span className="flex items-center gap-1">
                            ✍️ Tim Redaksi
                        </span>
                    </div>
                </header>

                <div className="article-cover-wrapper">
                    <Image
                        fill
                        src={article.thumbnail?.media_url || "/assets/no-image.jpg"}
                        alt={article.title}
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Konten Utama */}
                <div className="article-content">
                    {/* Render Konten HTML */}
                    <div
                        className="prose-slate max-w-none mb-10 ck-content"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* Tombol Bagikan (Client Component) */}
                    <ShareButtons id={article.id} path={path} />
                </div>
            </div>
        </section>
    );
}
