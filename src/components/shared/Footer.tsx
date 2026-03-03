"use client";

import Link from "next/link";
import Image from "next/image";
import { useCategoriesFooter } from "@/features/categories/hooks";

export function Footer() {
    const { data: categoriesData } = useCategoriesFooter();
    const categories = categoriesData?.data || [];

    return (
        <footer>
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="logo" style={{ marginBottom: 4 }}>
                            <Image
                                src="/slemanmartlogo.png"
                                alt="Sleman Mart"
                                width={120}
                                height={48}
                                style={{ height: 48, width: "auto", objectFit: "contain" }}
                            />
                        </div>
                        <p>
                            Platform showcase produk lokal Kabupaten Sleman. Mendukung UMKM
                            tumbuh dan berkembang bersama komunitas.
                        </p>
                        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 8,
                                    background: "rgba(255,255,255,0.08)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    fontSize: 16,
                                }}
                            >
                                📘
                            </div>
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 8,
                                    background: "rgba(255,255,255,0.08)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    fontSize: 16,
                                }}
                            >
                                📸
                            </div>
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 8,
                                    background: "#25D366",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    fontSize: 16,
                                }}
                            >
                                💬
                            </div>
                        </div>
                    </div>
                    <div className="footer-col">
                        <h4>Jelajahi</h4>
                        <Link href="/">Beranda</Link>
                        <Link href="/produk">Semua Produk</Link>
                        <Link href="/toko">Toko Lokal</Link>
                        <Link href="/explore">Explore</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Kategori</h4>
                        {categories.length > 0
                            ? categories.map((cat) => (
                                <Link key={cat.slug} href={`/produk?category=${cat.slug}`}>
                                    {cat.name}
                                </Link>
                            ))
                            : [
                                "Fashion & Wastra",
                                "Kuliner & Makanan",
                                "Kerajinan Tangan",
                                "Peralatan Rumah",
                            ].map((name) => (
                                <Link key={name} href="#">{name}</Link>
                            ))
                        }
                    </div>
                    <div className="footer-col">
                        <h4>Informasi</h4>
                        <Link href="#">Tentang Kami</Link>
                        <Link href="#">Daftarkan Toko</Link>
                        <Link href="#">Kebijakan Privasi</Link>
                        <Link href="/faq">Sering Ditanyakan (FAQ)</Link>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© 2025 Sleman Mart. Dibuat dengan ❤️ untuk UMKM Sleman.</span>
                    <span>Kabupaten Sleman, D.I. Yogyakarta</span>
                </div>
            </div>
        </footer>
    );
}
