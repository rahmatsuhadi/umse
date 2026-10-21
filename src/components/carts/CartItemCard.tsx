import { Price } from "@/types";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import { formatRupiah } from "@/lib/curency-format";
import { useState } from "react";
import { Trash2, Package } from "lucide-react";

interface CartItemProps {
    title: string;
    variant: string;
    price: Price;
    originalPrice?: Price;
    discountPercentage?: number;
    hasDiscount?: boolean;
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
    onRemove: () => void;
    isChecked: boolean;
    onCheck: () => void;
    media: string;
    disabledUpdateStock: boolean;
}

export const CartItemCard = ({
    title,
    disabledUpdateStock,
    variant,
    media,
    price,
    originalPrice,
    discountPercentage,
    hasDiscount,
    quantity,
    onIncrement,
    onDecrement,
    onRemove,
    isChecked,
    onCheck,
}: CartItemProps) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="cart-item-row">
            
            {/* Top Row: Checkbox, Image, Info & Delete Button */}
            <div className="cart-item-left">
                {/* Checkbox */}
                <Checkbox
                    checked={isChecked}
                    onCheckedChange={onCheck}
                    className="flex-shrink-0"
                />

                {/* Product Image */}
                <div className="cart-item-img-wrapper">
                    {!imgError && media ? (
                        <Image
                            src={media}
                            width={72}
                            height={72}
                            alt={title}
                            className="object-cover w-full h-full"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <Package size={24} className="text-[var(--text-muted,#6B4C2A)] opacity-40" />
                    )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                    <h4 className="cart-item-title">
                        {title}
                    </h4>
                    <p className="cart-item-variant">
                        Varian: {variant}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap mt-1">
                        <span className="cart-item-price font-bold">
                            {price.formatted}
                        </span>
                        {hasDiscount && originalPrice && (
                            <>
                                <span className="text-xs line-through" style={{ color: "var(--text-muted, #6B4C2A)", opacity: 0.7 }}>
                                    {originalPrice.formatted}
                                </span>
                                {discountPercentage ? (
                                    <span className="badge badge-terracotta text-[10px] px-1.5 py-0.5 font-bold" style={{ borderRadius: "6px" }}>
                                        -{Math.round(discountPercentage)}%
                                    </span>
                                ) : null}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Row (Mobile) / Right Side (Desktop): Quantity, Subtotal, Delete */}
            <div className="cart-item-right">
                
                {/* Quantity Controls */}
                <div className="cart-item-qty-adjuster">
                    <button
                        disabled={disabledUpdateStock}
                        onClick={onDecrement}
                        className="cart-qty-adjust-btn"
                    >
                        −
                    </button>
                    <span className="cart-qty-value">
                        {quantity}
                    </span>
                    <button
                        disabled={disabledUpdateStock}
                        onClick={onIncrement}
                        className="cart-qty-adjust-btn"
                        style={{ color: "var(--terracotta)" }}
                    >
                        +
                    </button>
                </div>

                {/* Subtotal & Delete Action Wrapper */}
                <div className="flex items-center gap-4">
                    <div className="cart-subtotal-info">
                        <p className="cart-subtotal-label">Subtotal</p>
                        <p className="cart-subtotal-value">
                            {formatRupiah(price.value * quantity)}
                        </p>
                    </div>

                    {/* Delete Button */}
                    <button
                        onClick={onRemove}
                        className="cart-item-remove-btn"
                        title="Hapus item"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

            </div>

        </div>
    );
};