import { Metadata } from "next";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FaqItem } from "@/components/shared/FaqItem";

export const metadata: Metadata = {
    title: "Panduan Pembeli | Sleman Mart",
    description: "Panduan cara berbelanja di Sleman Mart",
};

export default function PanduanPembeliPage() {
    return (
        <>
            <Navbar />
            <div className="page active" id="page-guide" >
                <div className="guide-hero">
                    <div className="guide-hero-inner">
                        <h1>🛍️ Panduan Pembeli</h1>
                        <p>Pelajari cara berbelanja produk UMKM Sleman dengan mudah, aman, dan nyaman di platform SlemanMart.</p>
                    </div>
                </div>

                <div className="guide-body">
                    <div className="guide-section">
                        <h2><span className="num">1</span> Cara Berbelanja</h2>
                        <div className="guide-grid">
                            <div className="guide-card">
                                <div className="guide-card-icon">🔍</div>
                                <h3>Cari Produk</h3>
                                <p>Gunakan fitur pencarian atau jelajahi per kategori dan kapanewon untuk menemukan produk yang Anda inginkan.</p>
                            </div>
                            <div className="guide-card">
                                <div className="guide-card-icon">🛒</div>
                                <h3>Masukkan Keranjang</h3>
                                <p>Klik tombol &quot;Masukkan Keranjang&quot; untuk menambahkan produk pilihan Anda ke keranjang belanja.</p>
                            </div>
                            <div className="guide-card">
                                <div className="guide-card-icon">💳</div>
                                <h3>Checkout &amp; Pembayaran</h3>
                                <p>Buka keranjang belanja Anda, isi alamat pengiriman, dan lakukan checkout untuk menyelesaikan pesanan Anda dengan mudah.</p>
                            </div>
                        </div>
                    </div>

                    <div className="guide-section">
                        <h2><span className="num">2</span> FAQ (Pertanyaan Umum)</h2>
                        <div className="faq-list">
                            <FaqItem
                                question="Apakah saya perlu membuat akun?"
                                answer="Ya. Anda perlu masuk atau mendaftar akun pembeli di platform SlemanMart agar dapat menggunakan fitur keranjang belanja dan memproses transaksi."
                            />
                            <FaqItem
                                question="Bagaimana sistem pengirimannya?"
                                answer="Sistem pengiriman menggunakan pilihan kurir yang tersedia dan ongkos kirim akan dihitung secara otomatis berdasarkan alamat pengiriman Anda saat proses checkout."
                            />
                            <FaqItem
                                question="Apakah produk di SlemanMart asli?"
                                answer="Ya, semua produk yang terdaftar adalah hasil karya UMKM lokal Kabupaten Sleman yang telah melalui proses verifikasi resmi."
                            />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}
