"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, User2 } from "lucide-react";
import { useLogout, useUser } from "@/features/auth/hooks";
import { getToken } from "@/lib/token-service";
import { useCart } from "@/features/cart/hooks";

const navLinks = [
  { name: "Beranda", href: "/", icon: "🏠", iconBg: "#D4EFDF" },
  { name: "Merchant", href: "/umkm", icon: "🏪", iconBg: "#FEF3D0" },
  { name: "Produk", href: "/produk", icon: "🛍️", iconBg: "#FDE8D8" },
  { name: "Sleman Food", href: "/sleman-food", icon: "🍱", iconBg: "#FFEDD5" },
  { name: "Jelajahi", href: "/explore", icon: "🔍", iconBg: "#E8EAF6" },
  { name: "Profil", href: "/profile", icon: "👤", iconBg: "#E0F2F1" },
];

export function Navbar({ withMenu = true }: { withMenu?: boolean }) {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    const withAuth = !!getToken();
    setIsAuth(withAuth);
    setIsLoading(false);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileSearchOpen(false);
    }
  };

  return (
    <>
      <div className="top-bar hidden md:flex">
        <div className="top-bar-inner">

          <div className="top-bar-left">
            <Link href="/panduan-pembeli" className="top-bar-link">Panduan Pembeli</Link>
            <span style={{ color: 'white', opacity: 0.5 }}>|</span>
            <Link href="/panduan-merchant" className="top-bar-link">Panduan Merchant</Link>
          </div>

          {/* <div className="top-bar-right">
            <Link href="/masuk" className="top-bar-link" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
              Masuk
            </Link>
          </div> */}
        </div>
      </div>
      <nav id="mainNav">
        <div className="nav-inner">
          <Link href="/" className="logo">
            <Image src="/slemanmartlogo.png" alt="Sleman Mart" width={100} height={36} className="h-9 w-auto" />
          </Link>

          <form className="nav-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Cari produk, toko, artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </form>

          {withMenu && (
            <div className="nav-links">
              {navLinks.map((link) => {
                // For Profil, if not auth, go to /masuk
                const actualHref = link.name === "Profil" && !isAuth ? "/profile" : link.href;
                return (
                  <Link
                    key={link.name}
                    href={actualHref}
                    className={`nav-link ${pathname === link.href ? 'active' : ''}`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Auth section replaces empty space */}
          {!isLoading && isAuth && (
            <div className="desktop-auth" style={{ marginLeft: "16px", display: "flex", alignItems: "center" }}>
              <AuthSection />
            </div>
          )}

          <button className="nav-search-icon-btn" onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)} aria-label="Cari">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
          <button className="nav-mobile-menu" onClick={() => setIsDrawerOpen(true)} aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* Mobile search slide-down */}
        <div className={`mobile-search-bar ${isMobileSearchOpen ? 'open' : ''}`} id="mobileSearchBar">
          <form className="mobile-search-inner" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Cari produk, toko, artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </form>
        </div>
      </nav>

      <div className={`drawer-overlay ${isDrawerOpen ? 'open visible' : ''}`} onClick={() => setIsDrawerOpen(false)}></div>
      <div className={`drawer ${isDrawerOpen ? 'open' : ''}`} id="mobileDrawer">
        <div className="drawer-header">
          <Image src="/slemanmartlogo.png" alt="Sleman Mart" width={100} height={36} className="h-9 w-auto" />
          <button className="drawer-close" onClick={() => setIsDrawerOpen(false)}>✕</button>
        </div>
        <nav className="drawer-nav">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`drawer-nav-item ${pathname === link.href ? 'active' : ''}`}
              onClick={() => setIsDrawerOpen(false)}
              style={{ textDecoration: 'none' }}
            >
              <div className="drawer-nav-icon" style={{ background: link.iconBg }}>{link.icon}</div>
              <span>{link.name}</span>
            </Link>
          ))}
          <div className="drawer-divider"></div>
          {/* <Link href="/literasi" className="drawer-nav-item" onClick={() => setIsDrawerOpen(false)} style={{ textDecoration: 'none' }}>
            <div className="drawer-nav-icon" style={{ background: "#E0F2F1" }}>📝</div>
            <span>Tips & Artikel</span>
          </Link>
          <Link href="/kontak" className="drawer-nav-item" onClick={() => setIsDrawerOpen(false)} style={{ textDecoration: 'none' }}>
            <div className="drawer-nav-icon" style={{ background: "#FFF3E0" }}>📞</div>
            <span>Hubungi Kami</span>
          </Link> */}
        </nav>

        {/* <div className="mobile-auth-drawer" style={{ padding: "0 20px 20px" }}>
          <div className="drawer-divider" style={{ margin: "0 -20px 16px" }}></div>
          {!isLoading && !isAuth && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link href="/daftar" style={{ width: "100%", display: "block", background: "var(--cream-dark)", color: "var(--text-primary)", padding: "12px", borderRadius: "8px", textAlign: "center", fontWeight: 700, textDecoration: "none" }} onClick={() => setIsDrawerOpen(false)}>Daftar</Link>
              <Link href="/masuk" style={{ width: "100%", display: "block", background: "var(--terracotta)", color: "white", padding: "12px", borderRadius: "8px", textAlign: "center", fontWeight: 700, textDecoration: "none" }} onClick={() => setIsDrawerOpen(false)}>Masuk</Link>
            </div>
          )}
          {!isLoading && isAuth && (
            <MobileAuthSection closeDrawer={() => setIsDrawerOpen(false)} />
          )}
        </div> */}

        <div className="drawer-footer">
          <p>© 2025 Sleman Mart · Kabupaten Sleman, DIY</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-auth {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}





function AuthSection() {
  const { data: user } = useUser();
  const { data: cartData } = useCart();
  const { mutate: logout } = useLogout();
  const cartCount = cartData?.data?.items_count || 0;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {/* Cart */}
      <Link
        href="/keranjang"
        style={{ position: "relative", color: "var(--text-secondary)", textDecoration: "none" }}
      >
        <ShoppingCart className="w-5 h-5" />
        {cartCount > 0 && (
          <span style={{
            position: "absolute",
            top: -6,
            right: -6,
            background: "var(--terracotta)",
            color: "white",
            fontSize: 10,
            fontWeight: 700,
            borderRadius: "50%",
            width: 16,
            height: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {cartCount}
          </span>
        )}
      </Link>

      {/* Profile Dropdown */}
      <div style={{ position: "relative" }} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            padding: 2,
            background: "none",
            border: "none",
            cursor: "pointer"
          }}
        >
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--cream-dark)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--terracotta)",
            overflow: "hidden"
          }}>
            <User2 className="w-5 h-5" />
          </div>
        </button>

        {isOpen && (
          <div style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 200,
            background: "white",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-md)",
            border: "1px solid var(--cream-dark)",
            padding: "8px",
            zIndex: 110
          }}>
            <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--cream-dark)", marginBottom: 8 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{user?.data?.name}</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{user?.data?.email}</p>
            </div>
            {[
              { href: "/pengguna", label: "Profil Saya", icon: "👤" },
              { href: "/pesanan", label: "Pesanan", icon: "📦" },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  textDecoration: "none",
                  color: "var(--text-primary)",
                  fontSize: 13,
                }}
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                <span>{item.icon}</span> {item.label}
              </Link>
            ))}
            <button
              onClick={() => { logout(); setIsOpen(false); }}
              className="nav-link"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                background: "none",
                border: "none",
                color: "#E74C3C",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "left",
                marginTop: 4
              }}
            >
              <span>🚪</span> Keluar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

