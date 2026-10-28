import { useRemoveCartItem, useUpdateCartItem } from "@/features/cart/hooks";
import { CartItem } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import Image from "next/image";
import { CartItemCard } from "./CartItemCard";
import { formatRupiah } from "@/lib/curency-format";
import { ShoppingBag, MapPin, ArrowRight } from "lucide-react";
import { getComputedPrice } from "@/lib/price-helper";

interface StoreCartItemProps {
    storeName: string;
    storeLocation: string;
    img: string;
    storeId: string;
    items: CartItem[];
}


export const CartStoreCard = ({
    storeName,
    storeId,
    storeLocation,
    img,
    items,
}: StoreCartItemProps) => {
    const router = useRouter();
    const [isStoreChecked, setIsStoreChecked] = useState(false); // State untuk checkbox store
    const [itemChecked, setItemChecked] = useState<boolean[]>(new Array(items.length).fill(false)); // State untuk checkbox item

    const selectedItems = items.filter((_, idx) => itemChecked[idx]);
    const { mutate: updateItem, isPending } = useUpdateCartItem();
    const { mutate: removeItem, } = useRemoveCartItem();

    // Mengubah status checkbox store dan checkbox item
    const handleStoreCheckboxChange = (checked: boolean) => {
        setIsStoreChecked(checked);
        setItemChecked(new Array(items.length).fill(checked)); // Menyinkronkan status checkbox item dengan checkbox store
    };

    // Mengubah status checkbox item dan memperbarui status checkbox store jika perlu
    const handleItemCheckboxChange = (index: number) => {
        const updatedItemChecked = [...itemChecked];
        updatedItemChecked[index] = !updatedItemChecked[index];

        // Jika semua item tercentang, maka centang checkbox store
        setItemChecked(updatedItemChecked);
        setIsStoreChecked(updatedItemChecked.every((checked) => checked));
    };

    const handleQuantityChange = (item: CartItem, amount: number) => {

        const newQuantity = item.quantity + amount;
        if (newQuantity >= 1) {
            updateItem({
                item_id: item.id,
                quantity: amount,
                variant_id: item.variant_id
            });
        } else {
            removeItem(item.id);
        }
    };


    const onCheckout = () => {
        // Logika checkout untuk toko ini

        if (selectedItems.length === 0) return;

        const store = selectedItems[0].store;

        const items = selectedItems.map(item => {
            const itemPrice = getComputedPrice(item.product, item.variant);

            return {
                id: item.id,
                product: {
                    ...item.product,
                    id: item.product.id,
                    name: item.product.name,
                    thumbnail: item.product.thumbnail,
                    price: item.product.price,
                    original_price: item.product.price,
                    discount_percentage: item.product.discount_percentage,
                    discount_price: item.product.discount_price,
                    type: item.product.type,
                    is_food: item.product.is_food,
                    is_ready_to_serve: item.product.is_ready_to_serve,
                    is_frozen: item.product.is_frozen,
                },
                variant: item.variant ? {
                    id: item.variant.id,
                    name: item.variant.name,
                    thumbnail: item.variant.thumbnail,
                    price: item.variant.price,
                    original_price: item.variant.price,
                    discount_percentage: item.variant.discount_percentage,
                    discount_price: item.variant.discount_price,
                } : null,
                quantity: item.quantity,
                subtotal: {
                    amount: String(itemPrice.finalPriceValue * item.quantity * 100),
                    currency: 'IDR' as const,
                    formatted: formatRupiah(itemPrice.finalPriceValue * item.quantity),
                    value: itemPrice.finalPriceValue * item.quantity,
                }
            };
        });

        const saveLocal = {
            store:{
                ...store,
                id:store.id,
                name: store.name,
                slug: store.slug,
                logo_url: store.logo_url,
                qris_url: store.qris_url,
                address: store.address,
                village_id: store.village_id,
                district_id:store.district_id,
                regency_id: store.regency_id,
                description:store.description,
                is_cod: store.is_cod,
                latitude: store.latitude,
                longitude: store.longitude,
            },
            items
        };

        localStorage.setItem("checkout_items", JSON.stringify(saveLocal));

        router.push("/checkout?store=" + storeId);
    };

    return (
        <div className="cart-store-container">
            {/* Top gradient accent bar */}
            <div className="cart-store-header-bar" />

            {/* Store Header */}
            <div className="cart-store-header">
                <div className="cart-store-info">
                    <Checkbox
                        onCheckedChange={(checked: boolean) => handleStoreCheckboxChange(checked)}
                        checked={isStoreChecked}
                        className="flex-shrink-0"
                    />

                    {/* Store Logo */}
                    <div className="cart-store-logo-wrapper">
                        <Image
                            src={img}
                            alt={storeName}
                            width={44}
                            height={44}
                            className="object-cover w-full h-full"
                        />
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="cart-store-name">
                                {storeName}
                            </h3>
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
                    const itemPrice = getComputedPrice(item.product, item.variant);
                    const displayPrice = itemPrice.hasDiscount ? {
                        amount: String(itemPrice.finalPriceValue * 100),
                        currency: 'IDR' as const,
                        formatted: itemPrice.finalPriceFormatted,
                        value: itemPrice.finalPriceValue,
                    } : (item.variant?.price || item.product.price);
                    const originalPrice = itemPrice.hasDiscount ? (item.variant?.price || item.product.price) : undefined;

                    return (
                        <CartItemCard
                            key={index}
                            title={item.product.name}
                            variant={item.variant?.name || 'Tanpa Variant'}
                            price={displayPrice}
                            originalPrice={originalPrice}
                            hasDiscount={itemPrice.hasDiscount}
                            discountPercentage={itemPrice.discountPercentage}
                            quantity={item.quantity}
                            disabledUpdateStock={isPending}
                            media={item.product.thumbnail?.media_url || ''}
                            onIncrement={() => handleQuantityChange(item, +1)}
                            onDecrement={() => handleQuantityChange(item, -1)}
                            onRemove={() => removeItem(item.id)}
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
                    <p className="cart-store-subtotal-title">
                        Subtotal produk dipilih
                    </p>
                    <p className="cart-store-subtotal-value">
                        {formatRupiah(selectedItems.reduce((acc, item) => {
                            const itemPrice = getComputedPrice(item.product, item.variant);
                            return acc + itemPrice.finalPriceValue * item.quantity;
                        }, 0))}
                    </p>
                   
                </div>

                {/* Checkout Button */}
                <button
                    type="button"
                    disabled={selectedItems.length === 0}
                    onClick={onCheckout}
                    className="cart-checkout-btn"
                >
                    Checkout Toko Ini
                    <ArrowRight className="w-4 h-4" />
                </button>
                
            </div>
        </div>
    );
};