"use client";

import { useAddToCart } from "@/features/cart/hooks";
import { useUser } from "@/features/auth/hooks";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";

interface ProductStickyWAProps {
    productId: string;
    productName: string;
    productType?: string;
    selectedVariantId?: string;
    selectedVariantName?: string;
    quantity?: number;
    phone: string; // store.user.phone_number
    isClosed?: boolean;
}

export default function ProductStickyWA({
    productId,
    productName,
    productType,
    selectedVariantId,
    selectedVariantName,
    quantity,
    phone,
    isClosed
}: ProductStickyWAProps) {
    const { data: user } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const { mutate: addToCart, isPending } = useAddToCart();

    const handleClick = () => {
        if (!user) {
            router.push(`/masuk?redirect=${pathname}`);
            return;
        }

        addToCart({
            product_id: productId,
            quantity: quantity || 1,
            variant_id: selectedVariantId,
        });
    };

    return (
        <button
            onClick={handleClick}
            disabled={isClosed || isPending}
            className={`btn btn-lg ${isClosed ? '' : 'btn-cart-sticky'}`}
            style={{
                textDecoration: "none",
                flexShrink: 0,
                border: "none",
                cursor: (isClosed || isPending) ? "not-allowed" : "pointer",
                opacity: (isClosed || isPending) ? 0.6 : 1,
                background: isClosed ? "#a0a0a0" : "var(--primary, #F97316)",
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                justifyContent: "center"
            }}
        >
            <ShoppingCart size={20} style={{ opacity: isClosed ? 0.5 : 1 }} />
            {isClosed ? "Toko Tutup" : isPending ? "Memproses..." : "Masukkan Keranjang"}
        </button>
    );
}
