import CategoriesSection from "@/components/features/home/CategoriesSection";
import FeaturesSection from "@/components/features/home/FeatureSection";
import StoresSection from "@/components/landing/StoresSection";
import Footer from "@/components/layout/Footer";
import FilterSortModal from "@/components/product/FilterBar";
import ProductSection from "@/components/product/ProductSection";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import { NavbarDashboard } from "@/components/shared/HeaderNav";
import { Separator } from "@/components/ui/separator";



export default function ProductsPage() {
    return (
        <div>
            <div className="md:px-10">
                <NavbarDashboard />

                <FilterSortModal />


                <AnimatedWrapper>
                    <h1 className="text-3xl font-bold text-center text-slate-900  mt-10 font-jakarta">Layanan Kami</h1>
                    <p className="text-center text-gray-500 mb-1">Jelajahi berbagai layanan dan fasilitas yang tersedia di Sleman Mart</p>
                    <FeaturesSection />
                </AnimatedWrapper>



                <AnimatedWrapper>
                    <CategoriesSection />
                </AnimatedWrapper>


                <Separator />

                <AnimatedWrapper>
                    <ProductSection />
                </AnimatedWrapper>


                <AnimatedWrapper>
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