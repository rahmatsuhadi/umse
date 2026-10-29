"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import {
  ShieldCheck,
  Lock,
  UserCheck,
  Eye,
  Trash2,
  ExternalLink,
  HelpCircle,
  Globe,
  CheckCircle2,
  AlertCircle,
  Database,
  Share2,
} from "lucide-react";

export function PrivacyPolicyContent() {
  const [lang, setLang] = useState<"id" | "en">("id");
  const lastUpdated = "29 Oktober 2026";
  const lastUpdatedEn = "October 29, 2026";

  return (
    <>
      <Navbar />
      <div className="page active" id="page-privacy-policy">
        {/* Hero Section */}
        <div className="guide-hero">
          <div className="guide-hero-inner">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-semibold text-emerald-800 bg-emerald-100 rounded-full">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {lang === "id"
                  ? "Perlindungan Data & Privasi Pengguna"
                  : "User Data Protection & Privacy"}
              </span>
            </div>
            <h1>
              {lang === "id"
                ? "Kebijakan Privasi (Privacy Policy)"
                : "Privacy Policy — Sleman Mart"}
            </h1>
            <p>
              {lang === "id"
                ? "Komitmen Sleman Mart dalam menjaga keamanan, kerahasiaan, dan privasi data pribadi Anda saat menggunakan platform kami."
                : "Our commitment to safeguarding the security, confidentiality, and privacy of your personal data when using the Sleman Mart platform."}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-white/20">
              <p className="text-xs text-slate-100">
                {lang === "id" ? "Terakhir diperbarui: " : "Last updated: "}
                <strong>{lang === "id" ? lastUpdated : lastUpdatedEn}</strong>
              </p>

              {/* Language Switcher */}
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm p-1 rounded-lg border border-white/30 text-xs">
                <button
                  type="button"
                  onClick={() => setLang("id")}
                  className={`px-3 py-1 font-semibold rounded transition-colors ${
                    lang === "id"
                      ? "bg-white text-emerald-900 shadow-sm"
                      : "text-white hover:text-emerald-100"
                  }`}
                >
                  🇮🇩 Bahasa Indonesia
                </button>
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  className={`px-3 py-1 font-semibold rounded transition-colors flex items-center gap-1 ${
                    lang === "en"
                      ? "bg-white text-emerald-900 shadow-sm"
                      : "text-white hover:text-emerald-100"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" /> English (Verification)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="guide-body max-w-4xl mx-auto py-10 px-4">
          {/* Box Kepatuhan Google API (Always visible prominently in both modes) */}
          <div className="mb-10 p-6 bg-blue-50 border-2 border-blue-300 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              Google API Services User Data Policy Compliance
            </h2>
            <p className="text-sm text-blue-950 leading-relaxed mb-3">
              {lang === "id"
                ? "Penggunaan dan transfer informasi yang diterima dari Google API oleh Sleman Mart ke aplikasi lain akan mematuhi "
                : "Sleman Mart's use and transfer to any other app of information received from Google APIs will adhere to the "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
              >
                Google API Services User Data Policy <ExternalLink className="w-3.5 h-3.5" />
              </a>
              {lang === "id"
                ? ", termasuk persyaratan Penggunaan Terbatas (Limited Use requirements)."
                : ", including the Limited Use requirements."}
            </p>
            <div className="p-3 bg-white border border-blue-200 rounded-lg text-xs text-blue-900 font-mono italic">
              &quot;Sleman Mart&apos;s use and transfer to any other app of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.&quot;
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-xs text-blue-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No selling or renting of Google user data</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No targeted advertising or third-party marketing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No AI/ML model training on Google data</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>User can revoke access &amp; delete data anytime</span>
              </div>
            </div>
          </div>

          {lang === "id" ? (
            /* ==================== VERSI BAHASA INDONESIA ==================== */
            <div className="space-y-10">
              {/* Section 1: Pengantar */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  1. Pengantar &amp; Identitas Aplikasi
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Selamat datang di <strong>Sleman Mart</strong> (
                  <a href="https://slemanmart.slemankab.go.id" className="text-orange-600 font-medium hover:underline">
                    https://slemanmart.slemankab.go.id
                  </a>
                  ), platform digital resmi yang dikembangkan dan dikelola oleh{" "}
                  <strong>Dinas Koperasi, Usaha Kecil dan Menengah Pemerintah Kabupaten Sleman, Daerah Istimewa Yogyakarta</strong>.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>Akses Terbuka untuk Publik:</strong> Platform Sleman Mart dirancang agar dapat diakses secara publik dan bebas oleh seluruh masyarakat tanpa harus melakukan pendaftaran atau login terlebih dahulu. Pengunjung dapat secara bebas menelusuri katalog produk UMKM, mencari informasi merchant lokal, dan membaca panduan literasi usaha.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Kebijakan Privasi ini menguraikan komitmen kami dalam mengumpulkan, mengelola, menyimpan, dan melindungi informasi pribadi pengguna, termasuk saat pengguna memilih opsi pendaftaran atau masuk menggunakan akun Google melalui protokol resmi Google OAuth 2.0.
                </p>
              </section>

              {/* Section 2: Data yang Dikumpulkan */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  2. Data Pribadi yang Kami Kumpulkan
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Kami mengumpulkan data yang terbatas, proporsional, dan relevan semata-mata untuk otentikasi pengguna serta pemrosesan transaksi belanja produk UMKM:
                </p>

                <div className="space-y-4">
                  {/* Google Data */}
                  <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-base">
                      <UserCheck className="w-4 h-4 text-orange-600" />
                      a. Data Pengguna Akun Google (Google User Data via OAuth 2.0)
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Apabila Anda memilih opsi <strong>&quot;Masuk dengan Google&quot; (Google Sign-In)</strong>, kami meminta persetujuan Anda untuk membaca profil dasar pengguna melalui scope Google standar (<code>openid</code>, <code>profile</code>, <code>email</code>):
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1.5 pl-2">
                      <li>
                        <strong>Google User ID (ID Unik Pengguna Google):</strong> Pengenal unik untuk menghubungkan dan mengamankan sesi masuk akun pembeli di Sleman Mart.
                      </li>
                      <li>
                        <strong>Nama Lengkap (Full Name):</strong> Digunakan untuk menampilkan identitas akun pembeli pada antarmuka akun dan faktur pemesanan.
                      </li>
                      <li>
                        <strong>Alamat Email:</strong> Digunakan sebagai identitas utama login, verifikasi akun, pengiriman tanda terima transaksi, dan notifikasi pesanan.
                      </li>
                      <li>
                        <strong>Foto Profil / Avatar:</strong> Digunakan untuk menampilkan avatar akun Anda di bagian menu profil pengguna.
                      </li>
                    </ul>
                  </div>

                  {/* Transaction Info */}
                  <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-base">
                      <Eye className="w-4 h-4 text-orange-600" />
                      b. Data Transaksi &amp; Pengiriman (Dimasukkan Sukarela oleh Pengguna)
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Informasi yang Anda sediakan saat menyelesaikan pesanan produk dari pelaku UMKM:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-2">
                      <li>Nomor telepon / WhatsApp penerima untuk koordinasi kurir dan pengiriman.</li>
                      <li>Alamat pengiriman lengkap (kapanewon, kalurahan, alamat rumah, kode pos, dan titik pin lokasi peta).</li>
                      <li>Riwayat transaksi pemesanan, catatan produk, dan konfirmasi pembayaran.</li>
                    </ul>
                  </div>

                  {/* Technical Data */}
                  <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-base">
                      <Database className="w-4 h-4 text-orange-600" />
                      c. Data Teknis dan Log Keamanan
                    </h3>
                    <p className="text-sm text-gray-600">
                      Alamat IP, tipe peramban web (browser), dan cookie sesi terenkripsi untuk mengamankan platform dari serangan Cross-Site Request Forgery (CSRF).
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3: Tujuan Penggunaan Data */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  3. Tujuan Penggunaan Informasi Anda
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                  Seluruh data yang dikumpulkan dari Google OAuth dan formulir belanja hanya digunakan untuk keperluan fungsional aplikasi Sleman Mart:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2 text-sm leading-relaxed">
                  <li>
                    <strong>Autentikasi Pengguna:</strong> Memverifikasi identitas pengguna secara instan dan aman melalui Google Sign-In tanpa perlu kata sandi terpisah.
                  </li>
                  <li>
                    <strong>Pemrosesan Pesanan:</strong> Menghubungkan pembeli dengan merchant UMKM Kabupaten Sleman untuk transaksi jual-beli produk lokal.
                  </li>
                  <li>
                    <strong>Notifikasi Layanan:</strong> Mengirimkan pembaruan status transaksi, konfirmasi pembayaran QRIS BPD DIY, dan status resi pengiriman kurir.
                  </li>
                  <li>
                    <strong>Layanan Konsumen:</strong> Menjawab kendala, pertanyaan, atau permohonan pembatalan/retur transaksi pengguna.
                  </li>
                  <li>
                    <strong>Keamanan Sistem:</strong> Melindungi platform dari akses tanpa hak dan aktivitas penipuan.
                  </li>
                </ul>
              </section>

              {/* Section 4: Pembagian Data & Larangan Iklan */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  4. Pembagian Data Pihak Ketiga &amp; Larangan Komersialisasi
                </h2>
                <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl mb-4 text-sm text-emerald-950 font-medium">
                  <strong>Jaminan Mutlak:</strong> Sleman Mart <strong>TIDAK PERNAH</strong> menjual, menyewakan, memperdagangkan, atau membagikan data pribadi pengguna maupun data Google OAuth kepada pialang data (data broker), perusahaan periklanan, atau pihak komersial mana pun.
                </div>

                <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                  Data Anda hanya dibagikan dalam kondisi terbatas berikut:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2 text-sm leading-relaxed mb-4">
                  <li>
                    <strong>Pelaku UMKM Terkait:</strong> Nama, alamat pengiriman, dan nomor telepon penerima dibagikan kepada merchant UMKM tempat Anda berbelanja semata-mata untuk penyiapan dan pengiriman paket pesanan.
                  </li>
                  <li>
                    <strong>Jasa Ekspedisi / Kurir:</strong> Data alamat dan nomor telepon diberikan kepada kurir pengantaran agar barang pesanan sampai ke alamat tujuan.
                  </li>
                  <li>
                    <strong>Kewajiban Hukum Negara:</strong> Apabila diwajibkan secara tegas oleh hukum Republik Indonesia atas permintaan resmi instansi penegak hukum.
                  </li>
                </ul>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-sm text-gray-700">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-orange-600" />
                    Batasan Khusus Penggunaan Data Google (Google API Restricted Disclosures):
                  </h4>
                  <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs md:text-sm">
                    <li>Data akun Google Anda <strong>TIDAK PERNAH</strong> digunakan untuk penayangan iklan bertarget, retargeting, atau analisis lintas situs.</li>
                    <li>Data akun Google Anda <strong>TIDAK PERNAH</strong> digunakan untuk melatih model kecerdasan buatan (Artificial Intelligence / Machine Learning) pihak ketiga.</li>
                    <li>Data akun Google Anda <strong>TIDAK PERNAH</strong> ditransfer ke aplikasi lain selain untuk kebutuhan operasional langsung platform Sleman Mart.</li>
                  </ul>
                </div>
              </section>

              {/* Section 5: Keamanan & Penyimpanan */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  5. Keamanan dan Penyimpanan Data
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                  Kami mengimplementasikan standar keamanan teknis dan administratif yang ketat:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1.5 pl-2 text-sm leading-relaxed">
                  <li>Enkripsi transmisi data menyeluruh menggunakan protokol HTTPS / TLS 1.2+.</li>
                  <li>Penerapan Content Security Policy (CSP), proteksi XSS, dan cookie berbasis HttpOnly/Secure.</li>
                  <li>Akses database server dibatasi hanya untuk staf teknis berwenang Dinas Koperasi dan UKM Kabupaten Sleman dengan autentikasi multifaktor.</li>
                  <li>Audit keamanan dan pemantauan sistem secara berkala oleh Pemerintah Kabupaten Sleman.</li>
                </ul>
              </section>

              {/* Section 6: Retensi & Hak Penghapusan Data */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  6. Retensi Data &amp; Hak Penghapusan Akun (Data Deletion)
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                  Kami menyimpan data pengguna selama akun Anda aktif di Sleman Mart. Anda berhak mencabut izin akses Google atau meminta penghapusan akun beserta data terkait secara permanen:
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-white border border-gray-200 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                      <Lock className="w-4 h-4 text-blue-600" />
                      1. Mencabut Izin Akses Akun Google
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                      Anda dapat memutuskan tautan izin akses Sleman Mart ke akun Google Anda sewaktu-waktu melalui dasbor keamanan Google:
                    </p>
                    <a
                      href="https://myaccount.google.com/permissions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 underline"
                    >
                      Buka Google Account Permissions <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="p-4 bg-white border border-gray-200 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                      <Trash2 className="w-4 h-4 text-red-600" />
                      2. Permohonan Penghapusan Akun &amp; Data Pribadi
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                      Anda dapat meminta penghapusan permanen data akun dan transaksi Anda dengan mengirimkan email resmi ke:
                    </p>
                    <div className="text-xs font-mono bg-gray-100 p-2 rounded text-gray-800">
                      dinkop_ukm@slemankab.go.id
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" /> Waktu Pemrosesan Permohonan:
                  </p>
                  <p>
                    Kirimkan permohonan dengan subjek <strong>&quot;Permohonan Penghapusan Data Akun Sleman Mart&quot;</strong> dari alamat email yang terdaftar. Tim teknis Dinas Koperasi dan UKM Kabupaten Sleman akan memverifikasi dan menghapus data pribadi Anda secara permanen dalam waktu maksimal <strong>7 (tujuh) hari kerja</strong>.
                  </p>
                </div>
              </section>

              {/* Section 7: Hubungi Kami */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  7. Kontak Resmi Pengelola
                </h2>
                <div className="p-6 bg-white border border-gray-200 rounded-2xl space-y-2 text-sm text-gray-700 shadow-sm">
                  <p className="font-bold text-gray-900 text-base">
                    Dinas Koperasi, Usaha Kecil dan Menengah Pemerintah Kabupaten Sleman
                  </p>
                  <p>
                    <strong>Alamat Kantor:</strong> Jalan Parasamya No. 1, Beran, Tridadi, Kapanewon Sleman, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55511
                  </p>
                  <p>
                    <strong>Telepon:</strong> (0274) 865473, 868405
                  </p>
                  <p>
                    <strong>Email Resmi:</strong>{" "}
                    <a href="mailto:dinkop_ukm@slemankab.go.id" className="text-orange-600 font-semibold hover:underline">
                      dinkop_ukm@slemankab.go.id
                    </a>
                  </p>
                  <p>
                    <strong>Situs Web Resmi:</strong>{" "}
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
            </div>
          ) : (
            /* ==================== ENGLISH VERSION (FOR GOOGLE REVIEWERS) ==================== */
            <div className="space-y-10">
              {/* Section 1: Introduction */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  1. Introduction &amp; Application Identity
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Welcome to <strong>Sleman Mart</strong> (
                  <a href="https://slemanmart.slemankab.go.id" className="text-orange-600 font-medium hover:underline">
                    https://slemanmart.slemankab.go.id
                  </a>
                  ), the official digital marketplace and public business directory platform established and operated by the{" "}
                  <strong>Department of Cooperatives and Small-Medium Enterprises, Government of Sleman Regency, Special Region of Yogyakarta, Indonesia</strong>.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>Public Accessibility:</strong> The Sleman Mart platform is open and freely accessible to the public. Users can explore local products, browse merchant stores, and view business directories without logging in.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  This Privacy Policy describes how Sleman Mart collects, uses, protects, and handles personal data when you use our website, including when you choose to register or authenticate using Google Sign-In via Google OAuth 2.0.
                </p>
              </section>

              {/* Section 2: Personal Data Collected */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  2. Personal Data We Collect
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We collect only the minimal data strictly necessary to provide user authentication, account management, and order fulfillment:
                </p>

                <div className="space-y-4">
                  {/* Google OAuth Data */}
                  <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-base">
                      <UserCheck className="w-4 h-4 text-orange-600" />
                      a. Google User Data (Collected via Google OAuth 2.0)
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      When you click <strong>&quot;Masuk dengan Google&quot; (Sign in with Google)</strong>, we request consent to access standard profile information under the scopes <code>openid</code>, <code>profile</code>, and <code>email</code>:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1.5 pl-2">
                      <li>
                        <strong>Google User ID (Unique Subject Identifier):</strong> A unique alphanumeric ID used to identify your account and associate your secure authenticated session.
                      </li>
                      <li>
                        <strong>Full Name (given_name and family_name):</strong> Used to display your buyer profile name in your dashboard and on order receipts.
                      </li>
                      <li>
                        <strong>Email Address:</strong> Used as your primary account identifier and to send purchase confirmations, QRIS payment status, and order tracking notices.
                      </li>
                      <li>
                        <strong>Profile Picture URL:</strong> Used to display your avatar image within the application navigation bar.
                      </li>
                    </ul>
                  </div>

                  {/* Order & Contact Data */}
                  <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-base">
                      <Eye className="w-4 h-4 text-orange-600" />
                      b. User-Provided Delivery &amp; Contact Information
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Information provided voluntarily by users when completing purchases:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-2">
                      <li>Recipient phone / WhatsApp number for shipping updates and delivery courier coordination.</li>
                      <li>Shipping address (subdistrict, village, street address, postal code, and map coordinates).</li>
                      <li>Order transaction records, payment status, and optional product reviews.</li>
                    </ul>
                  </div>

                  {/* Technical Logs */}
                  <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-base">
                      <Database className="w-4 h-4 text-orange-600" />
                      c. Technical and Security Log Data
                    </h3>
                    <p className="text-sm text-gray-600">
                      IP address, browser type, and secure session tokens used to safeguard against CSRF attacks and maintain secure sessions.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3: Purpose of Data Usage */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  3. Purpose and Use of Collected Information
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                  We use Google user data and profile information solely for legitimate operational purposes:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2 text-sm leading-relaxed">
                  <li>
                    <strong>User Authentication:</strong> Providing a seamless, passwordless One-Click Sign-In experience.
                  </li>
                  <li>
                    <strong>Order Processing:</strong> Facilitating shopping transactions between buyers and verified Sleman Regency MSME merchants.
                  </li>
                  <li>
                    <strong>Transactional Communication:</strong> Sending order confirmations, QRIS payment status, and delivery tracking information.
                  </li>
                  <li>
                    <strong>Customer Support:</strong> Assisting users with inquiries, disputes, or order cancellations.
                  </li>
                  <li>
                    <strong>Security &amp; Fraud Prevention:</strong> Protecting users and government infrastructure from unauthorized access.
                  </li>
                </ul>
              </section>

              {/* Section 4: Data Sharing, No Ads, No AI Training */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  4. Data Sharing Policy &amp; Strict Non-Commercialization
                </h2>
                <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl mb-4 text-sm text-emerald-950 font-medium">
                  <strong>Strict Guarantee:</strong> Sleman Mart <strong>DOES NOT SELL, LEASE, TRADE, OR MONETIZE</strong> any user personal data or Google user data to data brokers, ad networks, or third parties for any marketing or advertising purpose.
                </div>

                <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                  Personal data is only disclosed under the following strictly defined conditions:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2 text-sm leading-relaxed mb-4">
                  <li>
                    <strong>Designated MSME Merchants:</strong> Recipient name, delivery address, and contact number are provided to the specific merchant you purchased from, strictly for packing and order fulfillment.
                  </li>
                  <li>
                    <strong>Couriers and Delivery Partners:</strong> Shipping details are shared with selected delivery couriers to ensure accurate doorstep delivery.
                  </li>
                  <li>
                    <strong>Legal Mandates:</strong> Where required by valid law or official court order issued by Indonesian law enforcement authorities.
                  </li>
                </ul>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-sm text-blue-950">
                  <h4 className="font-bold flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-600" />
                    Special Disclosures regarding Google API User Data:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 pl-2 text-xs md:text-sm">
                    <li>Google user data is <strong>NEVER</strong> used for serving personalized or targeted advertisements.</li>
                    <li>Google user data is <strong>NEVER</strong> used to train, retrain, or improve generalized Artificial Intelligence (AI) or Machine Learning (ML) models.</li>
                    <li>Google user data is <strong>NEVER</strong> transferred to any third party except as strictly necessary to fulfill the user-facing functionality of Sleman Mart.</li>
                  </ul>
                </div>
              </section>

              {/* Section 5: Security */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  5. Data Security and Storage
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                  We deploy rigorous administrative and technical safeguards to secure your information:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1.5 pl-2 text-sm leading-relaxed">
                  <li>Full TLS/HTTPS encryption in transit (128-bit/256-bit encryption).</li>
                  <li>HttpOnly and Secure flags for session tokens to mitigate cross-site scripting (XSS).</li>
                  <li>Role-based access controls limiting database access to authorized technical administrators of Sleman Regency.</li>
                  <li>Ongoing security audits and vulnerability monitoring.</li>
                </ul>
              </section>

              {/* Section 6: Retention & Deletion */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  6. Data Retention, Revocation &amp; Deletion Rights
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                  Users maintain full ownership and control over their personal data:
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-white border border-gray-200 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                      <Lock className="w-4 h-4 text-blue-600" />
                      1. Revoking Google Account Permissions
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                      You can revoke Sleman Mart&apos;s access to your Google account at any time via Google Account Security:
                    </p>
                    <a
                      href="https://myaccount.google.com/permissions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 underline"
                    >
                      Visit Google Account Permissions <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="p-4 bg-white border border-gray-200 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                      <Trash2 className="w-4 h-4 text-red-600" />
                      2. Permanent Account &amp; Data Deletion
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                      To permanently delete your user profile and associated account data from Sleman Mart, send an email request to:
                    </p>
                    <div className="text-xs font-mono bg-gray-100 p-2 rounded text-gray-800">
                      dinkop_ukm@slemankab.go.id
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" /> Data Deletion Service Level Agreement:
                  </p>
                  <p>
                    Please send your deletion request with the subject line <strong>&quot;Sleman Mart Account Deletion Request&quot;</strong> from your registered email address. The Sleman Regency IT team will process the deletion and permanently erase your account data within <strong>7 business days</strong>.
                  </p>
                </div>
              </section>

              {/* Section 7: Contact Info */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  7. Official Contact Information
                </h2>
                <div className="p-6 bg-white border border-gray-200 rounded-2xl space-y-2 text-sm text-gray-700 shadow-sm">
                  <p className="font-bold text-gray-900 text-base">
                    Department of Cooperatives and SMEs, Sleman Regency Government
                  </p>
                  <p>
                    <strong>Office Address:</strong> Jl. Parasamya No. 1, Beran, Tridadi, Sleman Subdistrict, Sleman Regency, Special Region of Yogyakarta, Indonesia 55511
                  </p>
                  <p>
                    <strong>Phone:</strong> +62 (0274) 865473, 868405
                  </p>
                  <p>
                    <strong>Official Email:</strong>{" "}
                    <a href="mailto:dinkop_ukm@slemankab.go.id" className="text-orange-600 font-semibold hover:underline">
                      dinkop_ukm@slemankab.go.id
                    </a>
                  </p>
                  <p>
                    <strong>Website:</strong>{" "}
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
            </div>
          )}

          {/* Footer Backlinks */}
          <div className="pt-8 mt-12 border-t border-gray-200 flex flex-wrap gap-4 justify-between items-center text-sm text-gray-600">
            <Link href="/" className="text-orange-600 font-semibold hover:underline">
              &larr; {lang === "id" ? "Kembali ke Beranda Sleman Mart" : "Back to Sleman Mart Home"}
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/terms-conditions" className="hover:text-gray-900 underline">
                {lang === "id" ? "Syarat & Ketentuan" : "Terms & Conditions"}
              </Link>
              <Link href="/faq" className="hover:text-gray-900 flex items-center gap-1">
                <HelpCircle className="w-4 h-4" /> FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

