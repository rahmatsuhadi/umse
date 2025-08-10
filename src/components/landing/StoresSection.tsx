
const umkmPartners = [{ name: "Toko Cemilan Sleman", category: "Makanan & Minuman", location: "Jl. Magelang KM 5", rating: 4.5, productCount: 25 }, { name: "Batik Sleman Asri", category: "Fashion & Aksesoris", location: "Jl. Kaliurang KM 7", rating: 4.8, productCount: 18 }, { name: "Craft Sleman Studio", category: "Kerajinan Tangan", location: "Jl. Seturan Raya", rating: 4.9, productCount: 32 }, { name: "Natural Sleman Care", category: "Kecantikan & Kesehatan", location: "Jl. Palagan Tentara Pelajar", rating: 4.6, productCount: 15 }];

export default function StoresSection(){
    return(
        <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {umkmPartners.map((store) => (
              <div key={store.name} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition duration-300">
                <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-store text-white text-xl"></i>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{store.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{store.category}</p>
                <p className="text-xs text-gray-500">{store.location}</p>
                <div className="flex items-center justify-center mt-3">
                  <div className="flex items-center text-yellow-400 mr-2">
                    <i className="fas fa-star text-xs"></i>
                    <span className="text-gray-600 text-xs ml-1">{store.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">{store.productCount} Produk</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="/directory" className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary-dark transition duration-300">
              <i className="fas fa-building mr-2"></i>Lihat Semua Toko UMKM
            </a>
          </div>
        </div>
      </section>
    )
}