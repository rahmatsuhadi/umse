import Breadcrumb from "@/components/shared/Breadcrumb";
import { Navbar } from "@/components/shared/Navbar";
import ContactSection from "@/components/landing/Contact";
import LiteracySection from "@/components/literacies/LiteracySection";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import { PageHeader } from "@/components/shared/PageHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Jadwal Pelatihan & Workshop Bisnis untuk UMKM',
  
  description: 'Temukan dan daftar berbagai pelatihan bisnis dan workshop yang dirancang khusus untuk UMKM di Sleman. Tingkatkan keahlian Anda dalam pemasaran digital, manajemen keuangan, dan fotografi produk bersama Slemanmart.',
};

export default function PelatihanPage() {
    return (
    <div className="bg-gray-50">
            <Navbar />

            <Breadcrumb breadcrumbs={[
                { name: "Beranda", link: "/" },
                { name: "Pelatihan", active: true }
            ]} />

            <PageHeader
                cardClass="from-green-600 to-green-700"
                title="Info Pelatihan UMKM"
                subtitle=" Tingkatkan kemampuan dan pengetahuan bisnis Anda melalui berbagai
                            program pelatihan yang dirancang khusus untuk UMKM"
                icon={<i className="fas fa-graduation-cap text-6xl mb-4"></i>}
            />


            <div className="md:px-10 py-10 pt-5">
                {/* <LiteracyFilter /> */}

                <AnimatedWrapper>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Pelatihan Terbaru</h2>
                   <LiteracySection 
                   path="/pelatihan" 
                   category="training"/>
                </AnimatedWrapper>


            </div>


            <AnimatedWrapper>
                <ContactSection />
            </AnimatedWrapper>

        </div>
    )
}