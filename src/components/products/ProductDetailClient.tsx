"use client";

import { useState } from "react";
import type { Product, Variant } from "@/types";
import ProductCheckoutButton from "./ProductCheckoutButton";
import ProductStickyWA from "./ProductStickyWA";
import Image from "next/image";

interface ProductDetailClientProps {
    product: Product;
    isClosed: boolean;
    mainImage: string;
}

/**
 * Client wrapper that holds shared state for:
 * - selectedVariant (from ProductCheckoutButton)
 * - quantity (from ProductCheckoutButton)
 * so that ProductStickyWA receives the same variant/qty for a dynamic WA msg.
 */
export default function ProductDetailClient({ product, isClosed, mainImage }: ProductDetailClientProps) {
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [quantity, setQuantity] = useState(1);

    return (
        <>
            {/* Product Info (Right) */}
            <div className="detail-info">

                <ProductCheckoutButton
                    product={product}
                    isClosed={isClosed}
                    onVariantChange={setSelectedVariant}
                    onQuantityChange={setQuantity}
                />
            </div>

            {/* Sticky CTA Bar (Bottom) */}
            <div className="sticky-cta">
                <div className="sticky-cta-inner">
                    {/* Product Info */}
                    <div className="sticky-product-info">
                        <div className="sticky-product-img">
                            <Image
                                src={mainImage}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <div className="sticky-product-name">{product.name}</div>
                            <div className="sticky-product-price">
                                {(selectedVariant ? selectedVariant.price : product.price).formatted.split(",")[0]}
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp CTA */}
                    <ProductStickyWA
                        productId={product.id}
                        productName={product.name}
                        productType={product.type}
                        selectedVariantName={selectedVariant?.name}
                        quantity={quantity}
                        phone={product.store?.user?.phone_number || product.store?.phone || ''}
                        isClosed={isClosed}
                    />
                </div>
            </div>
        </>
    );
}
