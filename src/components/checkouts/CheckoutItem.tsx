import { CartItem } from "@/types";
import Image from "next/image";

export default function CheckoutItemCard({ item }: { item: CartItem }) {
    return (
        <div
            className="flex items-center bg-gray-50 rounded-lg p-4"
        >
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                <Image
                    className="w-full h-full object-cover rounded-lg"
                    src={item.variant ? item.variant.thumbnail.media_url : item.product.thumbnail.media_url}
                    width={100}  // Atur lebar sesuai keinginan
                    height={100} // Atur tinggi sesuai keinginan
                    alt={item.product.name}
                />
            </div>
            <div className="flex-1">
                <h5 className="font-medium text-gray-800">{item.variant?.name ?? item.product.name}</h5>
                <p className="text-sm text-gray-600">
                    Varian: {item.variant ? item.variant.name : "-"}
                </p>
                <p className="text-sm text-primary font-bold mt-1">
                    {item.variant ? item.variant.price.formatted : item.product.price.formatted} x {item.quantity}
                </p>
            </div>
            <div className="text-right">
                <p className="font-bold text-gray-800">
                    Rp {((item.variant ? item.variant.price.value : item.product.price.value) * item.quantity).toLocaleString()}
                </p>
            </div>
        </div>
    )
}