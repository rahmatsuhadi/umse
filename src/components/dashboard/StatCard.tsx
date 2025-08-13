export default function StatCard() {
    return (
        <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm">Total Pesanan</p>
                        <p className="text-2xl font-bold text-gray-800">12</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                        <i className="fas fa-shopping-bag text-blue-600 text-xl"></i>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm">Dalam Proses</p>
                        <p className="text-2xl font-bold text-gray-800">3</p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                        <i className="fas fa-clock text-yellow-600 text-xl"></i>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm">Selesai</p>
                        <p className="text-2xl font-bold text-gray-800">8</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                        <i className="fas fa-check-circle text-green-600 text-xl"></i>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm">Total Belanja</p>
                        <p className="text-2xl font-bold text-gray-800">1.2M</p>
                    </div>
                    <div className="bg-primary-light p-3 rounded-full">
                        <i className="fas fa-money-bill-wave text-white text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
    )
}