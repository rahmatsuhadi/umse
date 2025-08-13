import AnnouncementsSection from "@/components/features/home/AnouncementSection";
import FeaturesSection from "@/components/features/home/FeatureSection";
import HeroSection from "@/components/features/home/HeroSection";
import ContactSection from "@/components/landing/Contact";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import { Navbar } from "@/components/shared/Navbar";


export default function HomePage() {
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