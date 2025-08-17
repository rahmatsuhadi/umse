'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Navbar } from '@/components/shared/Navbar';
import { AnimatedWrapper } from '@/components/shared/AnimateWrapper';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/shared/Breadcrumb';

const FormReportIssuePage = () => {
    const [issueCategory, setIssueCategory] = useState('');
    const [titleCount, setTitleCount] = useState(0);
    const [descCount, setDescCount] = useState(0);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitleCount(e.target.value.length);
    };

    const handleDescChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setDescCount(e.target.value.length);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setShowSuccessModal(true);
    };

    return (
        <>
            <div className="bg-gray-50">
                <Navbar withMenu={false} isAuth={true} />

                <div className="container mx-auto px-4 py-4 sm:py-8 md:px-10">

                    {/* <!-- Breadcrumb --> */}
                    <Breadcrumb currentPage='Laporan Masalah' />
                    
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


                    {/* <!-- Page Header --> */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div
                                className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"
                            >
                                <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Laporkan Masalah</h1>
                                <p className="text-gray-600">
                                    Laporkan masalah yang Anda alami agar kami dapat membantu
                                    menyelesaikannya
                                </p>
                            </div>
                        </div>
                    </div>

                    {/*  */}


                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* <!-- Report Form --> */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                                    Form Laporan Masalah
                                </h2>

                                <form id="reportForm" className="space-y-6">
                                    {/* <!-- Issue Category --> */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Kategori Masalah <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="issueCategory"
                                            name="issueCategory"
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        >
                                            <option value="">Pilih kategori masalah</option>
                                            <option value="order">Masalah Pesanan</option>
                                            <option value="payment">Masalah Pembayaran</option>
                                            <option value="product">Masalah Produk</option>
                                            <option value="delivery">Masalah Pengiriman</option>
                                            <option value="account">Masalah Akun</option>
                                            <option value="website">Masalah Website/Aplikasi</option>
                                            <option value="other">Lainnya</option>
                                        </select>
                                    </div>

                                    {/* <!-- Order Number (if applicable) --> */}
                                    <div id="orderNumberField" className="hidden">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nomor Pesanan (jika terkait pesanan)
                                        </label>
                                        <input
                                            type="text"
                                            id="orderNumber"
                                            name="orderNumber"
                                            placeholder="Contoh: ORD-2024-001234"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>

                                    {/* <!-- Issue Title --> */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Judul Masalah <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="issueTitle"
                                            name="issueTitle"
                                            required
                                            // maxlength="100"
                                            placeholder="Jelaskan masalah dalam satu kalimat singkat"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                        <div className="text-right text-sm text-gray-500 mt-1">
                                            <span id="titleCount">0</span>/100 karakter
                                        </div>
                                    </div>

                                    {/* <!-- Issue Description --> */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Deskripsi Masalah <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="issueDescription"
                                            name="issueDescription"
                                            required
                                            rows={6}
                                            maxLength={1000}
                                            placeholder="Jelaskan masalah secara detail, termasuk langkah-langkah yang menyebabkan masalah, kapan masalah terjadi, dan dampaknya"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                                        ></textarea>
                                        <div className="text-right text-sm text-gray-500 mt-1">
                                            <span id="descCount">0</span>/1000 karakter
                                        </div>
                                    </div>

                                    {/* <!-- File Upload --> */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Lampiran (opsional)
                                        </label>
                                        <div
                                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition duration-200"
                                        >
                                            <input
                                                type="file"
                                                id="attachments"
                                                name="attachments"
                                                multiple
                                                accept="image/*,.pdf,.doc,.docx"
                                                className="hidden"
                                            />
                                            <label htmlFor="attachments" className="cursor-pointer">
                                                <i
                                                    className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"
                                                ></i>
                                                <p className="text-gray-600">
                                                    Klik untuk upload file atau drag & drop
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Format yang didukung: JPG, PNG, PDF, DOC, DOCX (Maks. 5MB
                                                    per file)
                                                </p>
                                            </label>
                                        </div>
                                        <div id="fileList" className="mt-3 space-y-2"></div>
                                    </div>

                                    {/* <!-- Submit Button --> */}
                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-300"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition duration-300 font-semibold"
                                        >
                                            <i className="fas fa-paper-plane mr-2"></i>
                                            Kirim Laporan
                                        </button>
                                    </div>
                                </form>
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

export default FormReportIssuePage;

