"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { CartItem, Store } from "@/types";
import { formatRupiah } from "@/lib/curency-format";
import { getComputedPrice } from "@/lib/price-helper";
import { isGoodsItem, isServiceItem } from "@/lib/product-helper";
import {
  AlertTriangle,
  Package,
  Wrench,
  ArrowRight,
  ArrowLeft,
  Info,
  ShieldAlert,
} from "lucide-react";

interface CheckoutMixedOrderProps {
  items: CartItem[];
  store?: Store;
  onSelectType: (type: "goods" | "service") => void;
}

export default function CheckoutMixedOrder({
  items,
  store,
  onSelectType,
}: CheckoutMixedOrderProps) {
  const goodsItems = useMemo(
    () => items.filter((item) => isGoodsItem(item)),
    [items]
  );
  const serviceItems = useMemo(
    () => items.filter((item) => isServiceItem(item)),
    [items]
  );

  const goodsSubtotal = useMemo(() => {
    return goodsItems.reduce((acc, item) => {
      const p = getComputedPrice(item.product, item.variant);
      return acc + p.finalPriceValue * item.quantity;
    }, 0);
  }, [goodsItems]);

  const serviceSubtotal = useMemo(() => {
    return serviceItems.reduce((acc, item) => {
      const p = getComputedPrice(item.product, item.variant);
      return acc + p.finalPriceValue * item.quantity;
    }, 0);
  }, [serviceItems]);

  return (
    <div className="py-6 px-2 md:px-0 max-w-4xl mx-auto space-y-6">
      {/* Warning Banner Header */}
      <div
        className="rounded-3xl p-6 md:p-8 border shadow-sm"
        style={{
          background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
          borderColor: "#FCD34D",
        }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner"
            style={{
              background: "#F59E0B",
              color: "#FFFFFF",
            }}
          >
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2"
              style={{
                background: "#FEF3C7",
                color: "#B45309",
                border: "1px solid #FDE68A",
              }}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Pemisahan Checkout Diperlukan
            </div>
            <h2 className="text-xl md:text-2xl font-black text-amber-950">
              Jenis Barang dan Jasa Tidak Bisa Di-checkout dalam Satu Order
            </h2>
            <p className="text-xs md:text-sm text-amber-900 mt-1.5 leading-relaxed">
              Pesanan Anda saat ini menggabungkan <strong>Produk Barang Fisik</strong> dan <strong>Layanan Jasa</strong> dari toko{" "}
              <strong>{store?.name || "UMKM Sleman"}</strong>. Karena perbedaan alur transaksi dan sistem pengiriman, keduanya tidak dapat disatukan dalam satu nomor pesanan.
            </p>
          </div>
        </div>

        {/* Informative Explanation */}
        <div
          className="mt-6 p-4 md:p-5 rounded-2xl border text-xs md:text-sm space-y-2.5"
          style={{
            background: "#FFFFFF",
            borderColor: "#FDE68A",
            color: "#78350F",
          }}
        >
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Mengapa barang dan jasa harus di-checkout terpisah?</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">
              <p className="font-bold text-orange-950 flex items-center gap-1.5 mb-1">
                <Package className="w-4 h-4 text-orange-600" />
                Produk Barang Fisik
              </p>
              <p className="text-[12px] text-orange-900 leading-relaxed">
                Memerlukan pemilihan kurir pengiriman (Instant/Reguler/COD), titik koordinat peta, dan perhitungan ongkos kirim ke alamat Anda.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
              <p className="font-bold text-purple-950 flex items-center gap-1.5 mb-1">
                <Wrench className="w-4 h-4 text-purple-600" />
                Layanan Jasa
              </p>
              <p className="text-[12px] text-purple-900 leading-relaxed">
                Langsung dikerjakan mitra UMKM tanpa kurir fisik (bebas ongkir) dan memerlukan konfirmasi ketersediaan jadwal pengerjaan.
              </p>
            </div>
          </div>
          <p className="text-[11px] text-amber-800 pt-1 italic">
            💡 Solusi: Anda dapat memilih salah satu jenis di bawah untuk di-checkout sekarang. Item jenis lainnya tetap tersimpan aman di keranjang belanja Anda.
          </p>
        </div>
      </div>

      {/* Two Column Split Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Goods Column */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:border-orange-300 transition-all">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    Produk Barang
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Memerlukan kurir & ongkos kirim
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                {goodsItems.length} Produk
              </span>
            </div>

            {/* Goods List Preview */}
            <div className="mt-4 space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {goodsItems.map((item, idx) => {
                const itemPrice = getComputedPrice(item.product, item.variant);
                const thumb =
                  item.variant?.thumbnail?.media_url ||
                  item.product.thumbnail?.media_url ||
                  "/assets/no-image.jpg";

                return (
                  <div
                    key={item.id || idx}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-gray-50 border border-gray-100"
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image
                        src={thumb}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {item.variant?.name ? `Varian: ${item.variant.name}` : "Standard"} &bull; {item.quantity}x
                      </p>
                      <p className="text-xs font-bold text-orange-600">
                        {itemPrice.finalPriceFormatted}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Subtotal Barang:</span>
              <span className="font-black text-gray-900 text-base">
                {formatRupiah(goodsSubtotal)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onSelectType("goods")}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
              style={{
                background: "linear-gradient(135deg, #F7620A 0%, #E04D00 100%)",
              }}
            >
              <Package className="w-4 h-4" />
              <span>Checkout Barang Saja</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Services Column */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:border-purple-300 transition-all">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    Layanan Jasa
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Bebas ongkir & konfirmasi jadwal
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                {serviceItems.length} Layanan
              </span>
            </div>

            {/* Service List Preview */}
            <div className="mt-4 space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {serviceItems.map((item, idx) => {
                const itemPrice = getComputedPrice(item.product, item.variant);
                const thumb =
                  item.variant?.thumbnail?.media_url ||
                  item.product.thumbnail?.media_url ||
                  "/assets/no-image.jpg";

                return (
                  <div
                    key={item.id || idx}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-gray-50 border border-gray-100"
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image
                        src={thumb}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {item.variant?.name ? `Varian: ${item.variant.name}` : "Standard"} &bull; {item.quantity}x
                      </p>
                      <p className="text-xs font-bold text-purple-700">
                        {itemPrice.finalPriceFormatted}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Subtotal Jasa:</span>
              <span className="font-black text-gray-900 text-base">
                {formatRupiah(serviceSubtotal)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onSelectType("service")}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
              style={{
                background: "linear-gradient(135deg, #7B1FA2 0%, #9C27B0 100%)",
              }}
            >
              <Wrench className="w-4 h-4" />
              <span>Checkout Jasa Saja</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Return to cart button */}
      <div className="text-center pt-4">
        <Link
          href="/keranjang"
          className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-gray-600 hover:text-orange-600 px-5 py-2.5 rounded-full border border-gray-200 hover:border-orange-300 bg-white shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Keranjang Belanja</span>
        </Link>
      </div>
    </div>
  );
}

