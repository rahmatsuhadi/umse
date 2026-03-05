import ContactSection from "@/components/landing/Contact";
import ArticleContent from "@/components/literacies/ArticleContent";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Navbar } from "@/components/shared/Navbar";
import Link from "next/link";
import { getArticleById } from "@/features/articles/api";
import { APP_URL } from "@/lib/envConfig";
import { isUUID } from "@/lib/uuid-check";
import { CategoryArticle } from "@/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const id = (await params).id;

  if (!isUUID(id)) {
    return { title: "Artikel Tidak Ditemukan" };
  }

  try {
    const { data: article } = await getArticleById(id);

    if (!article) {
      return { title: "Artikel Tidak Ditemukan" };
    }
    return {
      title: article.title,
      description: article.excerpt,
      openGraph: {
        title: article.title,
        description: article.excerpt,
        url: `${APP_URL}/literasi/${article.id}`,
        siteName: "Slemanmart",
        images: [
          {
            url: article.thumbnail
              ? article.thumbnail.media_url
              : "/assets/no-image.jpg",
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ],
        locale: "id_ID",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.excerpt,
        images: [
          article.thumbnail
            ? article.thumbnail.media_url
            : "/assets/no-image.jpg",
        ],
      },
    };
  } catch {
    return { title: "Artikel Tidak Ditemukan" };
  }
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!isUUID(id)) return notFound();

  try {
    const { data: article } = await getArticleById(id);

    return (
      <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
        <Navbar />
        <div className="article-container" style={{ paddingBottom: '0' }}>
          <div className="article-breadcrumb">
            <Link href="/" className="article-breadcrumb-item">Beranda</Link>
            <span className="article-breadcrumb-separator">/</span>
            <Link href="/literasi" className="article-breadcrumb-item">Literasi</Link>
            <span className="article-breadcrumb-separator">/</span>
            <span className="article-breadcrumb-item active">{article.title}</span>
          </div>
        </div>

        <ArticleContent article={article} />

        <AnimatedWrapper>
          <ContactSection />
        </AnimatedWrapper>
      </div>
    );
  } catch {
    return notFound();
  }
}
