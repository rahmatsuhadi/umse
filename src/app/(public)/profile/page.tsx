import AnnouncementsSection from "@/components/home/AnouncementSection";
import FeaturesSection from "@/components/home/FeatureSection";
import HeroSection from "@/components/home/HeroSection";
import ContactSection from "@/components/landing/Contact";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import { Navbar } from "@/components/shared/Navbar";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: {
    default: 'Slemanmart - Platform Digital UMKM Sleman',
    template: '%s | Slemanmart',
  },
  description: "Temukan produk dan layanan terbaik dari UMKM di Kabupaten Sleman melalui platform digital DISKOPUKM.",
};


export default function ProfilePage() {
    return (
        <main>
            <Navbar />
            <HeroSection />

            <div className="md:mx-20">
                <AnimatedWrapper>
                        <h1 className="text-3xl font-bold text-center text-slate-900 mb-12 mt-10 ">Layanan Kami</h1>
                    <FeaturesSection />
                </AnimatedWrapper>

                <AnimatedWrapper>
                    <AnnouncementsSection />
                </AnimatedWrapper>

            </div>
            <AnimatedWrapper>
                <ContactSection />
            </AnimatedWrapper>

        </main>
    );
}