export default function Pagination() {
    return (
        <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2">
                <button
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                    <i className="fas fa-chevron-left"></i>
                </button>
                <button className="px-4 py-2 bg-primary text-white rounded-lg">
                    1
                </button>
                <button
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                    2
                </button>
                <button
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                    3
                </button>
                <button
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    )
}