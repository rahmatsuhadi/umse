import Image from "next/image";
import Link from "next/link";

export default function ExhibitionCard() {
    return (
        <article
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300"
        >
            <div className="h-48 bg-gradient-to-br from-primary-light to-primary">
                <Image
                    width={400}
                    height={400}
                    src="/assets/no-image.jpg"
                    alt="Digital Transformation"
                    className="w-full h-full object-cover"
                />

            </div>
            <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                    {/* <!-- <span
                        className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                    >
                        Expo UMKM
                    </span> --> */}
                    <span className="text-gray-500 text-sm">15-17 Sept 2025</span>
                </div>
                <h3
                    className="text-xl font-bold text-gray-800 mb-3 hover:text-primary cursor-pointer"
                >
                    Expo UMKM Sleman 2025: Bangkit Bersama
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                    Pameran terbesar UMKM se-Kabupaten Sleman dengan 200+ booth dari
                    berbagai sektor. Kesempatan emas untuk memamerkan produk dan
                    memperluas jaringan bisnis.
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                        <i className="fas fa-map-marker-alt mr-2"></i>
                        <span>JEC Yogyakarta</span>
                    </div>
                    <Link
                        href="/pameran/123213"
                        className="text-primary hover:text-primary-dark font-medium"
                    >
                        Baca Selengkapnya →
                    </Link>
                </div>
            </div>
        </article>
    )
}   