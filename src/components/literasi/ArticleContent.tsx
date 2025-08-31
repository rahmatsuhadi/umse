export default function ArticleContent() {
    return (
        <section className="py-8 bg-gray-50">
            <div className="container mx-auto px-4">
                <article
                    className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden"
                >
                    {/* <!-- Article Header --> */}
                    <header className="p-8 pb-0">
                        <div className="flex items-center space-x-4 mb-6">
                            <span
                                id="categoryBadge"
                                className="bg-purple-100 text-purple-800 text-sm px-4 py-2 rounded-full"
                            >
                                Panduan Bisnis
                            </span>
                            <span id="publishDate" className="text-gray-500"
                            >25 Agustus 2025</span>
                        </div>
                        <h1 id="articleTitle" className="text-3xl font-bold text-gray-800 mb-6">
                            Panduan Lengkap Memulai UMKM dari Nol: Dari Ide hingga Eksekusi
                        </h1>
                        <div
                            className="h-64 bg-gradient-to-br from-purple-500 to-purple-600 relative rounded-lg overflow-hidden mb-6"
                        >
                            <img
                                id="articleImage"
                                src="https://via.placeholder.com/800x400/8B5CF6/FFFFFF?text=Featured+Article"
                                alt="Article Image"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </header>

                    {/* <!-- Article Summary --> */}
                    <div className="px-8">
                        <p
                            id="articleSummary"
                            className="text-xl text-gray-600 leading-relaxed mb-8"
                        >
                            Pelajari langkah-langkah praktis untuk memulai usaha mikro, kecil,
                            dan menengah dari tahap perencanaan hingga implementasi yang
                            sukses.
                        </p>

                        {/* <!-- Article Meta --> */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-8">
                            <div
                                className="flex items-center justify-between text-sm text-gray-500"
                            >
                                {/* <span id="readTime"
                                ><i className="fas fa-clock mr-2"></i>15 menit baca</span
                                > */}
                                <span id="viewCount"
                                ><i className="fas fa-eye mr-2"></i>2,534 views</span
                                >
                                <span><i className="fas fa-calendar mr-2"></i>25 Agustus 2025</span>
                            </div>
                        </div>

                        {/* <!-- Article Body --> */}
                        <div id="articleContent" className="prose prose-lg max-w-none mb-8">
                            <h2>Pendahuluan</h2>
                            <p>
                                Memulai usaha mikro, kecil, dan menengah (UMKM) bukan hanya
                                tentang memiliki ide bagus, tetapi juga tentang bagaimana
                                mengeksekusi ide tersebut dengan tepat. Banyak calon
                                entrepreneur yang memiliki ide brilian namun tidak tahu
                                bagaimana memulainya atau merasa overwhelmed dengan banyaknya
                                hal yang harus dipersiapkan.
                            </p>

                            <p>
                                Artikel ini akan memandu Anda melalui setiap tahap memulai UMKM,
                                dari riset pasar hingga peluncuran produk pertama. Dengan
                                mengikuti panduan ini, Anda akan memiliki roadmap yang jelas
                                untuk mewujudkan impian bisnis Anda.
                            </p>

                            <h2>1. Riset dan Validasi Ide Bisnis</h2>
                            <p>
                                Langkah pertama dalam memulai UMKM adalah memvalidasi ide bisnis
                                Anda. Tidak semua ide yang terdengar bagus akan berhasil di
                                pasar. Berikut adalah cara untuk memvalidasi ide Anda:
                            </p>

                            <h3>Analisis Pasar</h3>
                            <ul>
                                <li>
                                    <strong>Identifikasi target market:</strong> Siapa yang akan
                                    membeli produk/jasa Anda?
                                </li>
                                <li>
                                    <strong>Analisis kompetitor:</strong> Siapa saja pesaing Anda
                                    dan apa keunggulan mereka?
                                </li>
                                <li>
                                    <strong>Ukuran pasar:</strong> Seberapa besar peluang pasar
                                    untuk produk Anda?
                                </li>
                                <li>
                                    <strong>Tren industri:</strong> Apakah industri ini sedang
                                    berkembang atau menurun?
                                </li>
                            </ul>

                            <h3>Validasi dengan Calon Pelanggan</h3>
                            <p>
                                Lakukan survey atau wawancara dengan calon pelanggan untuk
                                memahami kebutuhan mereka. Pertanyaan yang bisa Anda ajukan:
                            </p>
                            <ul>
                                <li>
                                    Apa masalah utama yang mereka hadapi terkait produk/jasa Anda?
                                </li>
                                <li>Bagaimana mereka saat ini mengatasi masalah tersebut?</li>
                                <li>
                                    Berapa banyak mereka bersedia membayar untuk solusi yang Anda
                                    tawarkan?
                                </li>
                                <li>Fitur apa yang paling penting bagi mereka?</li>
                            </ul>

                            <h2>2. Perencanaan Bisnis</h2>
                            <p>
                                Setelah ide Anda tervalidasi, langkah selanjutnya adalah membuat
                                business plan. Business plan bukan hanya dokumen, tetapi
                                blueprint untuk kesuksesan bisnis Anda.
                            </p>

                            <h3>Komponen Business Plan</h3>
                            <ul>
                                <li>
                                    <strong>Executive Summary:</strong> Ringkasan singkat tentang
                                    bisnis Anda
                                </li>
                                <li>
                                    <strong>Deskripsi Bisnis:</strong> Penjelasan detail tentang
                                    produk/jasa Anda
                                </li>
                                <li>
                                    <strong>Analisis Pasar:</strong> Data dan insight tentang
                                    target market
                                </li>
                                <li>
                                    <strong>Strategi Marketing:</strong> Bagaimana Anda akan
                                    menjangkau pelanggan
                                </li>
                                <li>
                                    <strong>Proyeksi Keuangan:</strong> Estimasi pendapatan,
                                    biaya, dan profit
                                </li>
                                <li>
                                    <strong>Rencana Operasional:</strong> Bagaimana bisnis akan
                                    dijalankan sehari-hari
                                </li>
                            </ul>

                            <h2>3. Persiapan Legal dan Administrasi</h2>
                            <p>
                                Mengurus aspek legal adalah langkah penting yang tidak boleh
                                diabaikan. Berikut dokumen yang perlu Anda siapkan:
                            </p>

                            <h3>Dokumen Wajib</h3>
                            <ul>
                                <li>
                                    <strong>NIB (Nomor Induk Berusaha):</strong> Daftar melalui
                                    OSS (Online Single Submission)
                                </li>
                                <li><strong>NPWP:</strong> Untuk keperluan pajak</li>
                                <li>
                                    <strong>Akta Pendirian:</strong> Jika berbentuk PT atau CV
                                </li>
                                <li>
                                    <strong>Izin Usaha:</strong> Sesuai dengan jenis bisnis Anda
                                </li>
                            </ul>

                            <h3>Dokumen Pendukung</h3>
                            <ul>
                                <li>Sertifikat halal (untuk produk makanan/minuman)</li>
                                <li>PIRT (Pangan Industri Rumah Tangga)</li>
                                <li>Izin lokasi dari RT/RW setempat</li>
                                <li>BPOM (untuk produk tertentu)</li>
                            </ul>

                            <h2>4. Perencanaan Keuangan</h2>
                            <p>
                                Aspek keuangan adalah urat nadi bisnis. Tanpa perencanaan
                                keuangan yang baik, bisnis Anda bisa mengalami kesulitan di
                                kemudian hari.
                            </p>

                            <h3>Estimasi Modal Awal</h3>
                            <p>
                                Hitung dengan detail semua biaya yang diperlukan untuk memulai
                                bisnis:
                            </p>
                            <ul>
                                <li>Biaya setup (izin, legal, dll)</li>
                                <li>Biaya peralatan dan inventori</li>
                                <li>Biaya operasional 3-6 bulan pertama</li>
                                <li>Biaya marketing awal</li>
                                <li>Dana darurat (minimal 20% dari total modal)</li>
                            </ul>

                            <h3>Sumber Pendanaan</h3>
                            <ul>
                                <li>
                                    <strong>Bootstrap:</strong> Menggunakan tabungan pribadi
                                </li>
                                <li>
                                    <strong>Angel Investor:</strong> Investor individu yang
                                    tertarik dengan bisnis Anda
                                </li>
                                <li>
                                    <strong>Pinjaman Bank:</strong> KUR (Kredit Usaha Rakyat) atau
                                    pinjaman konvensional
                                </li>
                                <li>
                                    <strong>Crowdfunding:</strong> Platform seperti Kitabisa atau
                                    Wujudkan
                                </li>
                                <li>
                                    <strong>Grant/Hibah:</strong> Program pemerintah untuk UMKM
                                </li>
                            </ul>

                            <h2>5. Setup Operasional</h2>
                            <p>
                                Setelah aspek legal dan keuangan selesai, saatnya menyiapkan
                                operasional bisnis.
                            </p>

                            <h3>Lokasi dan Fasilitas</h3>
                            <ul>
                                <li>Pilih lokasi yang strategis sesuai target market</li>
                                <li>Pastikan akses yang mudah untuk supplier dan pelanggan</li>
                                <li>Pertimbangkan biaya sewa dan kontrak jangka panjang</li>
                                <li>
                                    Siapkan fasilitas yang diperlukan (peralatan, furniture, dll)
                                </li>
                            </ul>

                            <h3>Sistem dan Proses</h3>
                            <ul>
                                <li>
                                    Buat SOP (Standard Operating Procedure) untuk setiap proses
                                </li>
                                <li>Setup sistem inventory management</li>
                                <li>Implementasi sistem akuntansi dan pembukuan</li>
                                <li>Siapkan sistem customer service</li>
                            </ul>

                            <h2>6. Strategi Marketing dan Branding</h2>
                            <p>
                                Produk terbaik sekalipun tidak akan laku jika tidak dipasarkan
                                dengan benar. Berikut strategi marketing untuk UMKM:
                            </p>

                            <h3>Digital Marketing</h3>
                            <ul>
                                <li>
                                    <strong>Social Media Marketing:</strong> Instagram, Facebook,
                                    TikTok
                                </li>
                                <li>
                                    <strong>Website:</strong> Buat website sederhana sebagai
                                    etalase online
                                </li>
                                <li>
                                    <strong>Google My Business:</strong> Penting untuk bisnis
                                    lokal
                                </li>
                                <li>
                                    <strong>WhatsApp Business:</strong> Untuk komunikasi dengan
                                    pelanggan
                                </li>
                            </ul>

                            <h3>Marketing Tradisional</h3>
                            <ul>
                                <li>Brosur dan flyer</li>
                                <li>Banner dan spanduk</li>
                                <li>Word of mouth marketing</li>
                                <li>Partisipasi dalam bazar dan pameran lokal</li>
                            </ul>

                            <h2>7. Peluncuran dan Evaluasi</h2>
                            <p>
                                Setelah semua persiapan selesai, saatnya meluncurkan bisnis
                                Anda. Namun, peluncuran bukanlah akhir dari perjalanan,
                                melainkan awal yang baru.
                            </p>

                            <h3>Soft Launch</h3>
                            <ul>
                                <li>Mulai dengan lingkaran terdekat (keluarga, teman)</li>
                                <li>Kumpulkan feedback dan lakukan perbaikan</li>
                                <li>Test semua sistem dan proses</li>
                                <li>Siapkan inventory yang cukup</li>
                            </ul>

                            <h3>Grand Launch</h3>
                            <ul>
                                <li>Buat event peluncuran yang menarik</li>
                                <li>Gunakan semua channel marketing yang sudah dipersiapkan</li>
                                <li>Berikan promo atau discount untuk early adopters</li>
                                <li>Monitor dan dokumentasikan semua aktivitas</li>
                            </ul>

                            <h2>Tips Sukses untuk UMKM Pemula</h2>
                            <ul>
                                <li>
                                    <strong>Mulai dari kecil:</strong> Jangan terlalu ambisius di
                                    awal
                                </li>
                                <li>
                                    <strong>Focus on customer:</strong> Dengarkan dan respond
                                    kebutuhan pelanggan
                                </li>
                                <li>
                                    <strong>Kelola cash flow:</strong> Monitor aliran kas dengan
                                    ketat
                                </li>
                                <li>
                                    <strong>Build network:</strong> Jaringan adalah aset penting
                                    dalam bisnis
                                </li>
                                <li>
                                    <strong>Continuous learning:</strong> Selalu belajar dan
                                    adaptasi dengan perubahan
                                </li>
                                <li>
                                    <strong>Be patient:</strong> Bisnis butuh waktu untuk
                                    berkembang
                                </li>
                            </ul>

                            <h2>Kesimpulan</h2>
                            <p>
                                Memulai UMKM memang memerlukan persiapan yang matang, namun
                                dengan langkah-langkah yang tepat, impian menjadi entrepreneur
                                sukses bisa terwujud. Yang terpenting adalah memulai dengan
                                research yang solid, perencanaan yang matang, dan eksekusi yang
                                konsisten.
                            </p>

                            <p>
                                Ingatlah bahwa setiap bisnis besar dimulai dari langkah kecil.
                                Jangan takut untuk memulai, karena perjalanan seribu mil dimulai
                                dari satu langkah. Selamat memulai perjalanan entrepreneur Anda!
                            </p>
                        </div>




                        {/* <!-- Share Buttons --> */}
                        <div className="border-t pt-6 pb-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">
                                Bagikan Artikel Ini
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                                >
                                    <i className="fab fa-facebook-f mr-2"></i>Facebook
                                </button>
                                <button
                                    className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                                >
                                    <i className="fab fa-whatsapp mr-2"></i>WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </section>
    )
}