import ContactSection from "@/components/landing/Contact";
import ArticleContent from "@/components/literacies/ArticleContent";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Navbar } from "@/components/shared/Navbar";
import { getArticleById } from "@/features/articles/api";
import { notFound } from "next/navigation";

// 1. Fungsi untuk generate SEO Metadata secara dinamis
// export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
//   const slug = (await  params).id;
//   const article = await getArticleById(slug);

//   // Jika artikel tidak ditemukan, berikan metadata default
//   if (!article) {
//     return {
//       title: "Artikel Tidak Ditemukan",
//       description: "Halaman yang Anda cari tidak tersedia.",
//     };
//   }

//   // Jika artikel ditemukan, buat metadata dinamis
//   return {
//     title: article.title,
//     description: article.summary,
//     keywords: ['UMKM', 'Literasi Bisnis', article.category.name, ...article.title.split(' ').slice(0, 5)],
//     openGraph: {
//       title: article.title,
//       description: article.summary,
//       url: `/literasi/${article.slug}`,
//       siteName: 'Literasi UMKM Anda', // Ganti dengan nama situs Anda
//       images: [
//         {
//           url: article.imageUrl,
//           width: 1200,
//           height: 630,
//           alt: article.title,
//         },
//       ],
//       locale: 'id_ID',
//       type: 'article',
//     },
//     twitter: {
//         card: 'summary_large_image',
//         title: article.title,
//         description: article.summary,
//         images: [article.imageUrl],
//     },
//   };
// }


type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ArticleDetailPage({ params }: PageProps) {
    const { id } = await params;

    const {data:article} = await getArticleById(id);

    if (!article) {
        notFound();
    }

    return (
        <div className="">
            
            <Navbar />
            <Breadcrumb breadcrumbs={[{
                name: "Beranda", link: "/",
            }, {
                name: "Literasi", link: "/literasi",
            }, {
                name: article.title, active: true,
            }]} />

            <ArticleContent article={article} />

            <AnimatedWrapper>
                <ContactSection />
            </AnimatedWrapper>
        </div>
    )
}