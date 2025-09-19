import ContactSection from "@/components/landing/Contact";
import LiteracyFilter from "@/components/literacies/LiteracyFilter";
import LiteracySection from "@/components/literacies/LiteracySection";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Navbar } from "@/components/shared/Navbar";
import { PageHeader } from "@/components/shared/PageHeader";

export default function LiterasiPage() {
    return (
        <div className="bg-gray-50">
            <Navbar />

            <Breadcrumb breadcrumbs={[
                { name: "Beranda", link: "/" },
                { name: "Literasi UMKM", active: true }
            ]} />

            <PageHeader
                cardClass="from-purple-600 to-purple-700"
                title="Literasi UMKM"
                subtitle="Tingkatkan pengetahuan dan wawasan bisnis melalui artikel, panduan, dan sumber daya edukasi terlengkap untuk UMKM"
                icon={<i className="fas fa-book-open text-6xl mb-4"></i>}
            />


            <div className="md:px-10 py-10 pt-5">
                {/* <LiteracyFilter /> */}

                <AnimatedWrapper>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Artikel Terbaru</h2>
                    <LiteracySection category="literature" path="/literasi" />
                </AnimatedWrapper>


            </div>


            <AnimatedWrapper>
                <ContactSection />
            </AnimatedWrapper>

        </div>
    )
}