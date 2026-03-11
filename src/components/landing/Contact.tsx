"use client";

import Link from "next/link";
import Image from "next/image";
import { useWebSettings } from "@/features/settings/hooks";

const FOOTER_LINKS = {
  Jelajahi: [
    { label: "Beranda", href: "/" },
    { label: "Semua Produk", href: "/produk" },
    { label: "Toko Lokal", href: "/umkm" },
    { label: "Explore", href: "/explore" },
  ],
  Kategori: [
    { label: "Fashion & Wastra", href: "/produk?q=batik" },
    { label: "Kuliner & Makanan", href: "/produk?q=kuliner" },
    { label: "Kerajinan Tangan", href: "/produk?q=kerajinan" },
    { label: "Peralatan Rumah", href: "/produk?q=peralatan" },
  ],
  Informasi: [
    { label: "Sering Ditanyakan (FAQ)", href: "/faq" },
    { label: "Tentang Kami", href: "/" },
    { label: "Daftarkan Toko", href: `${process.env.NEXT_PUBLIC_APP_URL}/register-email` },
    { label: "Kebijakan Privasi", href: "/" },
    { label: "Hubungi Kami", href: "/" },
  ],
};

export default function ContactSection() {
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
                      width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16
                    }}
                  >
                    📘
                  </div>
                </a>
              )}
              {settings?.social_media?.instagram_url && (
                <a href={settings.social_media.instagram_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16
                    }}
                  >
                    📸
                  </div>
                </a>
              )}
              {settings?.contact?.whatsapp && (
                <a href={`https://wa.me/${settings.contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div
                    style={{
                      width: 36, height: 36, borderRadius: 8, background: "#25D366",
                      display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16
                    }}
                  >
                    💬
                  </div>
                </a>
              )}
            </div>
          </div>

          {(Object.entries(FOOTER_LINKS) as [string, { label: string; href: string }[]][]).map(([title, links]) => (
            <div className="footer-col" key={title}>
              <h4>{title}</h4>
              {links.map((link) => (
                <Link key={link.label} href={link.href} style={{ textDecoration: "none", cursor: "pointer" }}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span>{settings?.footer?.copyright_text || "© 2025 Sleman Mart. Dibuat dengan ❤️ untuk UMKM Sleman."}</span>
          <span>{settings?.contact?.address || "Kabupaten Sleman, D.I. Yogyakarta"}</span>
        </div>
      </div>
    </footer>
  );
}
