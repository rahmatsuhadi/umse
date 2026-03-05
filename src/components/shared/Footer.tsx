"use client";

import Link from "next/link";
import Image from "next/image";
import { useCategoriesFooter } from "@/features/categories/hooks";
import { useWebSettings } from "@/features/settings/hooks";

import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa6";

export function Footer() {
    const { data: categoriesData } = useCategoriesFooter();
    const categories = categoriesData?.data || [];
    const { data: webSettings } = useWebSettings();
    const settings = webSettings?.data;

    return (
        <footer>
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="logo" style={{ marginBottom: 4 }}>
                            <Image
                                src={settings?.site_identity?.logo_url || "/slemanmartlogo.png"}
                                alt={settings?.site_identity?.app_name || "Sleman Mart"}
                                width={120}
                                height={48}
                                style={{ height: 48, width: "auto", objectFit: "contain" }}
                            />
                        </div>
                        <p>
                            {settings?.site_identity?.app_description ||
                                "Platform showcase produk lokal Kabupaten Sleman. Mendukung UMKM tumbuh dan berkembang bersama komunitas."}
                        </p>
                        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                            {settings?.social_media?.facebook_url && (
                                <a href={settings.social_media.facebook_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
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
                                            fontSize: 18,
                                            color: "white"
                                        }}
                                    >
                                        <FaFacebookF />
                                    </div>
                                </a>
                            )}
                            {settings?.social_media?.instagram_url && (
                                <a href={settings.social_media.instagram_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
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
                                            fontSize: 18,
                                            color: "white"
                                        }}
                                    >
                                        <FaInstagram />
                                    </div>
                                </a>
                            )}
                            {settings?.contact?.whatsapp && (
                                <a href={`https://wa.me/${settings.contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
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
                                            fontSize: 18,
                                            color: "white"
                                        }}
                                    >
                                        <FaWhatsapp />
                                    </div>
                                </a>
                            )}
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
                        {categories.length > 0 ? (
                            categories.map((cat) => (
                                <Link key={cat.slug || cat.id} href={`/produk?category=${cat.slug || cat.id}`}>
                                    {cat.name}
                                </Link>
                            ))
                        ) : (
                            <div style={{ opacity: 0.5 }}>Memuat kategori...</div>
                        )}
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
                    <span>{settings?.footer?.copyright_text || "© 2025 Sleman Mart. Dibuat dengan ❤️ untuk UMKM Sleman."}</span>
                    <span>{settings?.contact?.address || "Kabupaten Sleman, D.I. Yogyakarta"}</span>
                </div>
            </div>
        </footer>
    );
}
