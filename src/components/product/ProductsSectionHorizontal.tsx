import Image from "next/image";

export default function ProductSectionHorizontal({ relatedProducts }: { relatedProducts: Array<{ id: number; name: string; price: number; rating: number; category: string }> }) {
    return (

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                    <div className="bg-gray-300 h-32 sm:h-40 flex relative items-center justify-center">

                        {/* <i className="fas fa-image text-gray-500 text-xl sm:text-2xl"></i> */}
                        <Image src={"/hero.png"} layout='fill' objectFit='cover' alt='product' />
                    </div>
                    <div className="p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">{product.category}</span>
                            <div className="flex items-center text-yellow-400"><i className="fas fa-star text-xs"></i><span className="text-gray-600 text-xs ml-1">{product.rating.toFixed(1)}</span></div>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-1 text-xs sm:text-sm line-clamp-2">{product.name}</h3>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-primary font-bold text-xs sm:text-sm">Rp {product.price.toLocaleString('id-ID')}</span>
                            <button className="bg-primary text-white p-1.5 sm:p-2 rounded-lg hover:bg-primary-dark transition duration-300"><i className="fas fa-shopping-cart text-xs"></i></button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}