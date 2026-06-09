
import React from "react";
import { CheckoutStep } from "@/components/checkouts/lib";
import CheckoutItem from "@/components/checkouts/CheckoutItemPageStep";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function CheckoutPage() {
    const step: CheckoutStep = "checkout";

    return (
        <div className="cart-page-wrapper">
            <Navbar />

            <main className="cart-main-container">
                {/* Page Header */}
                <div style={{ marginBottom: 32 }}>
                    <h1 className="cart-header-title">
                        Checkout Pesanan
                    </h1>
                    <p className="cart-header-subtitle">
                        Selesaikan transaksi Anda dengan melengkapi detail alamat pengiriman dan informasi pesanan di bawah ini.
                    </p>
                </div>

                <CheckoutItem currentStep={step} />
            </main>

            <Footer />
        </div>
    );
}