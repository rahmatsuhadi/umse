"use client";

import Link from "next/link";
import Image from "next/image";

const SOCIAL_LINKS = [
  { icon: "📘", href: "https://www.facebook.com/dinkopukmsleman", label: "Facebook", bg: "rgba(255,255,255,0.08)" },
  { icon: "📸", href: "https://www.instagram.com/dinkopukmsleman/", label: "Instagram", bg: "rgba(255,255,255,0.08)" },
  { icon: "💬", href: "https://wa.me/6282322798318?text=Salam%20SlemanMart", label: "WhatsApp", bg: "#25D366" },
];

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
    { label: "Daftarkan Toko", href: "/daftar" },
    { label: "Kebijakan Privasi", href: "/" },
    { label: "Hubungi Kami", href: "/" },
  ],
};

export default function ContactSection() {
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
            <p>Platform showcase produk lokal Kabupaten Sleman. Mendukung UMKM tumbuh dan berkembang bersama komunitas.</p>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              {SOCIAL_LINKS.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  title={s.label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: s.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: 16,
                    textDecoration: "none",
                  }}
                >
                  {s.icon}
                </Link>
              ))}
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
          <span>© 2025 Sleman Mart. Dibuat dengan ❤️ untuk UMKM Sleman.</span>
          <span>Kabupaten Sleman, D.I. Yogyakarta</span>
        </div>
      </div>
    </footer>
  );
}
