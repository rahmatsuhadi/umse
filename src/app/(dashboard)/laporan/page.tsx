'use client';

// import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { AnimatedWrapper } from '@/components/shared/AnimateWrapper';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/shared/Breadcrumb';

const ReportPage = () => {
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
                    <Breadcrumb currentPage='Status Laporan' active/>
                    


                    {/* <!-- Page Header --> */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
                        >
                            <div className="flex items-center space-x-4">
                                <div
                                    className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
                                >
                                    <i className="fas fa-clipboard-list text-blue-600 text-xl"></i>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">
                                        Status Laporan Masalah
                                    </h1>
                                    <p className="text-gray-600">
                                        Pantau progress penyelesaian laporan masalah Anda
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/laporan/report-issue"
                                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition duration-300"
                            >
                                <i className="fas fa-plus mr-2"></i>
                                Laporkan Masalah Baru
                            </Link>
                        </div>
                    </div>


                    {/* <!-- Filters --> */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2"
                                >Status</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="open">Terbuka</option>
                                    <option value="in-progress">Sedang Diproses</option>
                                    <option value="waiting">Menunggu Respon</option>
                                    <option value="resolved">Selesai</option>
                                    <option value="closed">Ditutup</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2"
                                >Kategori</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Semua Kategori</option>
                                    <option value="order">Masalah Pesanan</option>
                                    <option value="payment">Masalah Pembayaran</option>
                                    <option value="product">Masalah Produk</option>
                                    <option value="delivery">Masalah Pengiriman</option>
                                    <option value="account">Masalah Akun</option>
                                    <option value="website">Masalah Website/Aplikasi</option>
                                    <option value="other">Lainnya</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2"
                                >Pencarian</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Cari nomor tiket atau judul..."
                                        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* <!-- Reports List --> */}
                    <div className="space-y-4">
                        {/* <!-- Report Item 1 --> */}
                        <div
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
                        >
                            <div
                                className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
                            >
                                <div className="flex-1">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div
                                                className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"
                                            >
                                                <i className="fas fa-exclamation-triangle text-red-600"></i>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className="text-sm font-mono text-gray-500"
                                                >#RPT-2024-001234</span
                                                >
                                                <span
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                                                >
                                                    Sedang Diproses
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                Produk tidak sesuai dengan deskripsi
                                            </h3>
                                            <p className="text-gray-600 mb-2">Kategori: Masalah Produk</p>
                                            <div
                                                className="flex items-center space-x-4 text-sm text-gray-500"
                                            >
                                                <span><i className="fas fa-calendar mr-1"></i>15 Agu 2024</span>
                                                <span
                                                ><i className="fas fa-clock mr-1"></i>Update terakhir: 16 Agu
                                                    2024</span
                                                >
                                                <span
                                                ><i className="fas fa-user mr-1"></i>Ditangani oleh: Tim
                                                    Support</span
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Link
                                        href="/laporan/21sadsadsa21?ticket=RPT-2024-001234"
                                        className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition duration-300"
                                    >
                                        Lihat Detail
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Report Item 2 --> */}
                        <div
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
                        >
                            <div
                                className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
                            >
                                <div className="flex-1">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div
                                                className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
                                            >
                                                <i className="fas fa-check text-green-600"></i>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className="text-sm font-mono text-gray-500"
                                                >#RPT-2024-001233</span
                                                >
                                                <span
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                                >
                                                    Selesai
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                Pembayaran tidak terdeteksi
                                            </h3>
                                            <p className="text-gray-600 mb-2">Kategori: Masalah Pembayaran</p>
                                            <div
                                                className="flex items-center space-x-4 text-sm text-gray-500"
                                            >
                                                <span><i className="fas fa-calendar mr-1"></i>14 Agu 2024</span>
                                                <span
                                                ><i className="fas fa-clock mr-1"></i>Diselesaikan: 15 Agu
                                                    2024</span
                                                >
                                                <span
                                                ><i className="fas fa-user mr-1"></i>Diselesaikan oleh: Tim
                                                    Finance</span
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                     <Link
                                        href="/laporan/21sadsadsa21?ticket=RPT-2024-001234"
                                        className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition duration-300"
                                    >
                                        Lihat Detail
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Report Item 3 --> */}
                        <div
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
                        >
                            <div
                                className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
                            >
                                <div className="flex-1">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div
                                                className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
                                            >
                                                <i className="fas fa-clock text-blue-600"></i>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className="text-sm font-mono text-gray-500"
                                                >#RPT-2024-001232</span
                                                >
                                                <span
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                >
                                                    Menunggu Respon
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                Website tidak bisa diakses
                                            </h3>
                                            <p className="text-gray-600 mb-2">
                                                Kategori: Masalah Website/Aplikasi
                                            </p>
                                            <div
                                                className="flex items-center space-x-4 text-sm text-gray-500"
                                            >
                                                <span><i className="fas fa-calendar mr-1"></i>13 Agu 2024</span>
                                                <span
                                                ><i className="fas fa-clock mr-1"></i>Update terakhir: 14 Agu
                                                    2024</span
                                                >
                                                <span
                                                ><i className="fas fa-user mr-1"></i>Ditangani oleh: Tim
                                                    Technical</span
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                     <Link
                                        href="/laporan/21sadsadsa21?ticket=RPT-2024-001234"
                                        className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition duration-300"
                                    >
                                        Lihat Detail
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Pagination --> */}
                    <div className="mt-8 flex justify-center">
                        <nav className="flex items-center space-x-2">
                            <button
                                className="px-3 py-2 text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <button
                                className="px-3 py-2 text-white bg-primary border border-primary rounded-md"
                            >
                                1
                            </button>
                            <button
                                className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                2
                            </button>
                            <button
                                className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                3
                            </button>
                            <button
                                className="px-3 py-2 text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </nav>
                    </div>

                    {/*  */}
                </div>






            </div>


            <AnimatedWrapper>
                <Footer />
            </AnimatedWrapper>

        </>
    );
};

export default ReportPage;

