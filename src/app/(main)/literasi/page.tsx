import ContactSection from "@/components/landing/Contact";
import ArticleCard from "@/components/literasi/ArticleCard";
import LiteracyFilter from "@/components/literasi/Filter";
import LiteracySection from "@/components/literasi/LiteracySection";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Navbar } from "@/components/shared/Navbar";
import Pagination from "@/components/shared/Pagination";

export default function LiterasiPage() {
    return (
        <div>
            <Navbar />

            <Breadcrumb breadcrumbs={[
                { name: "Beranda", link: "/" },
                { name: "Literasi UMKM", active: true }
            ]} />


            <section
                className="py-12 bg-gradient-to-r from-purple-600 to-purple-700 text-white"
            >
                <div className="container mx-auto px-4 text-center">
                    <div className="mb-8">
                        <i className="fas fa-book-open text-6xl mb-4"></i>
                        <h1 className="text-4xl font-bold mb-4">Literasi UMKM</h1>
                        <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                            Tingkatkan pengetahuan dan wawasan bisnis melalui artikel, panduan,
                            dan sumber daya edukasi terlengkap untuk UMKM
                        </p>
                    </div>
                </div>
            </section>


            <div className="md:px-10 py-10 pt-5">
                <LiteracyFilter />

                <AnimatedWrapper>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Artikel Terbaru</h2>
                   <LiteracySection/>
                </AnimatedWrapper>


            </div>


            <AnimatedWrapper>
                <ContactSection />
            </AnimatedWrapper>

        </div>
    )
}