
export default function ProductSkeletonCard(){
    return(
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 group h-full flex flex-col">
            {/* Skeleton untuk Gambar */}
            <div className="bg-gray-300 h-40 md:h-48 flex items-center justify-center relative">
                <div className="w-full h-full bg-gray-400 animate-pulse"></div>
            </div>

            {/* Skeleton untuk Konten */}
            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                    {/* Skeleton untuk Kategori */}
                    <div className="w-16 h-4 bg-gray-300 rounded-full animate-pulse"></div>

                    {/* Skeleton untuk Rating */}
                    <div className="flex items-center text-yellow-400">
                        <i className="fas fa-star text-xs"></i>
                        <div className="ml-1 w-12 h-3 bg-gray-300 rounded-full animate-pulse"></div>
                    </div>
                </div>

                {/* Skeleton untuk Nama Produk */}
                <div className="w-3/4 h-5 bg-gray-300 rounded-md animate-pulse mb-1"></div>

                {/* Skeleton untuk Nama Toko */}
                <div className="w-1/2 h-3 bg-gray-300 rounded-full animate-pulse mb-1"></div>

                {/* Skeleton untuk Alamat Toko */}
                <div className="w-3/4 h-3 bg-gray-300 rounded-full animate-pulse mb-3"></div>

                <div className="flex items-center justify-between mt-auto">
                    {/* Skeleton untuk Harga */}
                    <div>
                        <div className="w-24 h-6 bg-gray-300 rounded-md animate-pulse mb-2"></div>
                        <div className="w-16 h-3 bg-gray-300 rounded-full animate-pulse"></div>
                    </div>

                    {/* Skeleton untuk Button */}
                    <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}