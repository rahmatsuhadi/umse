


import AnnouncementsSection from "@/components/landing/Anouncement";
import ContactSection from "@/components/landing/Contact";
import FeaturesSection from "@/components/landing/Feature";
import HeroSection from "@/components/landing/Hero";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import { Navbar } from "@/components/shared/Navbar";


export default function ProfilePage() {
    return (
        <main>
        <Navbar /> 
            <HeroSection />

            <div className="md:mx-20">
                <AnimatedWrapper>
                    <h1 className="text-3xl font-bold text-center text-slate-900 mb-12 mt-10">Layanan Kami</h1>
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