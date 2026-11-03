"use client";

import React, { useEffect } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useGetOrderPayments } from "@/features/order/hooks";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import PaymentStep from "@/components/payments/PaymentPageStep";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function PaymentPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const { data, isLoading } = useGetOrderPayments(id);

    const order = data?.data;

    // Jika pesanan adalah COD, otomatis arahkan ke halaman pembayaran COD
    // Jika pesanan adalah transaksi item produk jasa, otomatis arahkan ke halaman pembayaran Jasa
    useEffect(() => {
        if (order) {
            const isCod =
                order.payment_method?.toLowerCase() === "cash_on_delivery" ||
                order.payment_method?.toLowerCase() === "cod" ||
                order.shipping_service?.toLowerCase() === "cod" ||
                order.shipping_service_type?.toLowerCase() === "cod";

            if (isCod) {
                router.replace(`/pembayaran/${order.id}/cod`);
                return;
            }

            const isService =
                (order.items && order.items.length > 0 && order.items.every((item) => {
                    const type = item.product?.type?.toLowerCase();
                    return type === "service" || type === "jasa";
                })) ||
                (order.requires_shipping_payment === false &&
                 (!order.shipping_service || order.shipping_service.toLowerCase() === "none" || order.shipping_service.toLowerCase() === "pickup") &&
                 Number(order.shipping_cost?.value ?? 0) === 0);

            if (isService) {
                router.replace(`/pembayaran/${order.id}/jasa`);
                return;
            }
        }
    }, [order, router]);

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