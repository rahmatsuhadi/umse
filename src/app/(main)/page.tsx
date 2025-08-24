import CategoriesSection from "@/components/features/home/CategoriesSection";
import FeaturesSection from "@/components/features/home/FeatureSection";
import StoresSection from "@/components/landing/StoresSection";
import Footer from "@/components/layout/Footer";
import { BannerCarousel } from "@/components/product/BannerCarousel";
import FilterSortModal from "@/components/product/FilterBar";
import ProductSection from "@/components/product/ProductSection";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import { Navbar } from "@/components/shared/Navbar";
import { Separator } from "@/components/ui/separator";


interface ProductsPageProps {
    searchParams: Promise<{
        page: string;
        q: string;
    }>
}

export default async function ProductsPage({ }: ProductsPageProps) {
    return (
        <div>
            <Navbar />
            <div className="">

                <BannerCarousel />

                <div className="md:px-10">
                    <FilterSortModal />
                </div>


                <AnimatedWrapper className="bg-[#f9fafb] md:px-10">
                    <div className="text-center mb-4 sm:mb-6 pt-10">
                        <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2">
                            Layanan Kami
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600">
                            Jelajahi berbagai layanan dan fasilitas yang tersedia di Sleman Mart
                        </p>
                    </div>

                    <FeaturesSection />
                </AnimatedWrapper>



                <AnimatedWrapper className="md:px-10">
                    <CategoriesSection />
                </AnimatedWrapper>


                <Separator />

                <AnimatedWrapper className="md:px-10">
                    <ProductSection />
                </AnimatedWrapper>


                <AnimatedWrapper className="md:px-10">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Toko UMKM Partner Kami</h2>
                        <p className="text-gray-600">Bergabunglah dengan ratusan UMKM yang telah mempercayai platform kami</p>
                    </div>
                    <StoresSection />
                </AnimatedWrapper>
            </div>


            <Footer />


        </div>
    );
}