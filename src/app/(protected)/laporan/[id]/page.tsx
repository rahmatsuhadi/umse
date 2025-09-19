'use client';

// import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
// import Head from 'next/head';
import { Navbar } from '@/components/shared/Navbar';
import { AnimatedWrapper } from '@/components/shared/AnimateWrapper';
import Footer from '@/components/layout/Footer';
import { useReport } from '@/features/reports/hook';
import { notFound, useParams } from 'next/navigation';
import Breadcrumb from '@/components/shared/Breadcrumb';
import ReportHeaderStatus, { ReportHeaderStatusSkeleton } from '@/components/reports/ReportHeaderStatus';
import ReportCardDescription, { ReportCardDescriptionSkeleton } from '@/components/reports/ReportCardDescription';
import ReportConversation, { ReportConversationSkeleton } from '@/components/reports/ReportConverstion';
import ReportSidebar, { ReportSidebarSkeleton } from '@/components/reports/ReportSidebar';

const DetailReportIssuePage = () => {
    const params = useParams<{ id: string }>()

    const id = params.id

    const { data, isLoading } = useReport(id)

    const report = data?.data || null;


    const render = () => {
        if (isLoading) {
            return (
                <>
                    <ReportHeaderStatusSkeleton />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* <!-- Main Content --> */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* <!-- Report Description --> */}
                            <ReportCardDescriptionSkeleton />

                            <ReportConversationSkeleton />
                        </div>
                        <ReportSidebarSkeleton />

                    </div>
                </>
            )
        }
        else if (report) {
            return (
                <>
                    <ReportHeaderStatus
                        status={report.status}
                        ticket_number={report.ticket_number}
                        title={report.title}
                        created_at={report.created_at}
                        category={report.category}

                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* <!-- Main Content --> */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* <!-- Report Description --> */}
                            <ReportCardDescription report={report} />

                            <ReportConversation status={report.status} reportId={report.id} />
                        </div>
                        <ReportSidebar report={report} />

                    </div>
                </>
            )
        }
        else {
            return notFound()
        }
    }


    return (
        <>
            <div className="bg-gray-50">
                <Navbar withMenu={false} />

                <div className="container mx-auto px-4 py-4 sm:py-8 md:px-10">
                    <Breadcrumb breadcrumbs={[
                        { name: "Beranda", link: "/" },
                        { name: "Laporan Masalah", active: true }
                    ]} />

                    <div className="mb-6">
                        <Link
                            href="/laporan"
                            className="inline-flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300"
                        >
                            <i className="fas fa-arrow-left mr-2"></i>
                            Kembali ke Daftar Laporan
                        </Link>
                    </div>


                    {render()}

                </div>
            </div>


            <AnimatedWrapper>
                <Footer />
            </AnimatedWrapper>

        </>
    );
};

export default DetailReportIssuePage;