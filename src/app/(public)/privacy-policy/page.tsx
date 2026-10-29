import { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ShieldCheck, Lock, UserCheck, Eye, Trash2, Mail, ExternalLink, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Kebijakan Privasi (Privacy Policy) | Sleman Mart",
  description:
    "Kebijakan Privasi dan Perlindungan Data Pengguna di Platform Sleman Mart (Dinas Koperasi dan UKM Kabupaten Sleman).",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "29 Oktober 2026";

  return (
    <>
      <Navbar />
      <div className="page active" id="page-privacy-policy">
        {/* Hero Section */}
        <div className="guide-hero">
          <div className="guide-hero-inner">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-semibold text-emerald-800 bg-emerald-100 rounded-full">
              <ShieldCheck className="w-4 h-4" />
              <span>Perlindungan Data &amp; Privasi Pengguna</span>
            </div>
            <h1>Kebijakan Privasi (Privacy Policy)</h1>
            <p>
              Komitmen Sleman Mart dalam menjaga keamanan, kerahasiaan, dan privasi data pribadi Anda saat menggunakan platform kami.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Terakhir diperbarui: <strong>{lastUpdated}</strong>
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="guide-body max-w-4xl mx-auto py-10 px-4">
          {/* Ringkasan & Kepatuhan Google */}
          <div className="mb-10 p-6 bg-blue-50 border border-blue-200 rounded-xl">
            <h2 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              Kepatuhan Kebijakan Data Pengguna Layanan Google API
            </h2>
            <p className="text-sm text-blue-950 leading-relaxed mb-3">
              Penggunaan dan transfer informasi yang diterima dari Google API oleh <strong>Sleman Mart</strong> ke aplikasi lain akan mematuhi{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
              >
                Google API Services User Data Policy <ExternalLink className="w-3.5 h-3.5" />
              </a>
              , termasuk persyaratan Penggunaan Terbatas (<em>Limited Use requirements</em>).
            </p>
            <p className="text-xs text-blue-800 italic border-t border-blue-200 pt-3">
              &quot;Sleman Mart&apos;s use and transfer to any other app of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.&quot;
            </p>
          </div>

          {/* Section 1: Pengantar */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              1. Pengantar
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Selamat datang di <strong>Sleman Mart</strong> (
              <a href="https://slemanmart.slemankab.go.id" className="text-orange-600 font-medium hover:underline">
                slemanmart.slemankab.go.id
              </a>
              ), platform digital resmi yang dikelola dan difasilitasi oleh <strong>Dinas Koperasi, Usaha Kecil dan Menengah Pemerintah Kabupaten Sleman</strong>.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, memproses, menyimpan, dan melindungi informasi pribadi Anda saat mengakses platform web Sleman Mart, termasuk ketika Anda mendaftar atau masuk menggunakan akun Google Anda melalui layanan Google OAuth 2.0.
            </p>
          </section>

          {/* Section 2: Data yang Kami Kumpulkan */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              2. Data Pribadi yang Kami Kumpulkan
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Kami hanya mengumpulkan informasi yang diperlukan untuk menyediakan layanan belanja, verifikasi pengguna, serta kelancaran transaksi produk UMKM Sleman:
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-orange-600" />
                  a. Data Akun Google (Google User Data)
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Jika Anda memilih untuk mendaftar atau masuk menggunakan opsi <strong>&quot;Masuk dengan Google&quot; (Google Sign-In)</strong>, kami meminta persetujuan Anda untuk mengakses data profil dasar dari Google OAuth 2.0:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-2">
                  <li><strong>Nama lengkap</strong> (untuk identitas akun pengguna).</li>
                  <li><strong>Alamat email</strong> (untuk autentikasi, notifikasi pesanan, dan verifikasi akun).</li>
                  <li><strong>Foto profil / Avatar</strong> (untuk tampilan avatar profil di dalam platform).</li>
                  <li><strong>Google User ID / OpenID identifier</strong> (pengenal unik untuk menghubungkan sesi login aman).</li>
                </ul>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-orange-600" />
                  b. Informasi Profil &amp; Transaksi
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Data yang Anda masukkan secara sukarela saat melengkapi profil dan memproses pesanan:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-2">
                  <li>Nomor telepon / WhatsApp untuk koordinasi konfirmasi pesanan dan pengiriman kurir.</li>
                  <li>Alamat pengiriman (kelurahan, kapanewon/kecamatan, kabupaten, kode pos, titik peta koordinat).</li>
                  <li>Riwayat transaksi pemesanan produk dan catatan pesanan.</li>
                </ul>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">
                  c. Data Teknis dan Cookie
                </h3>
                <p className="text-sm text-gray-600">
                  Kami mengumpulkan data teknis standar seperti alamat IP, jenis peramban (browser), dan cookie sesi untuk memastikan sesi login tetap aman dan terlindung dari akses yang tidak sah.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Tujuan Penggunaan Data */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              3. Bagaimana Kami Menggunakan Informasi Anda
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Informasi yang kami kumpulkan digunakan secara eksklusif untuk tujuan operasional platform:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2">
              <li>Memverifikasi identitas Anda dan menyediakan fitur autentikasi akun satu klik (Single Sign-On).</li>
              <li>Membuat dan memelihara akun pengguna Anda di platform Sleman Mart.</li>
              <li>Memfasilitasi proses checkout dan pengiriman barang dari merchant UMKM kepada Anda.</li>
              <li>Mengirimkan informasi status transaksi, pembaruan pesanan, dan verifikasi keamanan.</li>
              <li>Mendeteksi, mencegah kecurangan, dan meningkatkan keamanan sistem digital Pemerintah Kabupaten Sleman.</li>
            </ul>
          </section>

          {/* Section 4: Pengungkapan dan Pembagian Data */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              4. Perlindungan dan Pembagian Data Pihak Ketiga
            </h2>
            <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg mb-4 text-sm text-amber-900">
              <strong>Prinsip Utama:</strong> Sleman Mart <strong>TIDAK PERNAH</strong> menjual, menyewakan, atau memperdagangkan data pribadi pengguna kepada pihak ketiga mana pun untuk tujuan periklanan atau komersialisasi pihak luar.
            </div>
            <p className="text-gray-700 leading-relaxed mb-3">
              Data Anda hanya diteruskan dalam batasan-batasan ketat berikut:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2">
              <li>
                <strong>Merchant UMKM Terkait:</strong> Nama, nomor telepon, dan alamat pengiriman dibagikan kepada merchant UMKM tempat Anda memesan semata-mata untuk keperluan pengemasan dan pengiriman barang.
              </li>
              <li>
                <strong>Layanan Kurir / Ekspedisi:</strong> Alamat pengiriman dibagikan kepada jasa pengiriman yang dipilih untuk mengantarkan pesanan Anda.
              </li>
              <li>
                <strong>Kepatuhan Hukum:</strong> Apabila diwajibkan oleh peraturan perundang-undangan Republik Indonesia yang berlaku atas permintaan resmi otoritas penegak hukum.
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Batasan Data Google:</strong> Data pengguna yang diperoleh melalui Google OAuth API tidak akan pernah dibagikan kepada pihak ketiga untuk periklanan bertarget, analisis lintas situs, dan tidak akan pernah digunakan untuk melatih model kecerdasan buatan (AI/ML) pihak ketiga.
            </p>
          </section>

          {/* Section 5: Keamanan & Penyimpanan Data */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              5. Keamanan dan Penyimpanan Data
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Keamanan data Anda adalah prioritas kami. Kami menerapkan standar teknis dan organisasi yang ketat, antara lain:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2">
              <li>Enkripsi transmisi data menggunakan protokol HTTPS / SSL (Secure Sockets Layer).</li>
              <li>Penyimpanan kata sandi dengan algoritma hashing aman satu arah (one-way hashing).</li>
              <li>Pengelolaan token sesi otentikasi dengan proteksi perlindungan Cross-Site Scripting (XSS) dan Content Security Policy (CSP).</li>
              <li>Akses database yang dibatasi secara ketat hanya untuk staf teknis berwenang Dinas Koperasi dan UKM Kabupaten Sleman.</li>
            </ul>
          </section>

          {/* Section 6: Retensi dan Hak Penghapusan Data */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              6. Hak Pengguna &amp; Penghapusan Data (Data Deletion)
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Sebagai pengguna, Anda memiliki kendali penuh atas data pribadi Anda:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  Akses &amp; Pembaruan Data
                </h3>
                <p className="text-sm text-gray-600">
                  Anda dapat melihat dan memperbarui informasi profil, alamat, serta nomor kontak Anda kapan saja melalui menu Pengaturan Akun di Sleman Mart.
                </p>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-red-600" />
                  Pencabutan Izin Akun Google
                </h3>
                <p className="text-sm text-gray-600">
                  Anda dapat mencabut izin akses Sleman Mart ke akun Google Anda kapan saja melalui{" "}
                  <a
                    href="https://myaccount.google.com/permissions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline font-medium"
                  >
                    Google Account Security Settings
                  </a>.
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Prosedur Penghapusan Akun &amp; Data Pribadi:</h3>
              <p className="text-sm text-gray-600 mb-2">
                Jika Anda ingin menghapus seluruh akun dan data riwayat transaksi Anda dari sistem Sleman Mart secara permanen, Anda dapat mengajukan permohonan melalui email ke:
              </p>
              <div className="flex items-center gap-2 text-sm font-mono bg-white p-2 rounded border border-gray-300 w-fit text-gray-800">
                <Mail className="w-4 h-4 text-orange-600" />
                <span>dinkop_ukm@slemankab.go.id</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Dengan subjek &quot;Permohonan Penghapusan Akun Sleman Mart&quot; dan menyertakan alamat email yang terdaftar. Tim kami akan memproses penghapusan data maksimal dalam 7 hari kerja.
              </p>
            </div>
          </section>

          {/* Section 7: Perubahan Kebijakan */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              7. Perubahan Kebijakan Privasi
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu untuk menyesuaikan dengan pembaruan fitur layanan atau ketentuan hukum yang berlaku. Setiap perubahan akan diumumkan pada halaman ini dengan tanggal pembaruan terbaru. Penggunaan berkelanjutan Anda atas layanan Sleman Mart setelah pembaruan menandakan persetujuan Anda atas kebijakan yang diperbarui.
            </p>
          </section>

          {/* Section 8: Hubungi Kami */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              8. Hubungi Kami
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Apabila Anda memiliki pertanyaan, keluhan, atau permintaan klarifikasi terkait Kebijakan Privasi ini, silakan hubungi kami melalui kontak resmi berikut:
            </p>

            <div className="p-5 bg-white border border-gray-200 rounded-xl space-y-2 text-sm text-gray-700 shadow-sm">
              <p className="font-semibold text-gray-900 text-base">
                Dinas Koperasi, Usaha Kecil dan Menengah Pemerintah Kabupaten Sleman
              </p>
              <p>
                <strong>Alamat Kantor:</strong> Jl. Parasamya No. 1, Beran, Tridadi, Kec. Sleman, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55511
              </p>
              <p>
                <strong>Telepon:</strong> (0274) 865473, 868405
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:dinkop_ukm@slemankab.go.id" className="text-orange-600 hover:underline">
                  dinkop_ukm@slemankab.go.id
                </a>
              </p>
              <p>
                <strong>Website Resmi:</strong>{" "}
                <a
                  href="https://slemanmart.slemankab.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:underline"
                >
                  https://slemanmart.slemankab.go.id
                </a>
              </p>
            </div>
          </section>

          <div className="pt-6 border-t border-gray-200 flex flex-wrap gap-4 justify-between items-center text-sm text-gray-600">
            <Link href="/" className="text-orange-600 font-semibold hover:underline">
              &larr; Kembali ke Beranda Sleman Mart
            </Link>
            <Link href="/faq" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
              <HelpCircle className="w-4 h-4" /> Bantuan &amp; FAQ
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

