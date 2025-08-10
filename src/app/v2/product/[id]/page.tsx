'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/layout/Footer';

// Komponen kecil untuk menampilkan bintang rating
const StarRating = ({ rating, count, size = 'sm' }: { rating: number; count?: number, size?: 'xs' | 'sm' | 'base' }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const starSizeClass = `text-${size}`;

  return (
    <div className="flex items-center text-yellow-400">
      {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className={`fas fa-star ${starSizeClass}`}></i>)}
      {halfStar && <i className={`fas fa-star-half-alt ${starSizeClass}`}></i>}
      {[...Array(emptyStars)].map((_, i) => <i key={`far fa-star ${starSizeClass}`}></i>)}
      {count && <span className={`text-gray-600 ml-2 text-${size}`}>{rating.toFixed(1)} ({count} ulasan)</span>}
    </div>
  );
};


// Data Dummy untuk Halaman Produk (di aplikasi nyata, ini diambil dari API)
const productData = {
  category: "Makanan",
  rating: 4.5,
  reviewCount: 127,
  name: "Keripik Tempe Original",
  price: 15000,
  originalPrice: 18000,
  discount: 17,
  store: {
    name: "Toko Cemilan Sleman",
    location: "Jl. Magelang KM 5, Sleman",
    rating: 4.8,
    productCount: 156,
  },
  details: {
    weight: "250 gram",
    condition: "Baru",
    category: "Makanan & Minuman",
    stock: 25,
  },
  description: {
    main: "Keripik Tempe Original yang dibuat dari tempe kedelai pilihan dengan bumbu rahasia yang telah diwariskan turun temurun. Diproses dengan higienis menggunakan teknologi modern namun tetap mempertahankan cita rasa tradisional.",
    features: [
      "100% tempe kedelai asli tanpa pengawet",
      "Renyah dan gurih dengan bumbu meresap sempurna",
      "Dikemas dalam kemasan kedap udara untuk menjaga kerenyahan",
      "Cocok untuk camilan sehat keluarga",
      "Halal dan telah tersertifikasi BPOM",
    ]
  },
  reviews: {
    summary: [
        { stars: 5, percentage: 65, count: 83 },
        { stars: 4, percentage: 25, count: 32 },
        { stars: 3, percentage: 8, count: 10 },
        { stars: 2, percentage: 2, count: 2 },
        { stars: 1, percentage: 0, count: 0 },
    ],
    items: [
        { id: 1, userInitial: 'S', userName: 'Sari Wulandari', rating: 5, date: '2 hari yang lalu', text: 'Enak banget! Keripik tempenya renyah dan bumbunya meresap sampai dalam. Anak-anak suka banget, langsung habis sehari beli. Pasti bakal order lagi!', helpfulCount: 12, variant: 'Original', quantity: 2, images: [1, 2], video: {duration: '0:15'}, sellerReply: {name: 'Toko Cemilan Sleman', text: 'Terima kasih banyak atas reviewnya Bu Sari! 😊 Ditunggu orderan berikutnya ya!', date: '1 hari yang lalu'} },
        { id: 2, userInitial: 'A', userName: 'Ahmad Suprapto', rating: 5, date: '5 hari yang lalu', text: 'Packaging rapi, pengiriman cepat. Rasanya mantap, tidak terlalu asin dan tidak terlalu hambar. Cocok untuk oleh-oleh juga. Recommended!', helpfulCount: 8, variant: 'Original', quantity: 3, images: [1, 2], video: null, sellerReply: {name: 'Toko Cemilan Sleman', text: 'Terima kasih Pak Ahmad atas kepercayaannya! Kami memang selalu memperhatikan packaging agar produk sampai dalam kondisi baik.', date: '4 hari yang lalu'} },
    ]
  },
  relatedProducts: Array.from({length: 4}, (_, i) => ({ id: i, name: `Produk Terkait ${i+1}`, price: 12000 + (i * 1000), rating: 4.3 + (i * 0.1), category: 'Makanan' }))
};



export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // State untuk kuantitas dan gambar
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= productData.details.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="bg-gray-50">
      {/* ===== Header ===== */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Sleman Mart</h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/v2/product" className="text-primary hover:text-primary-dark text-sm sm:text-base flex items-center">
                <i className="fas fa-arrow-left mr-1"></i>
                <span className="hidden sm:inline">Kembali ke Produk</span>
                <span className="sm:hidden">Kembali</span>
              </Link>
              <Link href="/v2/" className="text-primary hover:text-primary-dark text-sm sm:text-base flex items-center">
                <i className="fas fa-home mr-1"></i>
                <span className="hidden sm:inline">Beranda</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ===== Breadcrumb ===== */}
      <nav className="bg-white border-b px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center text-xs sm:text-sm text-gray-600 overflow-x-auto whitespace-nowrap">
            <Link href="/v2/" className="hover:text-primary flex-shrink-0">Beranda</Link>
            <i className="fas fa-chevron-right mx-2 text-gray-400 flex-shrink-0"></i>
            <Link href="/v2/product" className="hover:text-primary flex-shrink-0">Produk</Link>
            <i className="fas fa-chevron-right mx-2 text-gray-400 flex-shrink-0"></i>
            <span className="text-gray-800 truncate">{productData.name}</span>
          </div>
        </div>
      </nav>
      
      {/* ===== Product Detail Section ===== */}
      <section className="py-4 sm:py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-12">
            
            {/* Product Images */}
            <div>
              <div className="bg-gray-300 rounded-lg h-64 sm:h-80 lg:h-96 flex items-center justify-center mb-4">
                <i className="fas fa-image text-gray-500 text-4xl sm:text-6xl"></i>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded h-16 sm:h-20 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition">
                    <i className="fas fa-image text-gray-400 text-sm sm:text-base"></i>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Information */}
            <div>
              <div className="mb-4">
                <span className="bg-orange-100 text-orange-800 text-xs sm:text-sm px-3 py-1 rounded-full">{productData.category}</span>
                <div className="mt-2">
                   <StarRating rating={productData.rating} count={productData.reviewCount} />
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{productData.name}</h1>
              
              <div className="flex flex-wrap items-baseline mb-6 gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-primary">Rp {productData.price.toLocaleString('id-ID')}</span>
                <span className="text-base sm:text-lg text-gray-500 line-through">Rp {productData.originalPrice.toLocaleString('id-ID')}</span>
                <span className="bg-red-100 text-red-800 text-xs sm:text-sm px-2 py-1 rounded">Hemat {productData.discount}%</span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-start sm:items-center mb-3">
                  <div className="bg-primary rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="fas fa-store text-white text-sm sm:text-base"></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base">{productData.store.name}</h3>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <i className="fas fa-map-marker-alt mr-1 flex-shrink-0"></i>
                      <span className="truncate">{productData.store.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm gap-2">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center"><i className="fas fa-star text-yellow-400 mr-1"></i><span>{productData.store.rating} Rating Toko</span></div>
                    <div className="flex items-center"><i className="fas fa-box mr-1"></i><span>{productData.store.productCount} Produk</span></div>
                  </div>
                  <button className="text-primary hover:text-primary-dark font-medium self-start sm:self-auto"><i className="fas fa-eye mr-1"></i>Lihat Toko</button>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3 text-base sm:text-lg">Detail Produk</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex flex-col sm:flex-row"><span className="text-gray-600 sm:w-24 font-medium">Berat:</span><span className="sm:ml-2">{productData.details.weight}</span></div>
                  <div className="flex flex-col sm:flex-row"><span className="text-gray-600 sm:w-24 font-medium">Kondisi:</span><span className="sm:ml-2">{productData.details.condition}</span></div>
                  <div className="flex flex-col sm:flex-row"><span className="text-gray-600 sm:w-24 font-medium">Kategori:</span><span className="sm:ml-2">{productData.details.category}</span></div>
                  <div className="flex flex-col sm:flex-row"><span className="text-gray-600 sm:w-24 font-medium">Stok:</span><span className="text-green-600 font-medium sm:ml-2">{productData.details.stock} tersedia</span></div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-3">
                  <span className="text-gray-700 font-medium">Jumlah:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                    <button className="px-3 py-2 text-gray-600 hover:bg-gray-100" onClick={() => handleQuantityChange(-1)}><i className="fas fa-minus"></i></button>
                    <input type="number" value={quantity} readOnly className="w-16 text-center border-none focus:outline-none bg-transparent" />
                    <button className="px-3 py-2 text-gray-600 hover:bg-gray-100" onClick={() => handleQuantityChange(1)}><i className="fas fa-plus"></i></button>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 bg-primary text-white py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-primary-dark transition"><i className="fas fa-shopping-cart mr-2"></i>Tambah ke Keranjang</button>
                    <button className="flex-1 bg-primary-dark text-white py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-gray-800 transition"><i className="fas fa-bolt mr-2"></i>Beli Sekarang</button>
                  </div>
                  <button className="border border-gray-300 text-gray-600 py-3 px-4 rounded-lg hover:bg-gray-50 self-center sm:self-auto sm:w-fit"><i className="fas fa-heart mr-2"></i><span className="sm:hidden">Favorit</span><span className="hidden sm:inline">Tambah ke Wishlist</span></button>
                </div>
              </div>


              {/* Product Description */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-800 mb-3 text-base sm:text-lg">Deskripsi Produk</h3>
                <div className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  <p className="mb-3">{productData.description.main}</p>
                  <p className="mb-3"><strong>Keunggulan:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-2 sm:ml-4">
                    {productData.description.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================== */}
      {/* BAGIAN BARU: Ulasan Pembeli        */}
      {/* ================================== */}
      <section className="py-6 sm:py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Ulasan Pembeli ({productData.reviewCount})</h2>
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6">
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="text-center mb-4 sm:mb-0 sm:mr-8">
                    <div className="text-3xl sm:text-4xl font-bold text-gray-800">{productData.rating.toFixed(1)}</div>
                    <div className="flex items-center justify-center text-yellow-400 mb-1"><StarRating rating={productData.rating} /></div>
                    <div className="text-xs sm:text-sm text-gray-600">{productData.reviewCount} ulasan</div>
                  </div>
                  <div className="flex-1">
                    <div className="space-y-2">
                      {productData.reviews.summary.map(item => (
                        <div key={item.stars} className="flex items-center text-sm">
                          <span className="w-8 sm:w-12">{item.stars}</span>
                          <i className="fas fa-star text-yellow-400 mr-2"></i>
                          <div className="flex-1 bg-gray-200 rounded-full h-2"><div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div></div>
                          <span className="ml-2 w-6 sm:w-8">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 text-sm sm:text-base">Filter Ulasan</h3>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 sm:px-4 py-2 bg-primary text-white rounded-full text-xs sm:text-sm">Semua</button>
                    <button className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-xs sm:text-sm hover:bg-gray-300">5★ ({productData.reviews.summary[0].count})</button>
                    <button className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-xs sm:text-sm hover:bg-gray-300">4★ ({productData.reviews.summary[1].count})</button>
                    <button className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-xs sm:text-sm hover:bg-gray-300">Dengan Foto (45)</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {productData.reviews.items.map(review => (
              <div key={review.id} className="border-b border-gray-200 pb-6">
                <div className="flex items-start mb-4">
                  <div className="bg-primary rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0"><span className="text-white font-bold text-sm sm:text-base">{review.userInitial}</span></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm sm:text-base">{review.userName}</h4>
                        <div className="flex items-center text-yellow-400 mb-1"><StarRating rating={review.rating} size="xs" /></div>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700 mb-3 text-sm sm:text-base">{review.text}</p>
                    {review.sellerReply && (
                      <div className="bg-orange-50 rounded-lg p-3 sm:p-4 mt-4 ml-4 sm:ml-8">
                        <div className="flex items-start">
                          <div className="bg-primary rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0"><i className="fas fa-store text-white text-xs sm:text-sm"></i></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center mb-2">
                              <span className="font-bold text-gray-800 text-xs sm:text-sm">{review.sellerReply.name}</span>
                              <span className="bg-primary text-white text-xs px-2 py-1 rounded-full sm:ml-2 mt-1 sm:mt-0 self-start">Penjual</span>
                            </div>
                            <p className="text-gray-700 text-xs sm:text-sm">{review.sellerReply.text}</p>
                            <span className="text-xs text-gray-500 mt-2 block">{review.sellerReply.date}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ================================== */}
      {/* BAGIAN BARU: Produk Serupa         */}
      {/* ================================== */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">Produk Serupa</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {productData.relatedProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                <div className="bg-gray-300 h-32 sm:h-40 flex items-center justify-center"><i className="fas fa-image text-gray-500 text-xl sm:text-2xl"></i></div>
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
        </div>
      </section>


      <Footer/>

      {/* ===== Reviews & Related Products Sections... ===== */}
      {/* ... Anda bisa menambahkan bagian Ulasan dan Produk Terkait di sini */}

    </div>
  );
}