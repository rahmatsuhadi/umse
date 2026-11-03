"use client";

import React, { useEffect } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useGetOrderPayments } from "@/features/order/hooks";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import PaymentJasaStep from "@/components/payments/PaymentJasaStep";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function PaymentJasaPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const { data, isLoading } = useGetOrderPayments(id);

    const order = data?.data;

    // Validasi tipe pesanan:
    // Jika pesanan adalah COD, otomatis arahkan ke halaman pembayaran COD
    // Jika pesanan ternyata BUKAN pesanan jasa, otomatis arahkan ke halaman pembayaran reguler
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

            if (!isService) {
                router.replace(`/pembayaran/${order.id}`);
            }
        }
    }, [order, router]);

    const renderContent = () => {
        if (isLoading && !order) {
            return <LoadingSpinner text="Sedang memuat detail pembayaran layanan jasa..." />;
        }
        if (!order && !isLoading) {
            return notFound();
        }
        if (order && !isLoading) {
            return (
                <PaymentJasaStep order={order} currentStep="payment" />
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
                    <div className="flex items-center gap-2 mb-2">
                        <span className="tipe-jasa-sm inline-flex items-center gap-1">
                            🛠️ Transaksi Produk Jasa
                        </span>
                    </div>
                    <h1 className="cart-header-title">Pembayaran Layanan Jasa</h1>
                    <p className="cart-header-subtitle">
                        Lengkapi detail request dan batas waktu pengerjaan jasa. Pembayaran QRIS Bank BPD DIY akan otomatis dibuka setelah penyedia jasa mengonfirmasi pesanan Anda.
                    </p>
                </div>

                {renderContent()}
            </main>

            <Footer />
        </div>
    );
}

