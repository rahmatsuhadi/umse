export default function ProductSkeletonCard() {
    return (
        <div className="product-card-lg h-full flex flex-col">
            {/* Skeleton untuk Gambar */}
            <div className="product-img-lg flex items-center justify-center relative">
                <div className="w-full h-full bg-gray-200 animate-pulse"></div>
            </div>

            {/* Skeleton untuk Konten */}
            <div className="product-body-lg flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                    {/* Skeleton untuk Kategori */}
                    <div className="w-16 h-4 bg-gray-200 rounded-full animate-pulse"></div>

                    {/* Skeleton untuk Rating */}
                    <div className="flex items-center text-yellow-300">
                        <i className="fas fa-star text-xs"></i>
                        <div className="ml-1 w-12 h-3 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                </div>

                {/* Skeleton untuk Nama Produk */}
                <div className="w-3/4 h-5 bg-gray-200 rounded-md animate-pulse mb-1"></div>

                {/* Skeleton untuk Nama Toko */}
                <div className="w-1/2 h-3 bg-gray-200 rounded-full animate-pulse mb-1"></div>

                <div className="product-actions-lg mt-auto p-0">
                    {/* Skeleton untuk Harga */}
                    <div className="price-col">
                        <div className="w-24 h-6 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                        <div className="w-16 h-3 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>

                    {/* Skeleton untuk Button */}
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}