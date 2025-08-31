import Image from "next/image";
import Link from "next/link";


interface ArticleCardProps {

}

export default function ArticleCard(props: ArticleCardProps) {
    return (
        <article
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300"
        >
            <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600">
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
                    <span
                        className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                    >
                        Teknologi
                    </span>
                    <span className="text-gray-500 text-sm">5 Sept 2025</span>
                </div>
                <h3
                    className="text-xl font-bold text-gray-800 mb-3 hover:text-primary cursor-pointer"
                >
                    Transformasi Digital untuk UMKM: Langkah Awal yang Tepat
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                    Panduan praktis untuk memulai transformasi digital dalam bisnis
                    UMKM dengan teknologi yang terjangkau dan mudah
                    diimplementasikan.
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                        <i className="fas fa-clock mr-2"></i>
                        <span>8 menit baca</span>
                    </div>
                    <Link
                        href={"/literasi/" + 10011001}
                        className="text-primary hover:text-primary-dark font-medium"
                    >
                        Baca Selengkapnya →
                    </Link>
                </div>
            </div>
        </article>
    )
}