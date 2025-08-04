import AnnouncementsSection from "@/components/landing/Anouncement";
import CategoriesSection from "@/components/landing/CategoriesSection";
import ContactSection from "@/components/landing/Contact";
import FeaturesSection from "@/components/landing/Feature";
import HeroSection from "@/components/landing/Hero";
import ProductsSection from "@/components/landing/ProductsSection";
import StoresCarouselSection from "@/components/landing/StoresCarouselSection";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import { Separator } from "@/components/ui/separator";
import Head from "next/head";




export default function HomePage() {
  return (
    <>

      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet"></link>
      </Head>
      <main>

        <HeroSection />

        <div className="md:mx-20">
          <AnimatedWrapper>
            <h1 className="text-3xl font-bold text-center text-slate-900 mb-12 mt-10">Layanan Kami</h1>
            <FeaturesSection />
          </AnimatedWrapper>

          <AnimatedWrapper>
            <CategoriesSection />
          </AnimatedWrapper>

          <Separator />

          <AnimatedWrapper>
            <ProductsSection />
          </AnimatedWrapper>

          <StoresCarouselSection />
        </div>



        <ContactSection />

        {/* <AnimatedWrapper>
        <FeaturesSection />
      </AnimatedWrapper>

      <AnimatedWrapper>
        <AnnouncementsSection />
      </AnimatedWrapper>

      <AnimatedWrapper>
        <ContactSection />
      </AnimatedWrapper> */}
      </main>
    </>
  );
}