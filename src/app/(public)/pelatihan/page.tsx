import Breadcrumb from "@/components/shared/Breadcrumb";
import { Navbar } from "@/components/shared/Navbar";
import TrainingFilter from "@/components/training/TrainingFilter";
import TrainingSection from "@/components/training/TrainingSection";

export default function TrainingPage() {
    return (
        <div className="bg-gray-50">
            <Navbar />

            <Breadcrumb breadcrumbs={[
                { name: "Beranda", link: "/" },
                { name: "Pelatihan", active: true }
            ]} />

            {/* <!-- Hero Section --> */}
            <section
                className="py-12 bg-gradient-to-r from-green-600 to-green-700 text-white"
            >
                <div className="container mx-auto px-4 text-center">
                    <div className="mb-8">
                        <i className="fas fa-graduation-cap text-6xl mb-4"></i>
                        <h1 className="text-4xl font-bold mb-4">Info Pelatihan UMKM</h1>
                        <p className="text-xl text-green-100 max-w-2xl mx-auto">
                            Tingkatkan kemampuan dan pengetahuan bisnis Anda melalui berbagai
                            program pelatihan yang dirancang khusus untuk UMKM
                        </p>
                    </div>
                </div>
            </section>

            {/* filter */}

            <div className="md:px-10">
                <TrainingFilter />

                <TrainingSection />

            </div>
        </div>
    )
}