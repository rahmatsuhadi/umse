'use client';

// import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
// import Head from 'next/head';
import { Navbar } from '@/components/shared/Navbar';
import { AnimatedWrapper } from '@/components/shared/AnimateWrapper';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/shared/Breadcrumb';
import ReportForm from '@/components/reports/ReportForm';

const FormReportIssuePage = () => {

    return (
        <>
            <div className="bg-gray-50">
                <Navbar withMenu={false} />

                <div className="container mx-auto px-4 py-4 sm:py-8 md:px-10">

                    {/* <!-- Breadcrumb --> */}

                    <Breadcrumb breadcrumbs={[
                        { name: "Beranda", link: "/" },
                        { name: "Laporan Masalah", active: true }
                    ]} />


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


                    <ReportForm />
                </div>






            </div>


            <AnimatedWrapper>
                <Footer />
            </AnimatedWrapper>

        </>
    );
};

export default FormReportIssuePage;

