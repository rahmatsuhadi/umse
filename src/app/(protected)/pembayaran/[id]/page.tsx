"use client"

import React, { useState } from "react";
import { notFound, useParams } from "next/navigation";
import { useGetOrderPayments } from "@/features/order/hooks";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { CheckoutStep } from "@/components/checkouts/lib";
import PaymentStep from "@/components/payments/PaymentPageStep";
import ConfirmationPage from "@/components/payments/PaymentConfirmationStep";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function PaymentPage() {
    const { id } = useParams<{ id: string }>()

    const [step, setStep] = useState<CheckoutStep>("payment")

    const { data, isLoading } = useGetOrderPayments(id)

    const order = data?.data

    const renderContent = () => {
        if (isLoading && !!!order) {
            return <LoadingSpinner text="Sedang memuat detail pesanan..." />
        }
        else if (!order && !isLoading) {
            return notFound()
        }
        else if (order && !isLoading) {
            if (step == "payment") {
                return (
                    <PaymentStep order={order} currentStep={step} onConfirmation={() => setStep("confirmation")} />
                )
            }
            else {
                return (
                    <ConfirmationPage order={order} id={id} currentStep={step} backToPayment={() => setStep("payment")} />
                )
            }
        }
    }

    return (
        <div className="cart-page-wrapper">
            <Navbar />

            <main className="cart-main-container">
                {/* Page Header */}
                <div style={{ marginBottom: 32 }}>
                    <h1 className="cart-header-title">
                        {step === "payment" ? "Pembayaran Pesanan" : "Konfirmasi Pembayaran"}
                    </h1>
                    <p className="cart-header-subtitle">
                        {step === "payment"
                            ? "Selesaikan pembayaran Anda dengan memindai kode QRIS di bawah ini sebelum batas waktu yang ditentukan."
                            : "Unggah bukti transfer pembayaran Anda agar pesanan dapat segera diproses oleh merchant."
                        }
                    </p>
                </div>

                {renderContent()}
            </main>

            <Footer />
        </div>
    )
}