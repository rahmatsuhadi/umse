import { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FileText, ShieldAlert, CheckCircle, Scale, AlertTriangle, HelpCircle, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan (Terms & Conditions) | Sleman Mart",
  description:
    "Syarat dan Ketentuan Penggunaan Layanan Platform Digital Sleman Mart (Dinas Koperasi dan UKM Kabupaten Sleman).",
};

export default function TermsConditionsPage() {
  const lastUpdated = "29 Oktober 2026";

  return (
    <>
      <Navbar />
      <div className="page active" id="page-terms-conditions">
        {/* Hero Section */}
        <div className="guide-hero">
          <div className="guide-hero-inner">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
              <FileText className="w-4 h-4" />
              <span>Ketentuan Layanan &amp; Hukum Penggunaan</span>
            </div>
            <h1>Syarat &amp; Ketentuan (Terms &amp; Conditions)</h1>
            <p>
              Harap baca syarat dan ketentuan ini dengan cermat sebelum mengakses atau menggunakan platform digital Sleman Mart.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Terakhir diperbarui: <strong>{lastUpdated}</strong>
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="guide-body max-w-4xl mx-auto py-10 px-4">
          {/* Ringkasan Kesepakatan */}
          <div className="mb-10 p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-600" />
              Perjanjian Penggunaan Layanan
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Dengan mengakses, mendaftar, atau menggunakan layanan platform <strong>Sleman Mart</strong> (
              <a href="https://slemanmart.slemankab.go.id" className="text-blue-600 font-semibold underline">
                slemanmart.slemankab.go.id
              </a>
              ), termasuk saat melakukan login menggunakan akun Google, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat secara hukum oleh Syarat dan Ketentuan ini serta{" "}
              <Link href="/privacy-policy" className="text-blue-600 font-semibold underline">
                Kebijakan Privasi
              </Link>{" "}
              kami. Jika Anda tidak menyetujui salah satu ketentuan ini, mohon untuk tidak melanjutkan penggunaan platform kami.
            </p>
          </div>

          {/* Section 1: Definisi & Gambaran Umum */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              1. Definisi &amp; Gambaran Umum
            </h2>
            <ul className="space-y-3 text-gray-700 leading-relaxed">
              <li>
                <strong>&quot;Sleman Mart&quot;</strong> adalah platform marketplace dan direktori digital resmi yang dikembangkan dan dikelola oleh Dinas Koperasi, Usaha Kecil dan Menengah Pemerintah Kabupaten Sleman untuk memberdayakan serta memperluas jangkauan pasar produk lokal UMKM di wilayah Kabupaten Sleman.
              </li>
              <li>
                <strong>&quot;Pengguna&quot;</strong> adalah setiap orang perorangan atau badan hukum yang mengakses, mendaftar, atau menggunakan fitur-fitur di platform Sleman Mart, baik sebagai pembeli maupun calon pembeli.
              </li>
              <li>
                <strong>&quot;Merchant / Penjual UMKM&quot;</strong> adalah pelaku usaha mikro, kecil, dan menengah di Kabupaten Sleman yang telah terverifikasi untuk menampilkan dan menjual produknya melalui platform.
              </li>
              <li>
                <strong>&quot;Layanan Pihak Ketiga&quot;</strong> merujuk pada integrasi eksternal termasuk namun tidak terbatas pada layanan Google OAuth 2.0, layanan peta, dan payment gateway yang mendukung operasional platform.
              </li>
            </ul>
          </section>

          {/* Section 2: Kelayakan & Pendaftaran Akun */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              2. Kelayakan &amp; Pendaftaran Akun
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  a. Syarat Kelayakan
                </h3>
                <p className="text-sm text-gray-600">
                  Pengguna minimal berusia 18 tahun atau memiliki kecakapan hukum menurut undang-undang Republik Indonesia untuk membuat perjanjian yang mengikat secara sah. Pengguna di bawah usia 18 tahun wajib didampingi oleh orang tua atau wali yang sah.
                </p>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  b. Pendaftaran Akun dan Autentikasi Google
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Pengguna dapat mendaftar dengan membuat akun secara mandiri atau menggunakan opsi <strong>&quot;Masuk dengan Google&quot; (Google Sign-In)</strong>. Dengan menggunakan fitur ini:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-2">
                  <li>Anda menjamin bahwa akun Google yang digunakan adalah milik Anda yang sah dan aktif.</li>
                  <li>Anda bertanggung jawab penuh atas segala aktivitas yang terjadi di bawah akun Anda.</li>
                  <li>Anda wajib menjaga kerahasiaan kredensial akun dan segera memberi tahu kami jika mendeteksi penggunaan tanpa izin.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Tata Tertib & Perilaku Pengguna */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              3. Tata Tertib &amp; Larangan Penggunaan
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Dalam menggunakan platform Sleman Mart, Pengguna dilarang keras untuk:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2">
              <li>Melakukan tindakan penipuan, manipulasi data pesanan, atau transaksi fiktif.</li>
              <li>Menyalahgunakan integrasi sistem (API), meretas, melancarkan serangan DoS/DDoS, atau mengganggu stabilitas infrastruktur server.</li>
              <li>Mengumpulkan atau menyalin data pengguna lain secara otomatis (scraping/crawling) tanpa izin tertulis dari Pemerintah Kabupaten Sleman.</li>
              <li>Memposting ulasan, komentar, atau konten yang mengandung unsur SARA, pornografi, ujaran kebencian, pencemaran nama baik, atau melanggar hak kekayaan intelektual orang lain.</li>
              <li>Menggunakan layanan Sleman Mart untuk tujuan aktivitas ilegal yang melanggar hukum Republik Indonesia.</li>
            </ul>
          </section>

          {/* Section 4: Ketentuan Transaksi & Pemesanan */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              4. Ketentuan Transaksi, Pemesanan, &amp; Pengiriman
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong>a. Informasi Produk:</strong> Deskripsi, foto, harga, dan ketersediaan stok produk disediakan langsung oleh masing-masing merchant UMKM Kabupaten Sleman. Merchant bertanggung jawab atas keakuratan informasi produk yang mereka tawarkan.
              </p>
              <p>
                <strong>b. Pembayaran:</strong> Pembayaran dilakukan melalui metode resmi yang disediakan pada platform. Sleman Mart tidak bertanggung jawab atas transaksi pembayaran yang dilakukan di luar rekening atau kanal resmi yang telah ditentukan.
              </p>
              <p>
                <strong>c. Pengiriman &amp; Penerimaan:</strong> Pengiriman dilakukan oleh kurir atau penyedia jasa ekspedisi. Pembeli wajib memberikan data alamat penerima yang akurat dan lengkap untuk memastikan pesanan tiba di tujuan tepat waktu.
              </p>
            </div>
          </section>

          {/* Section 5: Layanan Pihak Ketiga & Google OAuth */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              5. Integrasi Layanan Pihak Ketiga &amp; Google
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Sleman Mart memanfaatkan layanan pihak ketiga yang terpercaya, termasuk otentikasi Google OAuth 2.0 untuk memberikan pengalaman masuk akun yang aman dan cepat.
            </p>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900 leading-relaxed space-y-2">
              <p>
                Penggunaan layanan Google tunduk pada ketentuan layanan masing-masing pihak:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>
                  <a
                    href="https://policies.google.com/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold hover:text-blue-700"
                  >
                    Google Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="https://developers.google.com/terms/api-services-user-data-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold hover:text-blue-700"
                  >
                    Google API Services User Data Policy
                  </a>
                </li>
              </ul>
              <p className="text-xs text-blue-800 pt-2 border-t border-blue-200">
                Sleman Mart mematuhi sepenuhnya kebijakan data pengguna Google dan tidak akan menyalahgunakan kredensial maupun token otentikasi yang diberikan.
              </p>
            </div>
          </section>

          {/* Section 6: Hak Kekayaan Intelektual */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              6. Hak Kekayaan Intelektual
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Seluruh logo, merek dagang &quot;Sleman Mart&quot;, desain grafis, teks, antarmuka pengguna, kode program, dan materi promosi yang terdapat dalam platform ini adalah hak milik dari Dinas Koperasi dan UKM Pemerintah Kabupaten Sleman atau pemilik lisensi yang sah. Dilarang menyalin, mereproduksi, mendistribusikan, atau mempublikasikan ulang tanpa izin tertulis dari pihak pengelola.
            </p>
          </section>

          {/* Section 7: Batasan Tanggung Jawab */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              7. Penafian &amp; Batasan Tanggung Jawab
            </h2>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-amber-950">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Penafian (Disclaimer of Warranties)
              </div>
              <p>
                Platform Sleman Mart disediakan &quot;sebagaimana adanya&quot; (<em>as is</em>) dan &quot;sebagaimana tersedia&quot; (<em>as available</em>). Pemerintah Kabupaten Sleman berupaya optimal menjaga ketersediaan sistem, namun tidak memberikan jaminan bahwa akses platform akan bebas dari gangguan teknis, keterlambatan, atau pemeliharaan server sewaktu-waktu.
              </p>
              <p>
                Sleman Mart bertindak sebagai fasilitator digital bagi UMKM lokal dan tidak bertanggung jawab atas kerugian tidak langsung yang timbul akibat sengketa antara pembeli dan merchant terkait mutu fisik barang yang dikirim oleh merchant.
              </p>
            </div>
          </section>

          {/* Section 8: Penangguhan & Pemutusan Akun */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              8. Penangguhan &amp; Penutupan Akun
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Pihak pengelola berhak untuk menangguhkan, membatasi, atau menutup akun pengguna secara sepihak tanpa pemberitahuan sebelumnya apabila:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 pl-2">
              <li>Pengguna terbukti melanggar Syarat dan Ketentuan ini atau peraturan hukum yang berlaku.</li>
              <li>Ditemukan indikasi penipuan, transaksi mencurigakan, atau peretasan akun.</li>
              <li>Diminta secara resmi oleh pihak berwenang atau aparat penegak hukum.</li>
            </ul>
          </section>

          {/* Section 9: Hukum yang Berlaku & Penyelesaian Sengketa */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              9. Hukum yang Berlaku &amp; Penyelesaian Sengketa
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Syarat dan Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum Negara Kesatuan Republik Indonesia. Setiap perselisihan atau sengketa yang timbul sehubungan dengan penggunaan platform Sleman Mart akan diselesaikan secara musyawarah untuk mufakat terlebih dahulu, dan apabila tidak tercapai kesepakatan, akan diselesaikan melalui yurisdiksi Pengadilan Negeri Sleman.
            </p>
          </section>

          {/* Section 10: Pembaruan Ketentuan */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              10. Perubahan Syarat &amp; Ketentuan
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Kami berhak mengubah atau memperbarui Syarat dan Ketentuan ini sewaktu-waktu. Perubahan tersebut akan berlaku efektif segera setelah diumumkan di halaman ini. Dengan terus mengakses platform Sleman Mart setelah pembaruan diterbitkan, Anda dianggap menyetujui perubahan tersebut.
            </p>
          </section>

          {/* Section 11: Kontak Resmi */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              11. Kontak Resmi Pengelola
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Jika Anda memiliki pertanyaan mengenai Syarat dan Ketentuan ini, silakan hubungi tim pengelola resmi kami:
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
            <div className="flex gap-4">
              <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900">
                Kebijakan Privasi
              </Link>
              <Link href="/faq" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                <HelpCircle className="w-4 h-4" /> Bantuan &amp; FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

