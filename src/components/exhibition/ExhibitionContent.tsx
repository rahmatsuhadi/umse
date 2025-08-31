export default function ExhibitionContent() {
    return (
        <section className="py-8 bg-gray-50">
            <div className="container mx-auto px-4">
                <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    {/* <!-- Article Header --> */}
                    <header className="p-8 pb-0">
                        <div className="flex items-center space-x-4 mb-6">
                            
                            <span className="text-gray-500">2 hari lalu</span>
                           
                        </div>

                        <h1 className="text-4xl font-bold text-gray-800 mb-4">
                            Strategi Digital Marketing untuk UMKM di Era Modern
                        </h1>

                        <p className="text-xl text-gray-600 mb-6">
                            Pelajari cara menggunakan platform digital untuk meningkatkan penjualan dan
                            memperluas jangkauan pasar UMKM Anda dengan strategi yang terbukti efektif.
                        </p>

                        {/* <!-- Featured Image --> */}
                        <div className="mb-8">
                            <img
                                src="https://via.placeholder.com/800x400/E57F39/FFFFFF?text=Digital+Marketing+Strategy"
                                alt="Digital Marketing Strategy"
                                className="w-full h-64 md:h-96 object-cover rounded-lg"
                            />
                        </div>
                    </header>

                    {/* <!-- Article Body --> */}
                    <div className="px-8 pb-8">
                        <div className="prose prose-lg max-w-none">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Mengapa Digital Marketing Penting?</h2>
                            <p className="text-gray-700 mb-6">
                                Di era digital saat ini, hampir semua orang menggunakan internet untuk mencari informasi,
                                berbelanja, dan berinteraksi. UMKM yang tidak memanfaatkan digital marketing akan
                                tertinggal dari kompetitor yang sudah lebih dulu mengadopsi strategi digital.
                            </p>

                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Strategi Digital Marketing untuk UMKM</h2>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">1. Optimasi Media Sosial</h3>
                            <p className="text-gray-700 mb-4">
                                Media sosial seperti Instagram, Facebook, dan TikTok adalah platform yang sangat efektif
                                untuk mempromosikan produk UMKM. Pastikan konten yang Anda posting menarik, konsisten,
                                dan sesuai dengan target audience.
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                                <li>Posting konten secara konsisten (minimal 3-5 kali seminggu)</li>
                                <li>Gunakan foto produk berkualitas tinggi</li>
                                <li>Manfaatkan fitur Stories dan Reels untuk engagement yang lebih tinggi</li>
                                <li>Berinteraksi aktif dengan followers melalui komentar dan DM</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">2. Search Engine Optimization (SEO)</h3>
                            <p className="text-gray-700 mb-4">
                                SEO membantu website atau toko online Anda muncul di hasil pencarian Google.
                                Ini sangat penting karena mayoritas konsumen mencari produk melalui mesin pencari.
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                                <li>Riset kata kunci yang relevan dengan produk Anda</li>
                                <li>Optimasi deskripsi produk dengan kata kunci yang tepat</li>
                                <li>Pastikan website loading dengan cepat</li>
                                <li>Buat konten blog yang bermanfaat untuk pelanggan</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">3. Email Marketing</h3>
                            <p className="text-gray-700 mb-4">
                                Email marketing masih menjadi salah satu channel digital marketing dengan ROI tertinggi.
                                Gunakan email untuk membangun relationship dengan pelanggan dan meningkatkan repeat purchase.
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                                <li>Kumpulkan email pelanggan melalui website atau media sosial</li>
                                <li>Kirim newsletter berkala dengan konten yang valuable</li>
                                <li>Berikan penawaran khusus untuk subscriber email</li>
                                <li>Personalisasi email berdasarkan behavior pelanggan</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">4. Content Marketing</h3>
                            <p className="text-gray-700 mb-4">
                                Buat konten yang edukatif dan menghibur untuk membangun trust dengan audience.
                                Konten yang baik akan membuat pelanggan datang kembali dan merekomendasikan bisnis Anda.
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                                <li>Buat tutorial penggunaan produk</li>
                                <li>Share story behind the brand</li>
                                <li>Tips dan trik yang relevan dengan industri Anda</li>
                                <li>User-generated content dari pelanggan</li>
                            </ul>

                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tools Digital Marketing untuk UMKM</h2>
                            <div className="bg-gray-50 p-6 rounded-lg mb-6">
                                <h4 className="font-semibold text-gray-800 mb-3">Free Tools:</h4>
                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                    <li>Google My Business - untuk local SEO</li>
                                    <li>Canva - untuk design konten</li>
                                    <li>Buffer/Hootsuite - untuk scheduling social media</li>
                                    <li>Google Analytics - untuk tracking website</li>
                                </ul>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Kesimpulan</h2>
                            <p className="text-gray-700 mb-6">
                                Digital marketing bukan lagi pilihan, tetapi keharusan untuk UMKM yang ingin bertahan
                                dan berkembang. Mulai dari yang sederhana, konsisten dalam eksekusi, dan terus belajar
                                dari data dan feedback pelanggan. Dengan strategi yang tepat, UMKM Anda dapat bersaing
                                dengan bisnis yang lebih besar.
                            </p>

                            {/* <!-- Share Buttons --> */}
                            <div className="border-t border-gray-200 pt-8 mt-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Bagikan Artikel Ini</h3>
                                <div className="flex space-x-4">
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                                        <i className="fab fa-facebook-f mr-2"></i>Facebook
                                    </button>
                                   
                                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300">
                                        <i className="fab fa-whatsapp mr-2"></i>WhatsApp
                                    </button>
                                </div>
                            </div>
                        </div>
                        </div>
                </article>
            </div>
        </section>
    )
}