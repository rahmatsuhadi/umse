import ImageGallery from "@/components/product/ImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductActionCard from "@/components/product/ProductActionCard";
import ContactSection from "@/components/landing/Contact";
import ProductTabs from "@/components/product/ProductTabs";
import ProductsSimilarSection from "@/components/product/SimilarProductSection";

// --- Data Dummy (Ganti dengan data asli dari API Anda) ---
const productData = {
    id: "kursi-sofa-minimalis-01",
    name: "Kursi Sofa Minimalis",
    seller: "Ani Furniture, Wedomartani",
    price: 23000,
    stock: 80,
    images: [
        "https://els.id/wp-content/uploads/2023/11/Olike-H2-1.jpg",
        "https://rexus.id/cdn/shop/files/HX_35_2_0e4631ff-58cc-4bf5-9d41-7cfdd9dc8382.png?v=1748069442",
        "https://awsimages.detik.net.id/community/media/visual/2016/04/25/9fd98c78-5c7a-442a-bbd7-d1714090d30e_169.jpg?w=620",
    ],
    reviews: {
        average: 4.8,
        totalCount: 125, // Sesuai gambar
        // Ganti 'counts' dengan 'qualitativeCounts'
        qualitativeCounts: [
            { label: 'Bagus', count: 156, value: 80 }, // value untuk progress bar (0-100)
            { label: 'Menakjubkan', count: 156, value: 95 },
            { label: 'Jelek', count: 156, value: 5 },
        ],
        items: [
        {
            id: 1,
            user: "John Malcolm",
            rating: 5,
            date: "24 January, 2023",
            text: "In Washington, it is already difficult to surprise with the opening of a new institution, but it is still possible. Especially if it is a True Cost project. Here you pay an entrance fee and get meals at cost price.",
            images: [
                '/images/review/review-1.png',
                '/images/review/review-2.png',
            ]
        },
        {
            id: 2,
            user: "Jane Doe",
            rating: 4,
            date: "22 January, 2023",
            text: "A good place to hang out with friends. The ambience is nice and the price is reasonable. Will come back for more!",
            images: []
        },
        {
            id: 3,
            user: "John Malcolm",
            rating: 5,
            date: "20 January, 2023",
            text: "Absolutely love it! The quality exceeds the price. Highly recommended for everyone looking for a great deal.",
            images: []
        },
    ],
    },
    
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)...",
    location: "Jl. Parasamya No.6, Beran, Tridadi, Sleman"
};
// --- Akhir Data Dummy ---

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {

    const product = productData;

    return (
        <main className="bg-white">
            <div className="container mx-auto px-10 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-6 lg:gap-8">

                    {/* Kolom Kiri & Tengah (Gambar & Info) */}
                    <div className="lg:col-span-4 space-y-8">
                        <ImageGallery images={product.images} productName={product.name} />
                        <ProductInfo product={product} />
                    </div>

                    {/* Kolom Kanan (Kartu Aksi) */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-24"> {/* top-24 untuk memberi jarak dari navbar sticky */}
                            <ProductActionCard product={product} />
                        </div>
                    </div>
                </div>
                <ProductTabs product={product} />

                <ProductsSimilarSection/>
            </div>

            {/* Footer atau bagian lain bisa ditambahkan di sini */}
            <ContactSection />
        </main>
    );
}