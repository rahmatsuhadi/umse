"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShoppingBag, MapPin, ArrowRight, LogIn } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { CartItemCard } from "./CartItemCard";
import { formatRupiah } from "@/lib/curency-format";
import type { GuestCartItem } from "@/lib/guest-cart-service";

interface GuestCartStoreCardProps {
  storeName: string;
  storeLocation: string;
  storeLogoUrl: string;
  storeId: string;
  items: GuestCartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export const GuestCartStoreCard = ({
  storeName,
  storeLocation,
  storeLogoUrl,
  items,
  onRemove,
  onUpdateQuantity,
}: GuestCartStoreCardProps) => {
  const router = useRouter();
  const [isStoreChecked, setIsStoreChecked] = useState(false);
  const [itemChecked, setItemChecked] = useState<boolean[]>(
    new Array(items.length).fill(false)
  );

  const selectedItems = items.filter((_, idx) => itemChecked[idx]);

  const handleStoreCheckboxChange = (checked: boolean) => {
    setIsStoreChecked(checked);
    setItemChecked(new Array(items.length).fill(checked));
  };

  const handleItemCheckboxChange = (index: number) => {
    const updated = [...itemChecked];
    updated[index] = !updated[index];
    setItemChecked(updated);
    setIsStoreChecked(updated.every((c) => c));
  };

  const handleQuantityChange = (item: GuestCartItem, delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      onRemove(item.id);
    } else {
      onUpdateQuantity(item.id, newQty);
    }
  };

  const handleCheckoutLogin = () => {
    // Simpan store yang dipilih, lalu arahkan ke login dengan redirect ke keranjang
    router.push(`/masuk?redirect=/keranjang`);
  };

  const subtotal = selectedItems.reduce((acc, item) => {
    const priceVal = item.variant_price_value ?? item.product_price_value;
    return acc + priceVal * item.quantity;
  }, 0);

  return (
    <div className="cart-store-container">
      {/* Top gradient accent bar */}
      <div className="cart-store-header-bar" />

      {/* Guest notice banner */}
      <div
        style={{
          background: "linear-gradient(90deg, #fff8f0 0%, #fff3e6 100%)",
          border: "1px solid #f7d5b0",
          borderRadius: "10px",
          padding: "10px 14px",
          margin: "0 0 4px 0",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "13px",
          color: "#c2601a",
          fontWeight: 500,
        }}
      >
        <LogIn size={15} style={{ flexShrink: 0 }} />
        <span>
          Item ini tersimpan di perangkat Anda.{" "}
          <button
            onClick={handleCheckoutLogin}
            style={{
              color: "var(--terracotta)",
              fontWeight: 700,
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Login
          </button>{" "}
          untuk melanjutkan checkout.
        </span>
      </div>

      {/* Store Header */}
      <div className="cart-store-header">
        <div className="cart-store-info">
          <Checkbox
            onCheckedChange={(checked: boolean) =>
              handleStoreCheckboxChange(checked)
            }
            checked={isStoreChecked}
            className="flex-shrink-0"
          />

          {/* Store Logo */}
          <div className="cart-store-logo-wrapper">
            {storeLogoUrl ? (
              <Image
                src={storeLogoUrl}
                alt={storeName}
                width={44}
                height={44}
                className="object-cover w-full h-full"
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "var(--cream)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShoppingBag size={20} style={{ color: "var(--terracotta)" }} />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="cart-store-name">{storeName}</h3>
              <span className="cart-store-badge">
                <ShoppingBag className="w-2.5 h-2.5 mr-1" />
                {items.length} produk
              </span>
            </div>
            {storeLocation && (
              <p className="cart-store-location">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                {storeLocation}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="pb-2">
        {items.map((item, index) => {
          const priceVal = item.variant_price_value ?? item.product_price_value;
          const priceFmt =
            item.variant_price_formatted ??
            item.product_price_formatted ??
            formatRupiah(priceVal);
          return (
            <CartItemCard
              key={item.id}
              title={item.product_name}
              variant={item.variant_name || "Tanpa Variant"}
              price={
                {
                  value: priceVal,
                  formatted: priceFmt,
                } as never
              }
              quantity={item.quantity}
              disabledUpdateStock={false}
              media={item.product_thumbnail}
              onIncrement={() => handleQuantityChange(item, +1)}
              onDecrement={() => handleQuantityChange(item, -1)}
              onRemove={() => onRemove(item.id)}
              isChecked={itemChecked[index]}
              onCheck={() => handleItemCheckboxChange(index)}
            />
          );
        })}
      </div>

      {/* Footer — Subtotal & Checkout CTA */}
      <div className="cart-store-footer">
        {/* Subtotal */}
        <div>
          <p className="cart-store-subtotal-title">Subtotal produk dipilih</p>
          <p className="cart-store-subtotal-value">{formatRupiah(subtotal)}</p>
        </div>

        {/* Login to Checkout Button */}
        <button
          type="button"
          disabled={selectedItems.length === 0}
          onClick={handleCheckoutLogin}
          className="cart-checkout-btn"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <LogIn className="w-4 h-4" />
          Login & Checkout
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
