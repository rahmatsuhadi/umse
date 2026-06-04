"use client";
import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLogout, useUser } from "@/features/auth/hooks";
import {
  Edit3,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  LogOut,
  ChevronRight,
  User2,
  Package,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PenggunaPage() {
  const router = useRouter();
  const { data } = useUser();
  const { mutate: handleLogout } = useLogout();
  const user = data?.data;

  const logout = () => {
    handleLogout();
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div style={{ background: "var(--cream, #FFF9F4)", minHeight: "100vh" }}>
      <Navbar />

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "32px 16px 64px" }}>

        {/* ── Profile Card ── */}
        <div
          style={{
            background: "white",
            borderRadius: "24px",
            border: "1.5px solid var(--cream-dark, #F0D5C2)",
            boxShadow: "0 4px 24px rgba(44,24,16,0.10)",
            overflow: "hidden",
            marginBottom: "24px",
          }}
        >
          {/* Cover */}
          <div
            style={{
              height: 120,
              background: "linear-gradient(135deg, var(--terracotta, #F7620A) 0%, #F5A623 100%)",
              position: "relative",
            }}
          >
            {/* decorative circles */}
            <div style={{
              position: "absolute", right: -20, top: -20,
              width: 140, height: 140, borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }} />
            <div style={{
              position: "absolute", left: 40, bottom: -30,
              width: 80, height: 80, borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
            }} />
          </div>

          {/* Avatar + Info */}
          <div style={{ padding: "0 28px 28px", textAlign: "center" }}>
            <div style={{ marginTop: -52, marginBottom: 16, display: "flex", justifyContent: "center" }}>
              <Avatar
                style={{
                  width: 104,
                  height: 104,
                  border: "4px solid white",
                  boxShadow: "0 4px 16px rgba(44,24,16,0.18)",
                }}
              >
                <AvatarImage
                  src={user?.profile_path ? user.profile_url : ""}
                  alt="Profile"
                  style={{ objectFit: "cover" }}
                />
                <AvatarFallback
                  style={{
                    background: "var(--cream-dark, #F0D5C2)",
                    color: "var(--terracotta, #F7620A)",
                    fontSize: 32,
                    fontWeight: 700,
                  }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>

            <h1
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "var(--text-primary, #1A1008)",
                margin: "0 0 4px",
              }}
            >
              {user?.name || "Pengguna"}
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-muted, #6B4C2A)",
                margin: "0 0 20px",
              }}
            >
              {user?.email}
            </p>

            <button
              onClick={() => router.push("/pengguna/edit")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 24px",
                borderRadius: 50,
                border: "1.5px solid var(--terracotta, #F7620A)",
                background: "transparent",
                color: "var(--terracotta, #F7620A)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--terracotta, #F7620A)";
                (e.currentTarget as HTMLButtonElement).style.color = "white";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--terracotta, #F7620A)";
              }}
            >
              <Edit3 size={15} />
              Edit Profil
            </button>
          </div>
        </div>

        {/* ── Menu Sections ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Manajemen Akun */}
          <MenuCard
            title="Manajemen Akun"
            icon={<User2 size={16} style={{ color: "var(--terracotta, #F7620A)" }} />}
            items={[
              { icon: <Edit3 size={16} />, label: "Edit Profil", href: "/pengguna/edit" },
              { icon: <MapPin size={16} />, label: "Alamat Saya", href: "/pengguna/alamat" },
              { icon: <ShieldCheck size={16} />, label: "Keamanan & Password", href: "/pengguna/ganti-password" },
            ]}
          />

          {/* Belanja & Pesanan */}
          <MenuCard
            title="Belanja & Pesanan"
            icon={<ShoppingBag size={16} style={{ color: "var(--terracotta, #F7620A)" }} />}
            items={[
              { icon: <Package size={16} />, label: "Riwayat Pesanan", href: "/pesanan" },
              { icon: <ShoppingCart size={16} />, label: "Keranjang Saya", href: "/keranjang" },
            ]}
          />

          {/* Keluar */}
          <button
            onClick={logout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 20px",
              background: "white",
              border: "1.5px solid #FDDCDC",
              borderRadius: 16,
              cursor: "pointer",
              transition: "background 0.2s",
              boxShadow: "0 2px 8px rgba(44,24,16,0.06)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#FFF5F5";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "white";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#FFF0F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#E74C3C",
                  flexShrink: 0,
                }}
              >
                <LogOut size={16} />
              </div>
              <span style={{ fontWeight: 600, fontSize: 15, color: "#E74C3C" }}>Keluar</span>
            </div>
            <ChevronRight size={16} style={{ color: "#E74C3C", opacity: 0.6 }} />
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ── MenuCard Component ── */
interface MenuCardProps {
  title: string;
  icon: React.ReactNode;
  items: { icon: React.ReactNode; label: string; href: string }[];
}

function MenuCard({ title, icon, items }: MenuCardProps) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        border: "1.5px solid var(--cream-dark, #F0D5C2)",
        boxShadow: "0 2px 8px rgba(44,24,16,0.06)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid var(--cream-dark, #F0D5C2)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "var(--cream, #FFF9F4)",
        }}
      >
        {icon}
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--text-primary, #1A1008)",
            margin: 0,
            letterSpacing: "0.01em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </h3>
      </div>

      {/* Items */}
      <div>
        {items.map((item, i) => (
          <MenuRow key={i} icon={item.icon} label={item.label} href={item.href} isLast={i === items.length - 1} />
        ))}
      </div>
    </div>
  );
}

/* ── MenuRow Component ── */
interface MenuRowProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isLast?: boolean;
}

function MenuRow({ icon, label, href, isLast }: MenuRowProps) {
  return (
    <Link href={href} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "15px 20px",
          borderBottom: isLast ? "none" : "1px solid var(--cream-dark, #F0D5C2)",
          transition: "background 0.15s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = "var(--cream, #FFF9F4)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = "transparent";
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(247, 98, 10, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--terracotta, #F7620A)",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
          <span
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: "var(--text-primary, #1A1008)",
            }}
          >
            {label}
          </span>
        </div>
        <ChevronRight size={16} style={{ color: "var(--text-muted, #6B4C2A)", opacity: 0.5 }} />
      </div>
    </Link>
  );
}
