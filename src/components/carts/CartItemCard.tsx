import { Price } from "@/types";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import { formatRupiah } from "@/lib/curency-format";

interface CartItemProps {
    title: string;
    variant: string;
    price: Price;
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
    onRemove: () => void;
    isChecked: boolean;  // Tambahkan ini untuk mengontrol status checkbox
    onCheck: () => void; // Fungsi untuk mengubah status checkbox item
    media: string
    disabledUpdateStock:boolean
}

export const CartItemCard = ({
    title,
    disabledUpdateStock,
    variant,
    media,
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
                {/* <i className="fas fa-image text-gray-400"></i> */}
                {/* <Image src={media} width={100} height={100} alt="thumb-product" /> */}
                <Image
                    className="w-full h-full object-cover rounded-lg"
                    src={media}
                    width={100}  // Atur lebar sesuai keinginan
                    height={100} // Atur tinggi sesuai keinginan
                    alt={"thumb-" + title}
                />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-800 text-sm sm:text-base">{title}</h4>
                <p className="text-xs sm:text-sm text-gray-600">Varian: {variant}</p>
                <p className="text-primary font-bold text-sm sm:text-base">{price.formatted}</p>
            </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
            <div className="flex items-center border border-gray-300 rounded">
                <button disabled={disabledUpdateStock} className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100" onClick={onDecrement}>
                    <i className="fas fa-minus text-xs sm:text-sm"></i>
                </button>
                <span className="px-3 sm:px-4 py-1 text-center text-sm">{quantity}</span>
                <button disabled={disabledUpdateStock} className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100" onClick={onIncrement}>
                    <i className="fas fa-plus text-xs sm:text-sm"></i>
                </button>
            </div>
            <div className="text-right">
                <p className="font-bold text-gray-800 text-sm sm:text-base">{formatRupiah(price.value * quantity)}</p>
            </div>
            <button className="text-red-500 hover:text-red-700" onClick={onRemove}>
                <i className="fas fa-trash text-sm"></i>
            </button>
        </div>
    </div>
);