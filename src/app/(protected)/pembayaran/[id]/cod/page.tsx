"use client";

import React from "react";
import { notFound, useParams } from "next/navigation";
import { useGetOrderPayments } from "@/features/order/hooks";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import PaymentCodStep from "@/components/payments/PaymentCodStep";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function PaymentCodPage() {
    const { id } = useParams<{ id: string }>();

    const { data, isLoading } = useGetOrderPayments(id);

    const order = data?.data;

    const renderContent = () => {
        if (isLoading && !order) {
            return <LoadingSpinner text="Sedang memuat detail pesanan COD..." />;
        }
        if (!order && !isLoading) {
            return notFound();
        }
        if (order && !isLoading) {
            return (
                <PaymentCodStep order={order} currentStep="payment" />
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
                    <h1 className="cart-header-title">Pembayaran Pesanan (COD)</h1>
                    <p className="cart-header-subtitle">
                        Pesanan Anda menggunakan metode Cash on Delivery (Bayar di Tempat). Siapkan uang tunai saat pesanan tiba di alamat Anda.
                    </p>
                </div>

                {renderContent()}
            </main>

            <Footer />
        </div>
    );
}

