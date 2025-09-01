import ContactSection from "@/components/landing/Contact";
import ArticleContent from "@/components/literasi/ArticleContent";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Navbar } from "@/components/shared/Navbar";

export default function LiteracyDetailPage() {
    return (
        <div className="">
            <Navbar />
            <Breadcrumb breadcrumbs={[{
                name: "Beranda", link: "/",
            }, {
                name: "Literasi", link: "/literasi",
            }, {
                name: "Detail", active: true,
            }]} />


            <ArticleContent/>

            
            
                        <AnimatedWrapper>
                            <ContactSection />
                        </AnimatedWrapper>
        </div>
    )
}