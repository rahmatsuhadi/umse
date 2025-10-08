import Breadcrumb from "@/components/shared/Breadcrumb";
import { Navbar } from "@/components/shared/Navbar";
import ContactSection from "@/components/landing/Contact";
import LiteracySection from "@/components/literacies/LiteracySection";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import { PageHeader } from "@/components/shared/PageHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jadwal Pameran & Expo UMKM Sleman",

  description:
    "Dapatkan informasi terbaru mengenai jadwal pameran, expo, dan bazaar yang menampilkan produk-produk unggulan dari UMKM Sleman. Jangan lewatkan kesempatan untuk mengunjungi dan mendukung karya lokal.",
};

export default function PelatihanPage() {
  return (
    <div className="bg-gray-50">
      <Navbar />

      <Breadcrumb
        breadcrumbs={[
          { name: "Beranda", link: "/" },
          { name: "Pameran", active: true },
        ]}
      />

      <PageHeader
        cardClass="from-green-600 to-green-700"
        title="Info Pelatihan UMKM"
        subtitle="Ikuti berbagai pameran dan expo UMKM untuk memamerkan produk, memperluas jaringan, dan meningkatkan penjualan bisnis Anda
"
        icon={<i className="fas fa-calendar-cap text-6xl mb-4"></i>}
      />

      <div className="md:px-10 py-10 pt-5 px-5">
        {/* <LiteracyFilter /> */}

        <AnimatedWrapper>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Pameran Terbaru
          </h2>
          <LiteracySection category="exhibition" path="/pameran" />
        </AnimatedWrapper>
      </div>

      <AnimatedWrapper>
        <ContactSection />
      </AnimatedWrapper>
    </div>
  );
}
