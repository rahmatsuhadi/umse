import Image from "next/image";
import Link from "next/link";

export default function TrainingCard() {
    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300"
        >
            <div
                className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 relative"
            >
                <Image
                    width={400}
                    height={400}
                    src="/assets/no-image.jpg"
                    alt="Digital Marketing TraininDigital Transformation"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                    {/* <!-- <span
                        className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                    >
                        Digital Marketing
                    </span> --> */}
                    <span className="text-gray-500 text-sm">15-17 Sept 2025</span>
                </div>
                <h3
                    className="text-xl font-bold text-gray-800 mb-3 hover:text-primary cursor-pointer"
                >
                    Pelatihan Digital Marketing untuk UMKM
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                    Pelajari strategi pemasaran digital dari dasar hingga mahir.
                    Mulai dari social media marketing hingga Google Ads.
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                        <i className="fas fa-map-marker-alt mr-2"></i>
                        <span>Balai Desa Tridadi</span>
                    </div>
                    <Link
                        href={'/pelatihan/' + 21321323}
                        className="text-primary hover:text-primary-dark font-medium"
                    >
                        Baca Selengkapnya →
                    </Link>
                </div>
            </div>
        </div>

    )
}