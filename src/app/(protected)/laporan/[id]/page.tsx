'use client';

// import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
// import Head from 'next/head';
import { Navbar } from '@/components/shared/Navbar';
import { AnimatedWrapper } from '@/components/shared/AnimateWrapper';
import Footer from '@/components/layout/Footer';

const DetailReportIssuePage = () => {
    // const [issueCategory, setIssueCategory] = useState('');
    // const [titleCount, setTitleCount] = useState(0);
    // const [descCount, setDescCount] = useState(0);
    // const [showSuccessModal, setShowSuccessModal] = useState(false);

    // const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    //     setTitleCount(e.target.value.length);
    // };

    // const handleDescChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    //     setDescCount(e.target.value.length);
    // };

    // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     setShowSuccessModal(true);
    // };

    return (
        <>
            <div className="bg-gray-50">
                <Navbar withMenu={false} />

                <div className="container mx-auto px-4 py-4 sm:py-8 md:px-10">
                    {/* <!-- Breadcrumb --> */}
                    <nav className="flex mb-6 " aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                                <a
                                    href="products.html"
                                    className="text-gray-700 hover:text-primary flex items-center"
                                >
                                    <i className="fas fa-home mr-2"></i>
                                    Beranda
                                </a>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <i className="fas fa-chevron-right text-gray-400 mx-2"></i>
                                    <span className="text-primary font-medium">Laporkan Masalah</span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    {/* <!-- Back Button --> */}
                    <div className="mb-6">
                        <Link

                            href="/laporan"
                            className="inline-flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300"
                        >
                            <i className="fas fa-arrow-left mr-2"></i>
                            Kembali ke Daftar Laporan
                        </Link>
                    </div>


                    {/* <!-- Report Header --> */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div
                            className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
                        >
                            <div>
                                <div className="flex items-center space-x-3 mb-2">
                                    <span className="text-lg font-mono text-gray-600">#RPT-2024-001234</span>
                                    <span
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
                                    >
                                        Sedang Diproses
                                    </span>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                    Produk tidak sesuai dengan deskripsi
                                </h1>
                                <p className="text-gray-600">
                                    Kategori: Masalah Produk • Dibuat: 15 Agu 2024, 14:30
                                </p>
                            </div>
                        </div>
                    </div>

                    {/*  */}


                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* <!-- Main Content --> */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* <!-- Report Description --> */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    Deskripsi Masalah
                                </h2>
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 leading-relaxed">
                                        Saya memesan produk smartphone dengan spesifikasi 8GB RAM, namun
                                        yang diterima hanya 4GB RAM. Selain itu, warna produk juga
                                        berbeda dari yang saya pilih saat pemesanan. Produk yang saya
                                        pesan berwarna hitam, tetapi yang diterima berwarna putih. Hal
                                        ini sangat mengecewakan karena spesifikasi dan warna adalah
                                        faktor penting dalam keputusan pembelian saya.
                                    </p>
                                </div>

                                {/* <!-- Attachments --> */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Lampiran</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div
                                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <i className="fas fa-image text-blue-600 text-xl"></i>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-800 truncate">
                                                    foto_produk_diterima.jpg
                                                </div>
                                                <div className="text-xs text-gray-500">2.3 MB</div>
                                            </div>
                                            <Link href="#" className="text-primary hover:text-primary-dark">
                                                <i className="fas fa-download"></i>
                                            </Link>
                                        </div>
                                        <div
                                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <i className="fas fa-file-pdf text-red-600 text-xl"></i>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-800 truncate">
                                                    bukti_pemesanan.pdf
                                                </div>
                                                <div className="text-xs text-gray-500">1.8 MB</div>
                                            </div>
                                            <Link href="#" className="text-primary hover:text-primary-dark">
                                                <i className="fas fa-download"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Conversation Thread --> */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">Percakapan</h2>

                                <div className="space-y-6">
                                    {/* <!-- Customer Message --> */}
                                    <div className="flex space-x-4">
                                        <div className="flex-shrink-0">
                                            <div
                                                className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                                            >
                                                <i className="fas fa-user text-blue-600"></i>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="font-medium text-gray-800"
                                                >John Doe (Anda)</span>
                                                <span className="text-sm text-gray-500"
                                                >15 Agu 2024, 14:30</span>
                                            </div>
                                            <div className="bg-blue-50 rounded-lg p-4">
                                                <p className="text-gray-700">
                                                    Laporan masalah telah dibuat. Mohon bantuannya untuk
                                                    menyelesaikan masalah ini.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <!-- Admin Reply 1 --> */}
                                    <div className="flex space-x-4">
                                        <div className="flex-shrink-0">
                                            <div
                                                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center"
                                            >
                                                <i className="fas fa-headset text-white"></i>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="font-medium text-gray-800"
                                                >Ahmad (Tim Support)</span >
                                                <span className="text-sm text-gray-500"
                                                >15 Agu 2024, 15:45</span>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-gray-700">
                                                    Halo John, terima kasih atas laporannya. Kami akan segera
                                                    menindaklanjuti masalah ini. Tim kami sedang mengecek stok
                                                    produk yang sesuai dengan pesanan Anda. Mohon menunggu
                                                    update selanjutnya dalam 1x24 jam.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <!-- Admin Reply 2 --> */}
                                    <div className="flex space-x-4">
                                        <div className="flex-shrink-0">
                                            <div
                                                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center"
                                            >
                                                <i className="fas fa-headset text-white"></i>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="font-medium text-gray-800"
                                                >Ahmad (Tim Support)</span>
                                                <span className="text-sm text-gray-500"
                                                >16 Agu 2024, 09:15</span>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-gray-700 mb-3">
                                                    Update: Kami sudah mengkonfirmasi ketersediaan produk yang
                                                    sesuai dengan pesanan Anda (Smartphone 8GB RAM warna
                                                    hitam). Kami akan mengirimkan produk pengganti dalam 2-3
                                                    hari kerja.
                                                </p>
                                                <p className="text-gray-700">
                                                    Untuk produk yang salah kirim, silakan simpan terlebih
                                                    dahulu. Tim kurir kami akan mengambilnya bersamaan dengan
                                                    pengiriman produk yang benar. Mohon maaf atas
                                                    ketidaknyamanan ini.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <!-- Customer Reply --> */}
                                    <div className="flex space-x-4">
                                        <div className="flex-shrink-0">
                                            <div
                                                className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                                            >
                                                <i className="fas fa-user text-blue-600"></i>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="font-medium text-gray-800"
                                                >John Doe (Anda)</span>
                                                <span className="text-sm text-gray-500"
                                                >16 Agu 2024, 10:30</span>
                                            </div>
                                            <div className="bg-blue-50 rounded-lg p-4">
                                                <p className="text-gray-700">
                                                    Terima kasih atas update-nya. Saya akan menunggu produk
                                                    pengganti. Apakah ada nomor resi untuk tracking pengiriman
                                                    produk yang benar?
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- Reply Form --> */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        Balas Pesan
                                    </h3>
                                    <form className="space-y-4">
                                        <textarea
                                            rows={4}
                                            placeholder="Tulis balasan Anda..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                                        ></textarea>
                                        <div className="flex items-center space-x-4">
                                            <button
                                                type="submit"
                                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition duration-300"
                                            >
                                                <i className="fas fa-paper-plane mr-2"></i>
                                                Kirim Balasan
                                            </button>
                                            <label className="flex items-center text-gray-700 cursor-pointer">
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*,.pdf,.doc,.docx"
                                                    className="hidden"
                                                />
                                                <i className="fas fa-paperclip mr-2 text-gray-500"></i>
                                                Lampirkan File
                                            </label>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Sidebar --> */}
                        <div className="space-y-6">
                            {/* <!-- Report Info --> */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Informasi Laporan
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Nomor Tiket:</span>
                                        <span className="font-medium">#RPT-2024-001234</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Status:</span>
                                        <span
                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                                        >
                                            Sedang Diproses
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Kategori:</span>
                                        <span className="font-medium">Masalah Produk</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Dibuat:</span>
                                        <span className="font-medium">15 Agu 2024, 14:30</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Update Terakhir:</span>
                                        <span className="font-medium">16 Agu 2024, 10:30</span>
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Contact Support --> */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Kontak Support
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <i className="fas fa-phone text-green-600"></i>
                                        <div>
                                            <div className="font-medium text-gray-800">Customer Service</div>
                                            <div className="text-sm text-gray-600">+62 274 123-4567</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <i className="fab fa-whatsapp text-green-600"></i>
                                        <div>
                                            <div className="font-medium text-gray-800">WhatsApp</div>
                                            <div className="text-sm text-gray-600">+62 812-3456-7890</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <i className="fas fa-envelope text-blue-600"></i>
                                        <div>
                                            <div className="font-medium text-gray-800">Email</div>
                                            <div className="text-sm text-gray-600">
                                                support@slemanmart.com
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>






            </div>


            <AnimatedWrapper>
                <Footer />
            </AnimatedWrapper>

        </>
    );
};

export default DetailReportIssuePage;

