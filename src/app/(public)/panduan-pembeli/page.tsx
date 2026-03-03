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
                                <div className="guide-card-icon">💬</div>
                                <h3>Hubungi Penjual</h3>
                                <p>Klik tombol &quot;Pesan via WhatsApp&quot; untuk terhubung langsung dengan UMKM. Pastikan toko dalam status &quot;Buka&quot;.</p>
                            </div>
                            <div className="guide-card">
                                <div className="guide-card-icon">🤝</div>
                                <h3>Transaksi Langsung</h3>
                                <p>SlemanMart adalah platform showcase. Transaksi, pembayaran, dan pengiriman disepakati langsung antara Anda dan penjual.</p>
                            </div>
                        </div>
                    </div>

                    <div className="guide-section">
                        <h2><span className="num">2</span> FAQ (Pertanyaan Umum)</h2>
                        <div className="faq-list">
                            <FaqItem
                                question="Apakah saya perlu membuat akun?"
                                answer="Tidak perlu. Anda bisa langsung menjelajahi produk dan menghubungi penjual tanpa harus mendaftar akun terlebih dahulu."
                            />
                            <FaqItem
                                question="Bagaimana sistem pengirimannya?"
                                answer="Sistem pengiriman (COD, jasa kurir, atau ambil di tempat) disepakati langsung saat Anda menghubungi penjual via WhatsApp."
                            />
                            <FaqItem
                                question="Apakah produk di SlemanMart asli?"
                                answer="Ya, semua produk yang terdaftar adalah hasil karya UMKM lokal Kabupaten Sleman yang telah melalui proses verifikasi."
                            />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}
