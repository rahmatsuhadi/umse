export default function OrderList() {
    return (
        <div className="min-w-[60%]">
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Pesanan Terbaru</h2>
                        <a
                            href="orders.html"
                            className="text-primary hover:underline text-sm"
                        >
                            Lihat Semua <i className="fas fa-arrow-right ml-1"></i>
                        </a>
                    </div>
                </div>

                <div className="divide-y divide-gray-200">

                    {[1, 1, 1, 1].map((_, index) => (
                        <OrderCard key={index} />
                    ))}


                </div>
            </div>
        </div>
    )
}



export function OrderCard() {
    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <div
                        className="bg-gray-300 w-12 h-12 rounded-lg flex items-center justify-center"
                    >
                        <i className="fas fa-image text-gray-500"></i>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-800">
                            Gula Aren Organik
                        </h3>
                        <p className="text-sm text-gray-600">Aren Murni Sleman</p>
                        <p className="text-sm text-primary font-medium">
                            Rp 25.000 x 3
                        </p>
                    </div>
                </div>
                <span
                    className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                >
                    Selesai
                </span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">#SLM239995</span>
                <button className="text-primary hover:underline text-sm">
                    Beri Ulasan
                </button>
            </div>
        </div>
    );
}