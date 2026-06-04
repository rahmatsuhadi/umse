"use client";

import { Footer } from "@/components/shared/Footer";
import OrderFilter from "@/components/orders/OrderFilter";
import OrderList from "@/components/orders/OrderList";
import { Navbar } from "@/components/shared/Navbar";

export default function OrderPage() {
    return (
        <div className="cart-page-wrapper">
            <Navbar />

            <main className="cart-main-container">
                {/* <!-- Page Header --> */}
                <div style={{ marginBottom: 32 }}>
                    <h1 className="cart-header-title">
                        Pesanan Saya
                    </h1>
                    <p className="cart-header-subtitle">
                        Kelola, bayar, dan pantau seluruh status pesanan belanja Anda di Sleman Mart.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
                    {/* <!-- Order Filters --> */}
                    <OrderFilter />

                    {/* <!-- Orders List --> */}
                    <OrderList />
                </div>
            </main>

            <Footer />
        </div>
    )
}