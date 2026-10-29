"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Info, Store, Users, ShoppingBag, Lock, ExternalLink, Globe, CheckCircle2 } from "lucide-react";

export function PlatformAboutSection() {
  const [lang, setLang] = useState<"id" | "en">("id");

  return (
    <section className="section bg-white border-t border-b border-orange-100 py-12 md:py-16" id="about-slemanmart">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header & Language Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 text-xs font-bold text-orange-800 bg-orange-100 rounded-full">
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              <span>Platform Resmi Pemerintah Kabupaten Sleman</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              {lang === "id"
                ? "Tentang Sleman Mart & Tujuan Layanan Platform"
                : "About Sleman Mart & Platform Purpose"}
            </h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              {lang === "id"
                ? "Platform e-commerce dan direktori UMKM publik binaan Dinas Koperasi dan UKM Kabupaten Sleman."
                : "Official public e-commerce & MSME directory platform by Department of Cooperatives & SMEs of Sleman Regency."}
            </p>
          </div>

          {/* Language Toggle for Google Reviewers & International Visitors */}
          <div className="inline-flex items-center bg-gray-100 p-1 rounded-lg self-start md:self-auto border border-gray-200">
            <button
              type="button"
              onClick={() => setLang("id")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                lang === "id"
                  ? "bg-white text-orange-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              🇮🇩 Bahasa Indonesia
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                lang === "en"
                  ? "bg-white text-orange-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> English (Verification)
            </button>
          </div>
        </div>

        {/* Content Box */}
        {lang === "id" ? (
          <div className="space-y-8">
            {/* Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-orange-50/60 border border-orange-200/80 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center mb-3 shadow-sm">
                  <Store className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">1. Profil &amp; Pengelola Aplikasi</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong>Sleman Mart</strong> (
                  <span className="font-mono text-orange-700">slemanmart.slemankab.go.id</span>) adalah platform
                  resmi yang dikelola langsung oleh <strong>Dinas Koperasi, Usaha Kecil dan Menengah Kabupaten Sleman</strong> untuk
                  mendukung transformasi digital dan pembinaan ratusan pelaku UMKM di Kabupaten Sleman.
                </p>
              </div>

              <div className="p-5 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-sm">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">2. Akses Publik Bebas Login</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Seluruh masyarakat dan pengunjung dapat <strong>bebas menjelajah</strong> katalog ribuan produk kuliner, kriya,
                  batik, profil toko merchant, dan direktori sentra UMKM di 17 Kapanewon <strong>tanpa harus mendaftar atau login terlebih dahulu</strong>.
                </p>
              </div>

              <div className="p-5 bg-blue-50/60 border border-blue-200/80 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3 shadow-sm">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">3. Tujuan Autentikasi Google</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Fitur <em>Masuk dengan Google (Google OAuth 2.0)</em> disediakan semata-mata untuk memudahkan pembeli
                  dalam melakukan verifikasi akun satu klik, menyimpan alamat pengiriman, dan melacak riwayat transaksi belanja secara aman.
                </p>
              </div>
            </div>

            {/* Detailed Description & Compliance */}
            <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl space-y-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-1">
                    Komitmen Privasi &amp; Perlindungan Data Pengguna
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Sleman Mart hanya meminta izin akses data profil dasar dari Google (nama, alamat email, dan foto profil). Data tersebut <strong>TIDAK PERNAH</strong> dijual, disewakan, dibagikan ke pihak ketiga untuk keperluan iklan, maupun digunakan untuk melatih kecerdasan buatan (AI/ML). Penggunaan data mematuhi penuh{" "}
                    <a
                      href="https://developers.google.com/terms/api-services-user-data-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      Google API Services User Data Policy <ExternalLink className="w-3.5 h-3.5" />
                    </a>{" "}
                    termasuk persyaratan Penggunaan Terbatas (<em>Limited Use requirements</em>).
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-4 items-center justify-between text-xs md:text-sm">
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/privacy-policy"
                    className="font-semibold text-orange-600 hover:text-orange-700 underline flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Baca Kebijakan Privasi Lengkap
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    href="/terms-conditions"
                    className="font-semibold text-gray-700 hover:text-gray-900 underline"
                  >
                    Syarat &amp; Ketentuan Layanan
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    href="/panduan-pembeli"
                    className="font-semibold text-gray-700 hover:text-gray-900 underline"
                  >
                    Panduan Pembeli
                  </Link>
                </div>
                <span className="text-gray-500 font-medium">
                  Hubungi: <a href="mailto:dinkop_ukm@slemankab.go.id" className="text-gray-700 hover:underline font-mono">dinkop_ukm@slemankab.go.id</a>
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* English Version for Google Reviewers */
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-orange-50/60 border border-orange-200/80 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center mb-3 shadow-sm">
                  <Store className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">1. App Identity &amp; Operator</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong>Sleman Mart</strong> (
                  <span className="font-mono text-orange-700">slemanmart.slemankab.go.id</span>) is the official public digital
                  marketplace and business directory platform developed and operated by the <strong>Department of Cooperatives and SMEs, Sleman Regency Government, Indonesia</strong>.
                </p>
              </div>

              <div className="p-5 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-sm">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">2. 100% Public Access (No Login Wall)</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  All visitors, buyers, and public users can <strong>freely explore and view</strong> all product catalogs, merchant store details, subdistrict culinary directories, and literacy articles <strong>without requiring any login or account registration</strong>.
                </p>
              </div>

              <div className="p-5 bg-blue-50/60 border border-blue-200/80 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3 shadow-sm">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">3. Purpose of Google Sign-In (OAuth 2.0)</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The &quot;Sign in with Google&quot; feature is an optional authentication option provided for buyer convenience to allow 1-click account verification, secure checkout, order tracking, and receipt notifications.
                </p>
              </div>
            </div>

            <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl space-y-4">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-base font-bold text-blue-950 mb-1">
                    Google API Services User Data Policy Compliance Statement
                  </h4>
                  <p className="text-sm text-blue-900 leading-relaxed mb-3">
                    <strong>Sleman Mart&apos;s use and transfer to any other app of information received from Google APIs will adhere to the{" "}
                    <a
                      href="https://developers.google.com/terms/api-services-user-data-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-bold inline-flex items-center gap-1"
                    >
                      Google API Services User Data Policy <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    , including the Limited Use requirements.</strong>
                  </p>
                  <ul className="list-disc list-inside text-xs md:text-sm text-blue-950 space-y-1">
                    <li><strong>Data requested:</strong> Name, Email address, Profile Picture, and Google User ID.</li>
                    <li><strong>Strictly NOT sold or shared:</strong> Google user data is NEVER sold, rented, or transferred to third-party ad networks or data brokers.</li>
                    <li><strong>No AI/ML training:</strong> Google user data is NEVER used to train generalized artificial intelligence or machine learning models.</li>
                    <li><strong>Revocation:</strong> Users can revoke access anytime at <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="underline font-mono">myaccount.google.com/permissions</a>.</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-blue-200 flex flex-wrap gap-4 items-center justify-between text-xs md:text-sm">
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/privacy-policy"
                    className="font-semibold text-blue-700 hover:text-blue-900 underline flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Full Privacy Policy Page
                  </Link>
                  <span className="text-blue-300">|</span>
                  <Link
                    href="/terms-conditions"
                    className="font-semibold text-blue-700 hover:text-blue-900 underline"
                  >
                    Terms &amp; Conditions
                  </Link>
                </div>
                <span className="text-blue-900 font-medium">
                  Support Email: <a href="mailto:dinkop_ukm@slemankab.go.id" className="text-blue-950 underline font-mono">dinkop_ukm@slemankab.go.id</a>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

