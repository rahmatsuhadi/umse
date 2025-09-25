import { useRemoveCartItem, useUpdateCartItem } from "@/features/cart/hooks";
import { CartItem } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import Image from "next/image";
import { CartItemCard } from "./CartItemCard";
import { formatRupiah } from "@/lib/curency-format";

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
        <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center">
                    <Checkbox
                        onCheckedChange={(checked: boolean) => handleStoreCheckboxChange(checked)} // Menangani perubahan checkbox store
                        checked={isStoreChecked} // Status checkbox store
                        className="mr-3 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                    />
                    <div className="bg-primary rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center mr-3">
                        {/* <i className="fas fa-store text-white text-sm sm:text-base"></i> */}
                        <Image src={img} className='rounded-full' alt='store-img' width={200} height={200} />

                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-sm sm:text-base">{storeName}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">{storeLocation}</p>
                    </div>
                </div>
                {/* <div className="flex items-center text-xs sm:text-sm text-gray-600 ml-auto sm:ml-0">
                    <i className="fas fa-truck mr-1"></i>
                    <span>Ongkir: Rp {shipping}</span>
                </div> */}
            </div>

            <div className="p-4 sm:p-6">
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
                        isChecked={itemChecked[index]} // Mengatur status checkbox item
                        onCheck={() => handleItemCheckboxChange(index)} // Menangani perubahan checkbox item
                    />
                ))}

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 space-y-3 sm:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                        <span className="text-xs sm:text-sm text-gray-600">Subtotal Produk: {formatRupiah(selectedItems.reduce((acc, item) => acc + (item.variant?.price.value || item.product.price.value) * item.quantity, 0))}</span>
                        {/* <span className="text-xs sm:text-sm text-gray-600">Ongkir: Rp {shipping}</span> */}
                    </div>
                    <div className="text-left sm:text-right">
                        {/* <p className="text-base sm:text-lg font-bold text-gray-800">Total: Rp {items.reduce((acc, item) => acc + item.price * item.quantity, 0) + shipping}</p> */}
                        {/* <Link href={"/checkout"}> */}
                        <button type="button" disabled={selectedItems.length == 0} onClick={onCheckout} className="bg-primary disabled:bg-primary/50 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-primary-dark transition duration-300 mt-2 text-sm sm:text-base w-full sm:w-auto">
                            <i className="fas fa-shopping-cart mr-2"></i>Checkout Toko Ini
                        </button>
                        {/* </Link> */}
                    </div>
                </div>
            </div>
        </div>
    );
};