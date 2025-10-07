import { Product } from "@/types";
import { useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";


interface CardProductProps {
    product: Product
}

export const ProductCard = ({ product }: CardProductProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

    const price = product.variants_exists ? product.lowest_price : product.price;
    
    const priceDisplay =  `Rp ${price.value.toLocaleString()}`


    return (
        <div ref={ref} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 group h-full flex flex-col">
            <div className="bg-gray-300 h-40 md:h-48 flex items-center justify-center relative">
                {isInView && (
                    <Image
                        src={product.thumbnail?.media_url || '/hero/hero.png'}
                        alt={product.name}
                        fill
                        className="absolute inset-0 object-cover"
                        loading="lazy"
                    />
                )}
            </div>
            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                    <span className="bg-orange-100 text-orange-800 text-xs sm:text-xs lg:text-base px-2 py-1 rounded-full flex-shrink-0 max-w-[60%] truncate">
                        {product.category.name}
                    </span>

                    <div className="flex items-center text-yellow-400"><i className="fas fa-star text-xs"></i><span className="text-gray-600 text-xs ml-1">{product.average_rating}</span></div>
                </div>
                <h3 className="font-bold text-gray-800 mb-1 text-sm md:text-base group-hover:text-primary">{product.name}</h3>
                <p className="text-xs text-gray-600 mb-1">{product.store ? product.store.name : "Store"}</p>
                <p className="text-xs text-gray-500 mb-3">{product.store ? product.store.address : "Location"}</p>
                <div className="flex items-center justify-between mt-auto">
                    <div><span className="text-primary font-bold text-sm md:text-lg">{priceDisplay}</span><p className="text-xs text-gray-500">Stok: {product.stock_quantity}</p></div>
                    <button type='button' className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition duration-300"><i className="fas fa-shopping-cart text-sm"></i></button>
                </div>
            </div>
        </div>
    )
}