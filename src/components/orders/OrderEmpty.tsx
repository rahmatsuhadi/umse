import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function OrderEmpty() {
  return (
    <div className="cart-empty-card">
      <div className="cart-empty-decor-1" />
      <div className="cart-empty-decor-2" />
      
      <div className="cart-empty-icon-wrapper">
        <ShoppingBag size={32} />
      </div>
      <h3 className="cart-empty-title">
        Belum Ada Pesanan
      </h3>
      <p className="cart-empty-desc">
        Anda belum memiliki transaksi pesanan pada kategori filter ini.
      </p>
      <Link
        href="/"
        className="btn btn-primary"
      >
        Mulai Belanja
      </Link>
    </div>
  );
}
