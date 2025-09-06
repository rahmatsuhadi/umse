import Image from "next/image";
import { formatDate } from "@/lib/format-date";
import { Clock, Eye } from "lucide-react";
import { ShareButtons } from "./ShareButtons";

type ArticleDetail = {
    slug: string;
    title: string;
    summary: string;
    imageUrl: string;
    category: {
        name: string;
        slug: string;
    };
    published_at: string;
    reading_time: number; // dalam menit
    views: number;
    contentHtml: string; // Konten artikel dalam format HTML
};

type Props = {
    article: ArticleDetail;
};

export default function ArticleContent({ article }: Props) {
    return (
        <section className="py-8 bg-slate-50">
            <div className="container mx-auto px-4">
                <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header Artikel */}
                    <header className="p-6 sm:p-8 pb-0">
                        <div className="flex items-center space-x-4 mb-6">
                            <span className="bg-purple-100 text-purple-800 text-sm font-semibold px-4 py-1.5 rounded-full">
                                {article.category.name}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6 leading-tight">
                            {article.title}
                        </h1>
                        <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden mb-6">
                            <Image
                                fill
                                src={article.imageUrl}
                                alt={article.title}
                                className="object-cover"
                                priority // Prioritaskan gambar utama
                            />
                        </div>
                    </header>

                    {/* Konten Utama */}
                    <div className="px-6 sm:px-8">
                        <div className="bg-slate-50 rounded-lg p-4 mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-slate-500 gap-4">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center"><Clock size={14} className="mr-2" />{article.reading_time} menit baca</span>
                                    <span className="flex items-center"><Eye size={14} className="mr-2" />{article.views.toLocaleString('id-ID')} kali dilihat</span>
                                </div>
                                <time>Dipublikasikan: {formatDate(article.published_at)}</time>
                            </div>
                        </div>

                        {/* Render Konten HTML */}
                        <div
                            className="prose prose-lg max-w-none mb-8"
                            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                        />

                        {/* Tombol Bagikan (Client Component) */}
                        <ShareButtons title={article.title} />

                    </div>
                    <div className="p-6"></div>
                </article>
            </div>
        </section>
    );
}
