import { Metadata } from "next";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FaqItem } from "@/components/shared/FaqItem";

export const metadata: Metadata = {
    title: "Panduan Merchant | Sleman Mart",
    description: "Panduan cara berjualan di Sleman Mart",
};

export default function PanduanMerchantPage() {
    return (
        <>
            <Navbar />
            <div className="page active" id="page-about" >
                <div className="guide-hero bg-green-light">
                    <div className="guide-hero-inner">
                        <h1>🏪 Panduan Merchant</h1>
                        <p>Bergabunglah dengan ekosistem digital UMKM Sleman dan perluas jangkauan pasar produk lokal Anda.</p>
                    </div>
                </div>

                <div className="guide-body">
                    <div className="guide-section">
                        <h2><span className="num">1</span> Keuntungan Bergabung</h2>
                        <div className="guide-grid">
                            <div className="guide-card">
                                <div className="guide-card-icon">📈</div>
                                <h3>Akses Pasar Luas</h3>
                                <p>Produk Anda akan tampil di direktori digital yang dapat diakses oleh ribuan calon pembeli setiap harinya.</p>
                            </div>
                            <div className="guide-card">
                                <div className="guide-card-icon">📱</div>
                                <h3>Order via WhatsApp</h3>
                                <p>Terima pesanan langsung ke nomor WhatsApp Anda. Mudah dikelola tanpa potongan biaya admin.</p>
                            </div>
                            <div className="guide-card">
                                <div className="guide-card-icon">✨</div>
                                <h3>Branding Digital</h3>
                                <p>Dapatkan profil toko profesional dengan galeri produk, rating, dan ulasan dari pelanggan Anda.</p>
                            </div>
                        </div>
                    </div>

                    <div className="guide-section">
                        <h2><span className="num">2</span> Cara Mendaftarkan Toko</h2>
                        <div className="faq-list">
                            <FaqItem
                                question="Langkah 1: Siapkan Data UMKM"
                                answer="Siapkan foto produk berkualitas, deskripsi toko, alamat lengkap di wilayah Sleman, dan nomor WhatsApp aktif."
                            />
                            <FaqItem
                                question="Langkah 2: Hubungi Tim Verifikasi"
                                answer="Kirimkan data Anda melalui form pendaftaran atau hubungi tim pendamping UMKM SlemanMart untuk proses input data."
                            />
                            <FaqItem
                                question="Langkah 3: Kelola Status Toko"
                                answer="Pastikan jam operasional Anda terupdate agar pembeli tahu kapan waktu terbaik untuk menghubungi Anda."
                            />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}
