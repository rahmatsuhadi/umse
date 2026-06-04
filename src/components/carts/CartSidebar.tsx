"use client";

import { HelpCircle, ShieldCheck, Truck } from "lucide-react";

export default function CartSidebar() {
    return (
        <div className="space-y-6">

            {/* ── Informasi Belanja ── */}
            <div className="cart-sidebar-panel">
                {/* Header */}
                <div className="cart-sidebar-header">
                    <HelpCircle size={16} style={{ color: "var(--terracotta)" }} />
                    <h3 className="cart-sidebar-title">
                        Informasi Belanja
                    </h3>
                </div>

                {/* Body */}
                <ul className="cart-sidebar-content-list">
                    {[
                        "Checkout diproses per toko karena pengiriman dikirim mandiri oleh masing-masing UMKM Sleman.",
                        "Pilih kurir pengiriman tepercaya dan gunakan kupon saat melakukan checkout.",
                    ].map((text, i) => (
                        <li key={i} className="cart-sidebar-list-item">
                            <span className="cart-sidebar-bullet">•</span>
                            <span className="cart-sidebar-text">{text}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* ── Jaminan Sleman Mart ── */}
            <div className="cart-sidebar-panel">
                {/* Header */}
                <div className="cart-sidebar-header">
                    <ShieldCheck size={16} style={{ color: "var(--terracotta)" }} />
                    <h3 className="cart-sidebar-title">
                        Jaminan Sleman Mart
                    </h3>
                </div>

                {/* Body */}
                <div className="cart-sidebar-content-list">
                    {[
                        {
                            icon: <ShieldCheck size={16} />,
                            bg: "#E8F8F5",
                            color: "#117A65",
                            title: "100% Produk UMKM Sleman",
                            desc: "Semua produk bersertifikat lokal Sleman & berkualitas prima.",
                        },
                        {
                            icon: <Truck size={16} />,
                            bg: "#FEF9E7",
                            color: "#D35400",
                            title: "Pengiriman Cepat & Aman",
                            desc: "Integrasi kurir ekspedisi lokal untuk kemudahan pengiriman Anda.",
                        },
                    ].map((item, i) => (
                        <div key={i} className="cart-guarantee-row">
                            <div className="cart-guarantee-icon-box" style={{ background: item.bg, color: item.color }}>
                                {item.icon}
                            </div>
                            <div>
                                <h4 className="cart-guarantee-item-title">
                                    {item.title}
                                </h4>
                                <p className="cart-guarantee-item-desc">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
