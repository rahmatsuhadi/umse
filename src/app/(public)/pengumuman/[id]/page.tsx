import ContactSection from "@/components/landing/Contact";
import ArticleContent from "@/components/literacies/ArticleContent";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Navbar } from "@/components/shared/Navbar";
import { getArticleById } from "@/features/articles/api";
import { APP_URL } from "@/lib/envConfig";
import { CategoryArticle } from "@/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {

    const id = (await params).id

    const { data: article } = await getArticleById(id);

    if (!article) {
        return { title: 'Pengumunan Tidak Ditemukan' };
    }
    return {
        title: article.title,
        description: article.excerpt,
        openGraph: {
            title: article.title,
            description: article.excerpt,
            url: `${APP_URL}/pengumunan/${article.id}` , 
            siteName: 'Slemanmart',
            images: [
                {
                    url: article.thumbnail ? article.thumbnail.media_url : '/assets/no-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
            locale: 'id_ID',
            type: 'article', 
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.excerpt,
            images: [ article.thumbnail ? article.thumbnail.media_url : '/assets/no-image.jpg'],
        }
    };
}



type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function PengumumanDetailPage({ params }: PageProps) {
    const { id } = await params;

    const {data:article} = await getArticleById(id);

    const category:CategoryArticle = "announcement";
    if (!article || category != article.category) {
        notFound();
    }

    return (
        <div className="">
            
            <Navbar />
            <Breadcrumb breadcrumbs={[{
                name: "Beranda", link: "/",
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