import ContactSection from "@/components/landing/Contact";
import LiteracySection from "@/components/literacies/LiteracySection";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Navbar } from "@/components/shared/Navbar";
import { PageHeader } from "@/components/shared/PageHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pusat Literasi & Edukasi UMKM",

  description:
    "Temukan kumpulan artikel, panduan, dan materi edukasi untuk membantu UMKM di Sleman tumbuh dan berkembang. Pelajari tips bisnis, pemasaran digital, dan manajemen dari Slemanmart.",
};

export default function LiterasiPage() {
  return (
    <div style={{ background: 'var(--cream)' }}>
      <Navbar />

      <Breadcrumb
        breadcrumbs={[
          { name: "Beranda", link: "/" },
          { name: "Literasi UMKM", active: true },
        ]}
      />

      <PageHeader
        cardClass="from-[#F7620A] to-[#D45508]"
        title="Literasi UMKM"
        subtitle="Tingkatkan pengetahuan dan wawasan bisnis melalui artikel, panduan, dan sumber daya edukasi terlengkap untuk UMKM"
        icon={<i className="fas fa-book-open text-6xl mb-4"></i>}
      />

      <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        {/* <LiteracyFilter /> */}

        <AnimatedWrapper>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Artikel Terbaru
          </h2>
          <LiteracySection category="literature" path="/literasi" />
        </AnimatedWrapper>
      </div>

      <AnimatedWrapper>
        <ContactSection />
      </AnimatedWrapper>
    </div>
  );
}
