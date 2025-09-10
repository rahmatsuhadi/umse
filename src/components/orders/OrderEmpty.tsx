export default function OrderEmpty() {
    return (
        <div
            className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center"
        >
            <i
                className="fas fa-shopping-bag text-4xl sm:text-6xl text-gray-300 mb-4"
            ></i>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                Belum Ada Pesanan
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-6">
                Anda belum memiliki pesanan dengan filter yang dipilih
            </p>
            <a
                href="products.html"
                className="bg-primary text-white px-4 sm:px-6 py-3 rounded-md hover:bg-primary-dark transition duration-300 text-sm sm:text-base"
            >
                <i className="fas fa-shopping-bag mr-2"></i>Mulai Belanja
            </a>
        </div>
    )
}