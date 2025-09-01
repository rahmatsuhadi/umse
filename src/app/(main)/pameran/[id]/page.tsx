import ExhibitionContent from "@/components/exhibition/ExhibitionContent";
import ContactSection from "@/components/landing/Contact";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Navbar } from "@/components/shared/Navbar";
import Image from "next/image";

export default function DetailPameran() {
    return (

        <div className="bg-gray-50">
            <Navbar />

            <Breadcrumb breadcrumbs={[
                { name: "Beranda", link: "/" },
                { name: "Pameran", link: "/pameran" },

                { name: "Detail", active: true }
            ]} />


            <ExhibitionContent />


            <AnimatedWrapper>
                <ContactSection />
            </AnimatedWrapper>

        </div>
    )
}