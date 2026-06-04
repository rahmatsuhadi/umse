"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useAddresses,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/features/address/hooks";
import { Address } from "@/types";
import {
  ArrowLeft,
  Edit3,
  Home,
  MapPin,
  Phone,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddressPage() {
  const router = useRouter();
  const { mutate: deleteAddress } = useDeleteAddress();
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

  const { data, isLoading } = useAddresses();
  const addresses = data?.data || [];

  const { mutate: handleSetDefaultAddress } = useSetDefaultAddress();

  const confirmDelete = () => {
    if (addressToDelete) {
      deleteAddress(addressToDelete.id, {
        onSuccess: () => setAddressToDelete(null),
      });
    }
  };

  return (
    <div style={{ background: "var(--cream, #FFF9F4)", minHeight: "100vh" }}>
      {/* Sub-header */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid var(--cream-dark, #F0D5C2)",
          padding: "0 20px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/pengguna"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 36, height: 36, borderRadius: 10,
              background: "var(--cream, #FFF9F4)",
              color: "var(--text-primary, #1A1008)",
              textDecoration: "none",
              border: "1.5px solid var(--cream-dark, #F0D5C2)",
            }}
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary, #1A1008)", margin: 0 }}>
            Alamat Saya
          </h1>
        </div>

        <Link
          href="/pengguna/alamat/tambah"
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 50,
            background: "var(--terracotta, #F7620A)",
            color: "white", fontSize: 13, fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <Plus size={15} />
          Tambah
        </Link>
      </div>

      <main style={{ maxWidth: 620, margin: "0 auto", padding: "24px 16px 64px" }}>

        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2].map((i) => (
              <AddressSkeleton key={i} />
            ))}
          </div>
        ) : addresses.length === 0 ? (
          /* Empty state */
          <div
            style={{
              background: "white",
              borderRadius: 20,
              border: "1.5px solid var(--cream-dark, #F0D5C2)",
              boxShadow: "0 4px 20px rgba(44,24,16,0.06)",
              padding: "56px 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "rgba(247,98,10,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
                color: "var(--terracotta, #F7620A)",
              }}
            >
              <MapPin size={32} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary, #1A1008)", margin: "0 0 8px" }}>
              Belum ada alamat
            </h3>
            <p style={{ fontSize: 14, color: "var(--text-muted, #6B4C2A)", margin: "0 0 24px" }}>
              Tambah alamat untuk memudahkan proses pengiriman
            </p>
            <Link
              href="/pengguna/alamat/tambah"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 28px", borderRadius: 50,
                background: "var(--terracotta, #F7620A)",
                color: "white", fontWeight: 700, fontSize: 14,
                textDecoration: "none",
              }}
            >
              <Plus size={16} /> Tambah Alamat Pertama
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={() => router.push(`/pengguna/alamat/${address.id}`)}
                onDelete={() => setAddressToDelete(address)}
                onSetDefault={() => handleSetDefaultAddress(address.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete confirmation */}
      <AlertDialog open={!!addressToDelete} onOpenChange={() => setAddressToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Alamat?</AlertDialogTitle>
            <AlertDialogDescription>
              Alamat <strong>{addressToDelete?.label || addressToDelete?.recipient_name}</strong> akan dihapus secara permanen dan tidak dapat dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              style={{ background: "#E74C3C", color: "white" }}
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ── AddressCard ── */
function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        border: `1.5px solid ${address.is_primary ? "var(--terracotta, #F7620A)" : "var(--cream-dark, #F0D5C2)"}`,
        boxShadow: address.is_primary
          ? "0 4px 16px rgba(247,98,10,0.12)"
          : "0 2px 8px rgba(44,24,16,0.06)",
        padding: "18px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Primary strip */}
      {address.is_primary && (
        <div
          style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: 3,
            background: "var(--terracotta, #F7620A)",
            borderRadius: "16px 16px 0 0",
          }}
        />
      )}

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary, #1A1008)" }}>
            {address.recipient_name}
          </span>
          {address.is_primary && (
            <span
              style={{
                fontSize: 11, fontWeight: 700,
                background: "var(--terracotta, #F7620A)",
                color: "white",
                padding: "2px 10px", borderRadius: 50,
                letterSpacing: "0.3px",
              }}
            >
              Utama
            </span>
          )}
          {address.label && (
            <span
              style={{
                fontSize: 11, fontWeight: 600,
                background: "var(--cream-dark, #F0D5C2)",
                color: "var(--text-secondary, #4A3728)",
                padding: "2px 10px", borderRadius: 50,
              }}
            >
              {address.label}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {!address.is_primary && (
            <ActionBtn
              onClick={onSetDefault}
              title="Jadikan Utama"
              color="#F39C12"
              bg="#FFFBF0"
            >
              <Star size={14} />
            </ActionBtn>
          )}
          <ActionBtn onClick={onEdit} title="Edit" color="var(--terracotta, #F7620A)" bg="rgba(247,98,10,0.06)">
            <Edit3 size={14} />
          </ActionBtn>
          <ActionBtn onClick={onDelete} title="Hapus" color="#E74C3C" bg="#FFF5F5">
            <Trash2 size={14} />
          </ActionBtn>
        </div>
      </div>

      {/* Detail */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <InfoRow icon={<Phone size={13} />} text={address.recipient_phone_number} />
        <InfoRow icon={<Home size={13} />} text={address.address} />
        <InfoRow
          icon={<MapPin size={13} />}
          text={`${address.district?.name}, ${address.regency?.name} ${address.postal_code || ""}`}
        />
      </div>
    </div>
  );
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--text-secondary, #4A3728)" }}>
      <span style={{ color: "var(--text-muted, #6B4C2A)", marginTop: 1, flexShrink: 0 }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function ActionBtn({
  onClick, title, color, bg, children,
}: {
  onClick: () => void;
  title: string;
  color: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 32, height: 32, borderRadius: 8,
        background: bg, border: "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color, transition: "opacity 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {children}
    </button>
  );
}

/* ── Skeleton ── */
function AddressSkeleton() {
  return (
    <div
      style={{
        background: "white", borderRadius: 16,
        border: "1.5px solid var(--cream-dark, #F0D5C2)",
        padding: "18px 20px",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ width: 100, height: 16, borderRadius: 8, background: "#F0D5C2" }} />
          <div style={{ width: 50, height: 16, borderRadius: 8, background: "#F0D5C2" }} />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F0D5C2" }} />
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F0D5C2" }} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ width: "40%", height: 12, borderRadius: 6, background: "#F0D5C2" }} />
        <div style={{ width: "80%", height: 12, borderRadius: 6, background: "#F0D5C2" }} />
        <div style={{ width: "60%", height: 12, borderRadius: 6, background: "#F0D5C2" }} />
      </div>
    </div>
  );
}
