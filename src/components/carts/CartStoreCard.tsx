import { useRemoveCartItem, useUpdateCartItem } from "@/features/cart/hooks";
import { CartItem } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import Image from "next/image";
import { CartItemCard } from "./CartItemCard";
import { formatRupiah } from "@/lib/curency-format";
import { ShoppingBag, MapPin, ArrowRight } from "lucide-react";

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

        const store = selectedItems[0].store
        

        const items = selectedItems.map(item => {
            return {
                id: item.id,
                product: {
                    id: item.product.id,
                    name: item.product.name,
                    thumbnail: item.product.thumbnail,
                    price:item.product.price
                },
                variant: item.variant ? {
                    id: item.variant.id,
                    name: item.variant.name,
                    thumbnail: item.variant.thumbnail,
                    price:item.variant.price
                } : null,
                quantity: item.quantity,
                subtotal: item.subtotal
            }
        })

        const saveLocal = {
            store:{
                id:store.id,
                name: store.name,
                slug: store.slug,
                logo_url: store.logo_url,
                qris_url: store.qris_url,
                address: store.address,
                village_id: store.village_id,
                district_id:store.district_id,
                regency_id: store.regency_id,
                description:store.description
            },
            items
        }

        localStorage.setItem("checkout_items", JSON.stringify(saveLocal));

        router.push("/checkout?store=" + storeId);
    }

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
                {items.map((item, index) => (
                    <CartItemCard
                        key={index}
                        title={item.product.name}
                        variant={item.variant?.name || 'Tanpa Variant'}
                        price={item.variant?.price || item.product.price}
                        quantity={item.quantity}
                        disabledUpdateStock={isPending}
                        media={item.product.thumbnail.media_url}
                        onIncrement={() => handleQuantityChange(item, +1)}
                        onDecrement={() => handleQuantityChange(item, -1)}
                        onRemove={() => removeItem(item.id)}
                        isChecked={itemChecked[index]}
                        onCheck={() => handleItemCheckboxChange(index)}
                    />
                ))}
            </div>

            {/* Footer — Subtotal & Checkout CTA */}
            <div className="cart-store-footer">
                {/* Subtotal */}
                <div>
                    <p className="cart-store-subtotal-title">
                        Subtotal produk dipilih
                    </p>
                    <p className="cart-store-subtotal-value">
                        {formatRupiah(selectedItems.reduce((acc, item) => acc + (item.variant?.price.value || item.product.price.value) * item.quantity, 0))}
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