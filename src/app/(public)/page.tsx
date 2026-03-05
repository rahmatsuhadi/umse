import { Navbar } from "@/components/shared/Navbar";
import { HeroSearch } from "@/components/home/HeroSearch";
import { Subdistricts } from "@/components/home/Subdistricts";
import { TopProductsHome } from "@/components/home/TopProductsHome";
import { NewProducts } from "@/components/home/NewProducts";
import { SlemanFoodSectionsHome } from "@/components/home/SlemanFoodSectionsHome";
import { TopStores } from "@/components/home/TopStores";
import { TopLiteracies } from "@/components/home/TopLiteracies";
import ContactSection from "@/components/landing/Contact";
import CategoryList from "@/components/categories/CategoryList";
import { Metadata } from "next";
import { APP_URL } from "@/lib/envConfig";
interface HomePage {
    searchParams: Promise<{
        page: string;
        q: string;
    }>
}

export const metadata: Metadata = {
    title: "Daftar Produk Unggulan UMKM Sleman",
    description: "Temukan berbagai produk berkualitas dari UMKM Sleman Mart. Jelajahi kategori, fitur, dan toko-toko terbaik dengan penawaran menarik.",
    openGraph: {
        title: "Daftar Produk Unggulan UMKM Sleman",
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
        title: "Daftar Produk Unggulan UMKM Sleman",
        description: "Marketplace UMKM Sleman dengan produk berkualitas dan penawaran menarik.",
        images: APP_URL + "/slemanmartlogo.png"
    }
};

export default async function HomePage({ }: HomePage) {
    return (
        <div className="pb-20 md:pb-0" style={{ background: "#FFF9F4" }}> {/* padding bottom for sticky nav on mobile */}
            <Navbar />

            <main className="min-h-screen">
                {/* Section 1: Hero Search and Subdistrict Explorer */}
                <HeroSearch />
                <Subdistricts />

                {/* Section 2A: New Products */}
                <NewProducts />

                {/* Section 2B: Top Products */}
                <TopProductsHome />

                {/* Section 2B: Sleman Food Categories (Siap Saji & Homemade) */}
                <SlemanFoodSectionsHome />

                {/* Section 2C: Top Local Marketplace */}
                <TopStores />

                {/* Section 3: Product Categories */}
                <CategoryList />

                {/* Section 4: Tips / Blog / Articles */}
                <TopLiteracies />

            </main>

            {/* Section 5: Footer */}
            <ContactSection />
        </div>
    );
}