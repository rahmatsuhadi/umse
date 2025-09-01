export default function LiteracyFilter() {
    return (
        <section className="py-6 bg-white border-b">
            <div className="container mx-auto px-4">
                <div
                    className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
                >
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700 font-medium">Filter:</span>
                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option>Semua Kategori</option>
                            <option>Panduan Bisnis</option>
                            <option>Tips & Trik</option>
                            <option>Regulasi</option>
                            <option>Teknologi</option>
                            <option>Inspirasi</option>
                        </select>
                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option>Semua Level</option>
                            <option>Pemula</option>
                            <option>Menengah</option>
                            <option>Lanjutan</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700 font-medium">Urutkan:</span>
                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option>Terbaru</option>
                            <option>Terpopuler</option>
                            <option>Paling Banyak Dibaca</option>
                            <option>A-Z</option>
                        </select>
                    </div>
                </div>
            </div>
        </section>
    )
}