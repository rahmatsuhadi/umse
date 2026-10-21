"use client";

import React from "react";
import { notFound, useParams } from "next/navigation";
import { useGetOrderPayments } from "@/features/order/hooks";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import PaymentStep from "@/components/payments/PaymentPageStep";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function PaymentPage() {
    const { id } = useParams<{ id: string }>();

    const { data, isLoading } = useGetOrderPayments(id);

    const order = data?.data;

    const renderContent = () => {
        if (isLoading && !order) {
            return <LoadingSpinner text="Sedang memuat detail pesanan..." />;
        }
        if (!order && !isLoading) {
            return notFound();
        }
        if (order && !isLoading) {
            return (
                <PaymentStep order={order} currentStep="payment" />
            );
        }
        return null;
    };

    return (
        <div className="cart-page-wrapper">
            <Navbar />

            <main className="cart-main-container">
                {/* Page Header */}
                <div style={{ marginBottom: 32 }}>
                    <h1 className="cart-header-title">Pembayaran Pesanan</h1>
                    <p className="cart-header-subtitle">
                        Selesaikan pembayaran Anda dengan memindai kode QRIS di bawah ini sebelum batas waktu yang ditentukan.
                    </p>
                </div>

                {renderContent()}
            </main>

            <Footer />
        </div>
    );
}