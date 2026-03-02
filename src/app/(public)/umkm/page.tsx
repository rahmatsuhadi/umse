import { Navbar } from "@/components/shared/Navbar";
import ContactSection from "@/components/landing/Contact";
import { Metadata } from "next";
import { APP_URL } from "@/lib/envConfig";
import MerchantsPage from "@/components/stores/MerchantsPage";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Toko Lokal Sleman — Sleman Mart",
    description: "Ratusan UMKM terpercaya siap melayani kebutuhanmu. Temukan toko-toko lokal terbaik di Sleman.",
    openGraph: {
        title: "Toko Lokal Sleman — Sleman Mart",
        description: "Ratusan UMKM terpercaya siap melayani kebutuhanmu. Temukan toko-toko lokal terbaik di Sleman.",
        images: [
            {
                url: APP_URL + "/slemanmartlogo.png",
                width: 800,
                height: 600,
                alt: "Sleman Mart - Toko Lokal Sleman"
            }
        ],
        url: APP_URL + "/umkm",
        siteName: "Sleman Mart",
    },
    twitter: {
        card: "summary_large_image",
        site: "@SlemanMart",
        title: "Toko Lokal Sleman — Sleman Mart",
        description: "Ratusan UMKM terpercaya siap melayani kebutuhanmu.",
        images: APP_URL + "/slemanmartlogo.png"
    }
};

export default function UmkmPage() {
    return (
        <div>
            <Navbar />
            <div>
                <Suspense>
                    <MerchantsPage />
                </Suspense>
            </div>
            <ContactSection />
        </div>
    );
}