"use client";

import { useAddToCart, useGuestCart } from "@/features/cart/hooks";
import { useUser } from "@/features/auth/hooks";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types";

interface ProductStickyWAProps {
    product?: Product;
    productId: string;
    productName: string;
    productType?: string;
    selectedVariantId?: string;
    selectedVariantName?: string;
    quantity?: number;
    phone: string; // store.user.phone_number
    isClosed?: boolean;
    hasNoQris?: boolean;
}

export default function ProductStickyWA({
    product,
    productId,
    selectedVariantId,
    quantity,
    isClosed,
    hasNoQris
}: ProductStickyWAProps) {
    const { data: user } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const { mutate: addToCart, isPending } = useAddToCart();
    const { addItem: addToGuestCart } = useGuestCart();

    const handleClick = () => {
        if (!user) {
            if (product) {
                const selectedVariant = product.variants?.find(v => v.id === selectedVariantId) || null;
                const price = selectedVariant ? selectedVariant.price : product.price;
                addToGuestCart({
                    product_id: product.id,
                    variant_id: selectedVariantId,
                    quantity: quantity || 1,
                    product_name: product.name,
                    product_thumbnail: product.thumbnail?.media_url || '',
                    product_price_value: product.price?.value || 0,
                    product_price_formatted: product.price?.formatted || '',
                    variant_name: selectedVariant?.name,
                    variant_price_value: selectedVariant ? price?.value : undefined,
                    variant_price_formatted: selectedVariant ? price?.formatted : undefined,
                    store_id: product.store.id,
                    store_name: product.store.name,
                    store_logo_url: product.store.logo_url || '',
                    store_address: product.store.address || '',
                    store_slug: product.store.slug,
                    store_qris_url: product.store.qris_url,
                    store_village_id: product.store.village_id != null ? String(product.store.village_id) : undefined,
                    store_district_id: product.store.district_id != null ? String(product.store.district_id) : undefined,
                    store_regency_id: product.store.regency_id != null ? String(product.store.regency_id) : undefined,
                    store_description: product.store.description,
                });
            } else {
                router.push(`/masuk?redirect=${pathname}`);
            }
            return;
        }

        addToCart({
            product_id: productId,
            quantity: quantity || 1,
            variant_id: selectedVariantId,
        });
    };

    const disabled = isClosed || isPending || hasNoQris;
    const tooltipText = isClosed ? "Toko sedang tutup" : hasNoQris ? "Penjual belum mengupload QRIS" : undefined;

    return (
        <span
            title={tooltipText}
            onClick={() => {
                if (tooltipText) {
                    toast.error("Gagal menambahkan ke keranjang", {
                        description: tooltipText,
                    });
                }
            }}
            style={{ display: "inline-flex", flexShrink: 0 }}
        >
            <button
                onClick={handleClick}
                disabled={disabled}
                className={`btn btn-lg ${disabled ? '' : 'btn-cart-sticky'}`}
                style={{
                    textDecoration: "none",
                    flexShrink: 0,
                    border: "none",
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.6 : 1,
                    background: isClosed ? "#a0a0a0" : hasNoQris ? "#888888" : "var(--primary, #F97316)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    justifyContent: "center",
                    pointerEvents: (isClosed || hasNoQris) ? "none" : "auto"
                }}
            >
                <ShoppingCart size={20} style={{ opacity: disabled ? 0.5 : 1 }} />
                {isClosed ? "Toko Tutup" : hasNoQris ? "QRIS Belum Diupload" : isPending ? "Memproses..." : "Masukkan Keranjang"}
            </button>
        </span>
    );
}
