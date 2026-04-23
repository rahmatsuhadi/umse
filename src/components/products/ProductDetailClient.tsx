"use client";

import { useState } from "react";
import type { Product, Variant } from "@/types";
import ProductCheckoutButton from "./ProductCheckoutButton";
import ProductStickyWA from "./ProductStickyWA";
import ProductImageGallery from "./ProductImageGallery";
import Image from "next/image";

interface ProductDetailClientProps {
    product: Product;
    isClosed: boolean;
    mainImage: string;
    images: string[];
}

/**
 * Client wrapper that holds shared state for:
 * - selectedVariant (from ProductCheckoutButton)
 * - quantity (from ProductCheckoutButton)
 * - activeIndex (for ProductImageGallery)
 * so that ProductStickyWA receives the same variant/qty for a dynamic WA msg.
 */
export default function ProductDetailClient({ product, isClosed, mainImage, images: initialImages }: ProductDetailClientProps) {
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [images, setImages] = useState(initialImages);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleVariantChange = (v: Variant | null) => {
        setSelectedVariant(v);
        if (v?.thumbnail?.media_url) {
            const foundIndex = images.findIndex(img => img === v.thumbnail.media_url);
            if (foundIndex !== -1) {
                setActiveIndex(foundIndex);
            } else {
                // If not found, add it to the images list
                setImages(prev => [v.thumbnail.media_url, ...prev]);
                setActiveIndex(0);
            }
        }
    };

    const discountPct = product.discount_percentage ? Number(product.discount_percentage) : 0;
    const currentPrice = selectedVariant ? selectedVariant.price : product.price;

    let baseVal = currentPrice.value;
    if (discountPct > 0) {
        if (selectedVariant) {
            const variantDiscountPrice = (selectedVariant as any).discount_price;
            if (variantDiscountPrice) {
                baseVal = typeof variantDiscountPrice === 'object' ? variantDiscountPrice.value : Number(variantDiscountPrice);
            } else {
                baseVal = currentPrice.value - (currentPrice.value * discountPct / 100);
            }
        } else if (product.discount_price) {
            const dp = product.discount_price;
            baseVal = Number(typeof dp === 'object' && dp !== null && 'value' in dp ? dp.value : dp);
        }
    }

    const totalVal = baseVal * quantity;
    const stickyPriceStr = `Rp ${Math.round(totalVal).toLocaleString('id-ID').replace(/,/g, '.')}`;

    return (
        <>
            {/* Gallery (Left / Sticky) */}
            <ProductImageGallery 
                images={images} 
                isClosed={isClosed} 
                externalSelectedIndex={activeIndex}
                onIndexChange={setActiveIndex}
            />

            {/* Product Info (Right) */}
            <div className="detail-info">
                <ProductCheckoutButton
                    product={product}
                    isClosed={isClosed}
                    onVariantChange={handleVariantChange}
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
                                src={images[activeIndex] || mainImage}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <div className="sticky-product-name">{product.name}</div>
                            <div className="sticky-product-price">
                                {stickyPriceStr}
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
