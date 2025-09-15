import FeaturesSection from "@/components/home/FeatureSection";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import { Navbar } from "@/components/shared/Navbar";
import { Separator } from "@/components/ui/separator";
import ContactSection from "@/components/landing/Contact";
import { Metadata } from "next";
import { APP_URL } from "@/lib/envConfig";
import ProductList from "@/components/products/ProductList";
import CategoryList from "@/components/categories/CategoryList";
import StoreList from "@/components/stores/StoreList";
import FilterSortModal from "@/components/products/ProductFilterSortModal";
import { BannerCarousel } from "@/components/home/BannerCarousel";


interface HomePage {
    searchParams: Promise<{
        page: string;
        q: string;
    }>
}

export const metadata: Metadata = {
    title: "Sleman Mart - Marketplace UMKM dengan Produk Berkualitas",
    description: "Temukan berbagai produk berkualitas dari UMKM Sleman Mart. Jelajahi kategori, fitur, dan toko-toko terbaik dengan penawaran menarik.",
    openGraph: {
        title: "Sleman Mart - Marketplace UMKM",
        description: "Marketplace terbaik untuk produk UMKM di Sleman. Dapatkan produk berkualitas dan layanan terbaik.",
        images: [
            {
                url: "/slemanmartlogo.png",
                width: 800,
                height: 600,
                alt: "Sleman Mart - Marketplace UMKM"
            }
        ],
        url: APP_URL + "",
        siteName: "Sleman Mart",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        site: "@SlemanMart",
        title: "Sleman Mart - Marketplace UMKM",
        description: "Marketplace UMKM Sleman dengan produk berkualitas dan penawaran menarik.",
        images: APP_URL + "/slemanmartlogo.png"
    }
};

export default async function HomePage({ }: HomePage) {
    return (
        <div className="bg-gray-50">
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
                    <CategoryList />
                </AnimatedWrapper>
                <Separator />
                <AnimatedWrapper className="md:px-10">
                    <ProductList />
                </AnimatedWrapper>



                <AnimatedWrapper className="md:px-10" >
                    <div className="text-center mb-8" id="store" >
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Toko UMKM Partner Kami</h2>
                        <p className="text-gray-600">Bergabunglah dengan ratusan UMKM yang telah mempercayai platform kami</p>
                    </div>
                    <StoreList />

                </AnimatedWrapper>
            </div>


            <AnimatedWrapper>
                <ContactSection />
            </AnimatedWrapper>

        </div>
    );
}