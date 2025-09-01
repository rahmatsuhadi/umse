import ExhibitionContent from "@/components/exhibition/ExhibitionContent";
import ContactSection from "@/components/landing/Contact";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Navbar } from "@/components/shared/Navbar";

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