import ContactSection from "@/components/landing/Contact";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Navbar } from "@/components/shared/Navbar";
import Image from "next/image";

export default function DetailPelatihan() {
    return (

        <div className="bg-gray-50">
            <Navbar />

            <Breadcrumb breadcrumbs={[
                { name: "Beranda", link: "/" },
                { name: "Pelatihan", link: "/pelatihan" },

                { name: "Detail", active: true }
            ]} />


            <section className="py-8 bg-gray-50">
                <div className="container mx-auto px-4">
                    <article
                        className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden"
                    >
                        {/* <!-- Training Header --> */}
                        <header className="p-8 pb-0">
                            <div className="flex items-center space-x-4 mb-6">
                                <span className="text-gray-500">15-17 September 2025</span>
                            </div>
                            <h1
                                id="trainingTitle"
                                className="text-3xl font-bold text-gray-800 mb-6"
                            >
                                Pelatihan Digital Marketing untuk UMKM
                            </h1>
                            <div
                                className="h-64 bg-gradient-to-br from-blue-500 to-blue-600 relative rounded-lg overflow-hidden mb-6"
                            >
                                <Image
                                    width={400}
                                    height={400}
                                    alt="Training Image"
                                    id="trainingImage"

                                    src="/assets/no-image.jpg"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </header>

                        {/* <!-- Training Description --> */}
                        <div className="px-8">
                            <p
                                id="trainingDescription"
                                className="text-gray-600 text-lg leading-relaxed mb-8"
                            >
                                Pelajari strategi pemasaran digital dari dasar hingga mahir. Mulai
                                dari social media marketing hingga Google Ads untuk meningkatkan
                                visibilitas dan penjualan produk UMKM Anda.
                            </p>

                            {/* <!-- Training Info Grid --> */}
                            <div className="bg-gray-50 rounded-lg p-6 mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                    Informasi Pelatihan
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <i className="fas fa-calendar text-primary mr-3"></i>
                                            <div>
                                                <span className="text-sm text-gray-500">Tanggal</span>
                                                <p id="trainingDate" className="font-semibold">
                                                    15-17 September 2025
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <i className="fas fa-clock text-primary mr-3"></i>
                                            <div>
                                                <span className="text-sm text-gray-500">Waktu</span>
                                                <p id="trainingTime" className="font-semibold">
                                                    09:00 - 16:00 WIB
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <i className="fas fa-map-marker-alt text-primary mr-3"></i>
                                            <div>
                                                <span className="text-sm text-gray-500">Lokasi</span>
                                                <p id="trainingLocation" className="font-semibold">
                                                    Balai Desa Tridadi, Sleman
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <i className="fas fa-certificate text-primary mr-3"></i>
                                            <div>
                                                <span className="text-sm text-gray-500">Sertifikat</span>
                                                <p className="font-semibold">Tersedia</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <i className="fas fa-language text-primary mr-3"></i>
                                            <div>
                                                <span className="text-sm text-gray-500">Bahasa</span>
                                                <p className="font-semibold">Bahasa Indonesia</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <i className="fas fa-users text-primary mr-3"></i>
                                            <div>
                                                <span className="text-sm text-gray-500">Kapasitas</span>
                                                <p className="font-semibold">30 Peserta</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Training Content --> */}
                            <div id="trainingContent" className="mb-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">
                                    Materi Pelatihan
                                </h3>
                                <div className="space-y-4 mb-8">
                                    <div className="border-l-4 border-primary pl-4">
                                        <h4 className="font-semibold text-gray-800">
                                            Hari 1: Pengenalan Digital Marketing
                                        </h4>
                                        <ul className="text-gray-600 mt-2 space-y-1">
                                            <li>• Konsep dasar digital marketing</li>
                                            <li>• Perbedaan digital vs traditional marketing</li>
                                            <li>• Platform digital marketing utama</li>
                                            <li>• Strategi pemilihan platform yang tepat</li>
                                        </ul>
                                    </div>
                                    <div className="border-l-4 border-primary pl-4">
                                        <h4 className="font-semibold text-gray-800">
                                            Hari 2: Social Media Marketing
                                        </h4>
                                        <ul className="text-gray-600 mt-2 space-y-1">
                                            <li>• Setup dan optimasi profil bisnis</li>
                                            <li>• Content planning dan scheduling</li>
                                            <li>• Engagement strategies</li>
                                            <li>• Analisa performa konten</li>
                                        </ul>
                                    </div>
                                    <div className="border-l-4 border-primary pl-4">
                                        <h4 className="font-semibold text-gray-800">
                                            Hari 3: Google Ads & Analytics
                                        </h4>
                                        <ul className="text-gray-600 mt-2 space-y-1">
                                            <li>• Pembuatan campaign Google Ads</li>
                                            <li>• Keyword research dan targeting</li>
                                            <li>• Setup Google Analytics</li>
                                            <li>• Measuring ROI dan conversion</li>
                                        </ul>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-800 mb-4">
                                    Target Peserta
                                </h3>
                                <ul className="text-gray-600 space-y-2 mb-8">
                                    <li>
                                        • Pemilik UMKM yang ingin mengembangkan bisnis secara digital
                                    </li>
                                    <li>
                                        • Pelaku usaha yang belum familiar dengan digital marketing
                                    </li>
                                    <li>• UMKM yang ingin meningkatkan penjualan online</li>
                                    <li>• Entrepreneur yang ingin memulai bisnis digital</li>
                                </ul>

                                <h3 className="text-xl font-bold text-gray-800 mb-4">Fasilitas</h3>
                                <div className="grid md:grid-cols-2 gap-4 mb-8">
                                    <ul className="text-gray-600 space-y-2">
                                        <li>• Modul pembelajaran lengkap</li>
                                        <li>• Sertifikat keikutsertaan</li>
                                        <li>• Konsultasi gratis 1 bulan</li>
                                    </ul>
                                    <ul className="text-gray-600 space-y-2">
                                        <li>• Template dan tools siap pakai</li>
                                        <li>• Makan siang selama pelatihan</li>
                                        <li>• Akses ke komunitas alumni</li>
                                    </ul>
                                </div>
                            </div>

                            {/* <!-- Instructor --> */}
                            {/* <!-- <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Instruktur</h2>
              <div className="flex items-start space-x-4">
                <div
                  className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center"
                >
                  <i className="fas fa-user text-2xl text-gray-600"></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">
                    Dr. Ahmad Santoso
                  </h3>
                  <p className="text-primary font-medium mb-2">
                    Digital Marketing Specialist
                  </p>
                  <p className="text-gray-600 mb-4">
                    Praktisi digital marketing dengan pengalaman 10+ tahun.
                    Telah membantu ratusan UMKM mengembangkan bisnis melalui
                    strategi digital marketing yang efektif.
                  </p>
                  <div
                    className="flex items-center space-x-4 text-sm text-gray-500"
                  >
                    <span
                      ><i className="fas fa-briefcase mr-1"></i>10+ tahun
                      pengalaman</span
                    >
                    <span
                      ><i className="fas fa-users mr-1"></i>500+ UMKM telah
                      terbantu</span
                    >
                    <span><i className="fas fa-star mr-1"></i>4.9/5 rating</span>
                  </div>
                </div>
              </div>
            </div> --> */}


                            {/* <!-- Share Buttons --> */}
                            <div className="border-t pt-6 pb-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">
                                    Bagikan Pelatihan Ini
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                                    >
                                        <i className="fab fa-facebook-f mr-2"></i>Facebook
                                    </button>
                                    {/* <!-- <button
                  className="flex items-center bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-300"
                >
                  <i className="fab fa-twitter mr-2"></i>Twitter
                </button> --> */}
                                    <button
                                        className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                                    >
                                        <i className="fab fa-whatsapp mr-2"></i>WhatsApp
                                    </button>
                                    {/* <!-- <button
                  className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                >
                  <i className="fas fa-envelope mr-2"></i>Email
                </button> --> */}
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </section>



            <AnimatedWrapper>
                <ContactSection />
            </AnimatedWrapper>

        </div>
    )
}