import { Store } from "@/types";
import Image from "next/image";
interface StoreCardProps {
    store: Store
}

export function StoreCard({ store }: StoreCardProps) {
    return (
        <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition duration-300">
            <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Image
                    className="rounded-full"
                    src={store.logo_url}
                    alt="logo-store"
                    width={100}
                    height={100}
                />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">{store.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{store.brand_name}</p>
            <p className="text-xs text-gray-500">{store.address}</p>
            <div className="flex items-center justify-center mt-3">
                <div className="flex items-center text-yellow-400 mr-2">
                    <i className="fas fa-star text-xs"></i>
                    <span className="text-gray-600 text-xs ml-1">
                        {store.average_rating}
                    </span>
                </div>
                <span className="text-xs text-gray-500">
                    {store.products_count} Produk
                </span>
            </div>
        </div>
    )
}