
import React from "react";
import { StepIndicator } from "@/components/orders/step/StepIndicator";
import { CheckoutStep, steps } from "@/components/checkouts/lib";
import CheckoutHeader from "@/components/checkouts/CheckoutHeader";
import CheckoutItem from "@/components/checkouts/CheckoutItemPageStep";

export default function CheckoutPage() {

    const step: CheckoutStep = "checkout"

    const currentStepIndex = steps.findIndex(s => s.key === step);

    return (
        <div className="min-h-[100vh] font-jakarta" style={{ background: "var(--cream, #FFF9F4)" }}>
            {/* header */}
           
            <CheckoutHeader currentStep={step} index={currentStepIndex} />

            {/* main content */}

            <div className="container mx-auto px-4 py-8" style={{ maxWidth: 1200 }}>
                <div className="max-w-6xl mx-auto">
                    {/* Page Header */}
                    <div style={{ marginBottom: 32 }}>
                        <h1
                            style={{
                                fontSize: "1.75rem",
                                fontWeight: 800,
                                color: "var(--text-primary, #1A1008)",
                                marginBottom: 8,
                            }}
                        >
                            Checkout Pesanan
                        </h1>
                        <p style={{ fontSize: "0.875rem", color: "var(--text-muted, #6B4C2A)" }}>
                            Selesaikan transaksi Anda dengan melengkapi detail alamat pengiriman dan informasi pesanan di bawah ini.
                        </p>
                    </div>

                    <StepIndicator currentStep={step} />

                    <CheckoutItem currentStep={step} />
                </div>
            </div>
        </div>
    )
}