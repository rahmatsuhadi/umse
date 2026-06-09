import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function OrderEmpty() {
  return (
    <div className="cart-store-container" style={{ borderRadius: "var(--radius-md)", marginBottom: 24 }}>
      {/* Top Gradient Header Bar to match OrderCard */}
      <div className="cart-store-header-bar" />
      
      <div className="cart-empty-card" style={{ maxWidth: "none", margin: 0, boxShadow: "none", border: "none", borderRadius: 0, padding: "56px 24px" }}>
        <div className="cart-empty-decor-1" />
        <div className="cart-empty-decor-2" />
        
        <div className="cart-empty-icon-wrapper">
          <ShoppingBag size={32} />
        </div>
        <h3 className="cart-empty-title">
          Belum Ada Pesanan
        </h3>
        <p className="cart-empty-desc" style={{ marginBottom: 24 }}>
          Anda belum memiliki transaksi pesanan pada kategori filter ini.
        </p>
        <Link
          href="/"
          className="btn btn-primary"
        >
          Mulai Belanja
        </Link>
      </div>
    </div>
  );
}
