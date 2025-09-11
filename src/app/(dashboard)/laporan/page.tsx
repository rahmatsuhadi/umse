'use client';

import { Navbar } from '@/components/shared/Navbar';
import { AnimatedWrapper } from '@/components/shared/AnimateWrapper';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/shared/Breadcrumb';
import ReportPageHeader from '@/components/reports/ReportPageHeader';
import ReportList from '@/components/reports/ReportList';
import ReportFilters from '@/components/reports/ReportFilters';

export default function ReportPage() {
    return (
        <>
            <div className="bg-gray-50 min-h-screen">
                <Navbar withMenu={false} />

                <div className="container mx-auto px-4 py-4 sm:py-8 md:px-10">
                    <Breadcrumb breadcrumbs={[
                        { name: "Beranda", link: "/" },
                        { name: "Laporan", active: true }
                    ]} />

                    {/* Komponen-komponen yang sudah dipisah */}
                    <ReportPageHeader />
                    <ReportFilters />
                    <ReportList />
                </div>
            </div>

            <AnimatedWrapper>
                <Footer />
            </AnimatedWrapper>
        </>
    );
};
