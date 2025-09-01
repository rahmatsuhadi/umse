import ContactSection from "@/components/landing/Contact";
import ProductSection from "@/components/product/ProductSection";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Navbar } from "@/components/shared/Navbar";
import DetailStoreInfoCard from "@/components/store/DetailStore";
import { Separator } from "@/components/ui/separator";
import { getStoreById } from "@/features/store/api";
import { trimDescription } from "@/lib/seoMetadataUtils";
import { notFound } from "next/navigation";


const APP_URL = process.env['NEXT_PUBLIC_APP_URL'] || "http://localhost:3000"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const { data: store } = await getStoreById(id);

        // Gambar untuk Open Graph dan Twitter Card
        const ogImageUrl = store.logo_url || '/assets/no-image.jpg';

        const trimmedDescription = trimDescription(store.description);

        return {
            title: store.name,  // Dinamis berdasarkan produk
            description: trimmedDescription,  // Deskripsi produk
            openGraph: {
                title: store.name,
                description: trimmedDescription,
                url: `${APP_URL}/store/${store.id}`,  // URL produk
                image: ogImageUrl,
                type: 'website',  // Menunjukkan bahwa ini adalah halaman produk
            },
            twitter: {
                title: store.name,
                description: trimmedDescription,
                image: ogImageUrl,
                card: 'summary_large_image',  // Format Twitter Card yang besar
            },
        };
    } catch (error) {
        console.log(error);
        return {
            title: 'Store Tidak Ditemukan',
            description: 'Halaman yang Anda cari tidak ada.',
        };
    }
}


export default async function StoreDetailPage({ params }: { params: Promise<{ id: string }> }) {


    const id = (await params).id;

    let store;
    try {
        const response = await getStoreById(id);
        store = response.data;
    } catch (error) {

        if (error instanceof Error) {
            console.log(error.message)

        }
        notFound();
    }

    return (
        <div>
            <Navbar />
            <Breadcrumb breadcrumbs={[
                { name: "Beranda", link: "/" },
                { name: store.name, active: true }
            ]} />

            <Separator />
            <div className="md:px-10">
                <DetailStoreInfoCard store={store} />
            </div>
            <Separator />

            <AnimatedWrapper className="md:px-10">

                <ProductSection />
            </AnimatedWrapper>

            <AnimatedWrapper>
                <ContactSection />
            </AnimatedWrapper>
        </div>

    )
}