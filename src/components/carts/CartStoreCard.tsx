import { useRemoveCartItem, useUpdateCartItem } from "@/features/cart/hooks";
import { CartItem } from "@/types";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Checkbox } from "../ui/checkbox";
import Image from "next/image";
import { CartItemCard } from "./CartItemCard";
import { formatRupiah } from "@/lib/curency-format";
import { ShoppingBag, MapPin, ArrowRight, AlertTriangle, Package, Wrench } from "lucide-react";
import { getComputedPrice } from "@/lib/price-helper";
import { hasMixedOrderItems, isGoodsItem, isServiceItem } from "@/lib/product-helper";
import { toast } from "sonner";

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

    // Hitung jumlah barang fisik dan layanan jasa di toko ini
    const goodsCount = useMemo(() => items.filter((item) => isGoodsItem(item)).length, [items]);
    const serviceCount = useMemo(() => items.filter((item) => isServiceItem(item)).length, [items]);
    const isStoreMixed = goodsCount > 0 && serviceCount > 0;

    // Cek apakah item yang saat ini dipilih memuat campuran barang dan jasa
    const hasMixedSelection = useMemo(() => hasMixedOrderItems(selectedItems), [selectedItems]);

    // Helper untuk memilih hanya barang fisik
    const handleSelectGoodsOnly = () => {
        const updated = items.map((item) => isGoodsItem(item));
        setItemChecked(updated);
        setIsStoreChecked(goodsCount === items.length);
        toast.info(`Memilih semua produk barang (${goodsCount} item).`);
    };

    // Helper untuk memilih hanya layanan jasa
    const handleSelectServicesOnly = () => {
        const updated = items.map((item) => isServiceItem(item));
        setItemChecked(updated);
        setIsStoreChecked(serviceCount === items.length);
        toast.info(`Memilih semua layanan jasa (${serviceCount} item).`);
    };

    // Mengubah status checkbox store dan checkbox item
    const handleStoreCheckboxChange = (checked: boolean) => {
        setIsStoreChecked(checked);
        setItemChecked(new Array(items.length).fill(checked)); // Menyinkronkan status checkbox item dengan checkbox store
        if (checked && isStoreMixed) {
            toast.warning(
                "Toko ini memuat barang dan jasa. Keduanya tidak dapat di-checkout bersamaan dalam satu pesanan."
            );
        }
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

        // Validasi: Jenis barang dan jasa tidak bisa di-checkout dalam satu order
        if (hasMixedSelection) {
            toast.error(
                "Jenis barang dan jasa tidak bisa di-checkout dalam satu order. Silakan pilih hanya produk barang atau hanya layanan jasa."
            );
            return;
        }

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

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="cart-store-name">
                                    {storeName}
                                </h3>
                                <span className="cart-store-badge">
                                    <ShoppingBag className="w-2.5 h-2.5 mr-1" />
                                    {items.length} produk
                                </span>
                            </div>

                            {/* Quick selection chips jika toko memiliki barang dan jasa */}
                            {isStoreMixed && (
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[10px] text-gray-400 font-medium hidden sm:inline">Pilih:</span>
                                    <button
                                        type="button"
                                        onClick={handleSelectGoodsOnly}
                                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 transition-colors"
                                        title="Pilih hanya produk barang dari toko ini"
                                    >
                                        <Package className="w-3 h-3 text-orange-600" />
                                        Barang ({goodsCount})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSelectServicesOnly}
                                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors"
                                        title="Pilih hanya layanan jasa dari toko ini"
                                    >
                                        <Wrench className="w-3 h-3 text-purple-600" />
                                        Jasa ({serviceCount})
                                    </button>
                                </div>
                            )}
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

            {/* Peringatan jika pengguna memilih kombinasi Barang dan Jasa */}
            {hasMixedSelection && (
                <div className="mx-4 mb-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs">
                    <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="font-bold text-amber-950">
                                Barang & Jasa Tidak Bisa Di-checkout Bersamaan
                            </p>
                            <p className="text-amber-800 mt-0.5 leading-relaxed text-[11px]">
                                Pesanan Anda memuat produk fisik dan layanan jasa sekaligus. Karena perbedaan alur transaksi & kurir pengiriman, silakan pilih salah satu jenis untuk checkout:
                            </p>
                            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                                <button
                                    type="button"
                                    onClick={handleSelectGoodsOnly}
                                    className="px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px] transition-colors flex items-center gap-1 shadow-sm"
                                >
                                    <Package className="w-3 h-3" />
                                    Pilih Barang Saja ({goodsCount})
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSelectServicesOnly}
                                    className="px-2.5 py-1 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-[11px] transition-colors flex items-center gap-1 shadow-sm"
                                >
                                    <Wrench className="w-3 h-3" />
                                    Pilih Jasa Saja ({serviceCount})
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                    disabled={selectedItems.length === 0 || hasMixedSelection}
                    onClick={onCheckout}
                    className="cart-checkout-btn disabled:opacity-50 disabled:cursor-not-allowed"
                    title={hasMixedSelection ? "Barang dan Jasa tidak dapat di-checkout dalam satu order" : undefined}
                >
                    Checkout Toko Ini
                    <ArrowRight className="w-4 h-4" />
                </button>
                
            </div>
        </div>
    );
};