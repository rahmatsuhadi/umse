import Link from "next/link";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { useRouter } from "next/navigation";



interface CartItemProps {
    title: string;
    variant: string;
    price: number;
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
    onRemove: () => void;
    isChecked: boolean;  // Tambahkan ini untuk mengontrol status checkbox
    onCheck: () => void; // Fungsi untuk mengubah status checkbox item
}

export const CartItem = ({
    title,
    variant,
    price,
    quantity,
    onIncrement,
    onDecrement,
    onRemove,
    isChecked, // Status checkbox
    onCheck, // Fungsi untuk toggle checkbox
}: CartItemProps) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-gray-100 space-y-4 sm:space-y-0">
        <div className="flex items-start sm:items-center">
            <Checkbox
                checked={isChecked}
                onCheckedChange={onCheck} // Mengubah status checkbox item
                className="mr-3 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
            />
            <div className="bg-gray-200 rounded w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                <i className="fas fa-image text-gray-400"></i>
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-800 text-sm sm:text-base">{title}</h4>
                <p className="text-xs sm:text-sm text-gray-600">Varian: {variant}</p>
                <p className="text-primary font-bold text-sm sm:text-base">Rp {price}</p>
            </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
            <div className="flex items-center border border-gray-300 rounded">
                <button className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100" onClick={onDecrement}>
                    <i className="fas fa-minus text-xs sm:text-sm"></i>
                </button>
                <span className="px-3 sm:px-4 py-1 text-center text-sm">{quantity}</span>
                <button className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100" onClick={onIncrement}>
                    <i className="fas fa-plus text-xs sm:text-sm"></i>
                </button>
            </div>
            <div className="text-right">
                <p className="font-bold text-gray-800 text-sm sm:text-base">Rp {price * quantity}</p>
            </div>
            <button className="text-red-500 hover:text-red-700" onClick={onRemove}>
                <i className="fas fa-trash text-sm"></i>
            </button>
        </div>
    </div>
);

interface StoreCartItemProps {
    storeName: string;
    storeLocation: string;
    shipping: number;
    items: {
        title: string;
        variant: string;
        price: number;
        quantity: number;
    }[];
    onItemIncrement: (index: number) => void;
    onItemDecrement: (index: number) => void;
    onItemRemove: (index: number) => void;
}


export const StoreCartItem = ({
    storeName,
    storeLocation,
    shipping,
    items,
    onItemIncrement,
    onItemDecrement,
    onItemRemove,
}: StoreCartItemProps) => {
    const [isStoreChecked, setIsStoreChecked] = useState(false); // State untuk checkbox store
    const [itemChecked, setItemChecked] = useState<boolean[]>(new Array(items.length).fill(false)); // State untuk checkbox item

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

    const router = useRouter();

    const onCheckout = () => {
        // Logika checkout untuk toko ini
        router.push("/pembayaran");
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
                        <i className="fas fa-store text-white text-sm sm:text-base"></i>
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
                    <CartItem
                        key={index}
                        title={item.title}
                        variant={item.variant}
                        price={item.price}
                        quantity={item.quantity}
                        onIncrement={() => onItemIncrement(index)}
                        onDecrement={() => onItemDecrement(index)}
                        onRemove={() => onItemRemove(index)}
                        isChecked={itemChecked[index]} // Mengatur status checkbox item
                        onCheck={() => handleItemCheckboxChange(index)} // Menangani perubahan checkbox item
                    />
                ))}

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 space-y-3 sm:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                        <span className="text-xs sm:text-sm text-gray-600">Subtotal Produk: Rp {items.reduce((acc, item) => acc + item.price * item.quantity, 0)}</span>
                        <span className="text-xs sm:text-sm text-gray-600">Ongkir: Rp {shipping}</span>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="text-base sm:text-lg font-bold text-gray-800">Total: Rp {items.reduce((acc, item) => acc + item.price * item.quantity, 0) + shipping}</p>
                        {/* <Link href={"/checkout"}> */}
                            <button type="button" disabled={itemChecked.length==0} onClick={onCheckout} className="bg-primary text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-primary-dark transition duration-300 mt-2 text-sm sm:text-base w-full sm:w-auto">
                                <i className="fas fa-shopping-cart mr-2"></i>Checkout Toko Ini
                            </button>
                        {/* </Link> */}
                    </div>
                </div>
            </div>
        </div>
    );
};