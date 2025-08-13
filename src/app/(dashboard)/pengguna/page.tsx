import OrderList from "@/components/dashboard/OrderList";
import StatCard from "@/components/dashboard/StatCard";
import ProductSectionHorizontal from "@/components/product/ProductsSectionHorizontal";
import { Navbar } from "@/components/shared/Navbar";

export default function PesananPage() {
    return (
        <div className="bg-gray-50 ">

            <div className="container mx-auto md:px-10 px-4 py-8">
                {/* <!-- Welcome Section --> */}
                {/* <CardWelcome name="John Doe" /> */}

                {/* <!-- Quick Stats --> */}
                <StatCard />

                <div className="flex justify-center">
                    {/* <!-- Recent Orders --> */}
                    <OrderList />


                </div>

                {/* <!-- Recommended Products --> */}
                <section className="py-8 sm:py-12 bg-gray-50  md:px-10">
                    <div className="container mx-auto px-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">Rekomendasi Untuk Anda</h2>
                        <ProductSectionHorizontal relatedProducts={
                            [
                                { category: "Makanan", id: 1, name: "Browseer", price: 1000, rating: 4.5 },
                                { category: "Makanan", id: 2, name: "Browseer", price: 1000, rating: 4.5 },
                                { category: "Makanan", id: 9, name: "Browseer", price: 1000, rating: 4.5 },
                            ]
                        } />
                    </div>
                </section>



                {/* <div className="mt-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold">Rekomendasi Untuk Anda</h3>
                            <a
                                href="products.html"
                                className="text-primary hover:underline text-sm"
                            >
                                Lihat Semua <i className="fas fa-arrow-right ml-1"></i>
                            </a>
                        </div>

                        <div className="grid md:grid-cols-4 gap-6">
                            <div
                                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition duration-300"
                            >
                                <div className="bg-gray-300 h-32 flex items-center justify-center">
                                    <i className="fas fa-image text-gray-500 text-2xl"></i>
                                </div>
                                <div className="p-3">
                                    <h4 className="font-medium text-sm mb-1">Madu Hutan Murni</h4>
                                    <p className="text-xs text-gray-600 mb-2">Madu Asli Sleman</p>
                                    <p className="text-primary font-bold text-sm mb-2">Rp 85.000</p>
                                    <button
                                        className="w-full bg-primary text-white text-xs py-2 rounded hover:bg-primary-dark"
                                    >
                                        Tambah ke Keranjang
                                    </button>
                                </div>
                            </div>

                            <div
                                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition duration-300"
                            >
                                <div className="bg-gray-300 h-32 flex items-center justify-center">
                                    <i className="fas fa-image text-gray-500 text-2xl"></i>
                                </div>
                                <div className="p-3">
                                    <h4 className="font-medium text-sm mb-1">Kopi Robusta Premium</h4>
                                    <p className="text-xs text-gray-600 mb-2">Kopi Sleman Hills</p>
                                    <p className="text-primary font-bold text-sm mb-2">Rp 55.000</p>
                                    <button
                                        className="w-full bg-primary text-white text-xs py-2 rounded hover:bg-primary-dark"
                                    >
                                        Tambah ke Keranjang
                                    </button>
                                </div>
                            </div>

                            <div
                                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition duration-300"
                            >
                                <div className="bg-gray-300 h-32 flex items-center justify-center">
                                    <i className="fas fa-image text-gray-500 text-2xl"></i>
                                </div>
                                <div className="p-3">
                                    <h4 className="font-medium text-sm mb-1">Tas Anyaman Pandan</h4>
                                    <p className="text-xs text-gray-600 mb-2">Kerajinan Sleman</p>
                                    <p className="text-primary font-bold text-sm mb-2">Rp 45.000</p>
                                    <button
                                        className="w-full bg-primary text-white text-xs py-2 rounded hover:bg-primary-dark">
                                        Tambah ke Keranjang
                                    </button>
                                </div>
                            </div>

                            <div
                                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition duration-300"
                            >
                                <div className="bg-gray-300 h-32 flex items-center justify-center">
                                    <i className="fas fa-image text-gray-500 text-2xl"></i>
                                </div>
                                <div className="p-3">
                                    <h4 className="font-medium text-sm mb-1">Dodol Nangka</h4>
                                    <p className="text-xs text-gray-600 mb-2">Dodol Tradisional</p>
                                    <p className="text-primary font-bold text-sm mb-2">Rp 18.000</p>
                                    <button
                                        className="w-full bg-primary text-white text-xs py-2 rounded hover:bg-primary-dark"
                                    >
                                        Tambah ke Keranjang
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>

            {/* <!-- Footer --> */}
            <footer className="bg-gray-800 text-white py-12 mt-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Sleman Mart</h3>
                            <p className="text-gray-300">
                                Platform e-commerce untuk UMKM di Sleman yang mendukung produk
                                lokal berkualitas.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Link Cepat</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="products.html" className="text-gray-300 hover:text-primary"
                                    >Produk</a                                    >
                                </li>
                                <li>
                                    <a
                                        href="categories.html"
                                        className="text-gray-300 hover:text-primary">Kategori</a>
                                </li>
                                <li>
                                    <a href="sellers.html" className="text-gray-300 hover:text-primary"                                    >Penjual</a
                                    >
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Bantuan</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="help.html" className="text-gray-300 hover:text-primary"
                                    >Pusat Bantuan</a                                    >
                                </li>
                                <li>
                                    <a href="contact.html" className="text-gray-300 hover:text-primary"
                                    >Kontak</a                                    >
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Hubungi Kami</h4>
                            <p className="text-gray-300 mb-2">Email: info@slemanmart.com</p>
                            <p className="text-gray-300 mb-4">Telepon: (0274) 123-4567</p>
                        </div>
                    </div>
                    <div
                        className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300"
                    >
                        <p>&copy; 2025 Sleman Mart. Semua hak cipta dilindungi.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}