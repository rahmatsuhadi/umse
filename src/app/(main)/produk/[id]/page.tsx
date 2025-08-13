'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/layout/Footer';
import { Navbar3 } from '@/components/shared/Navbar';
import Breadcrumb from '@/components/shared/Breadcrumb';
import ImageGallery from '@/components/product/ImageGallery';
import ActionCartOrBuy from '@/components/product/ActionCartOrBuy';
import { CardRating, ReviewCard, StarRating } from '@/components/product/ReviewCard';
import ProductSectionHorizontal from '@/components/product/ProductsSectionHorizontal';

// Komponen kecil untuk menampilkan bintang rating



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
      { id: 1, userInitial: 'S', userName: 'Sari Wulandari', rating: 5, date: '2 hari yang lalu', text: 'Enak banget! Keripik tempenya renyah dan bumbunya meresap sampai dalam. Anak-anak suka banget, langsung habis sehari beli. Pasti bakal order lagi!', helpfulCount: 12, variant: 'Original', quantity: 2, images: [1, 2], video: { duration: '0:15' }, sellerReply: { name: 'Toko Cemilan Sleman', text: 'Terima kasih banyak atas reviewnya Bu Sari! 😊 Ditunggu orderan berikutnya ya!', date: '1 hari yang lalu' } },
      { id: 2, userInitial: 'A', userName: 'Ahmad Suprapto', rating: 5, date: '5 hari yang lalu', text: 'Packaging rapi, pengiriman cepat. Rasanya mantap, tidak terlalu asin dan tidak terlalu hambar. Cocok untuk oleh-oleh juga. Recommended!', helpfulCount: 8, variant: 'Original', quantity: 3, images: [1, 2], video: null, sellerReply: { name: 'Toko Cemilan Sleman', text: 'Terima kasih Pak Ahmad atas kepercayaannya! Kami memang selalu memperhatikan packaging agar produk sampai dalam kondisi baik.', date: '4 hari yang lalu' } },
    ]
  },
  relatedProducts: Array.from({ length: 4 }, (_, i) => ({ id: i, name: `Produk Terkait ${i + 1}`, price: 12000 + (i * 1000), rating: 4.3 + (i * 0.1), category: 'Makanan' }))
};



export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // State untuk kuantitas dan gambar


  return (
    <div className="bg-gray-50">
      {/* ===== Header ===== */}
      <Navbar3 />

      {/* ===== Breadcrumb ===== */}
      <Breadcrumb productData={productData} />

      {/* ===== Product Detail Section ===== */}
      <section className="py-4 sm:py-8  md:px-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-12">

            {/* Product Images */}
            <ImageGallery images={[
              "https://d39wptbp5at4nd.cloudfront.net/media/69598_original_produk_unggulan_1.jpg",
              "https://www.laptopbekasmalang.com/wp-content/uploads/2022/01/pc-core-i5-vga-gtx750ti-2.jpeg",
              "https://cdn.rri.co.id/berita/Nunukan/o/1722396180656-gambar_komputer/n4iffrdwgvljkdv.jpeg",
              "https://doran.id/wp-content/uploads/2024/02/pc-1024x538.jpg"
            ]} />

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
                {/* <span className="text-base sm:text-lg text-gray-500 line-through">Rp {productData.originalPrice.toLocaleString('id-ID')}</span> */}
                {/* <span className="bg-red-100 text-red-800 text-xs sm:text-sm px-2 py-1 rounded">Hemat {productData.discount}%</span> */}
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

              <ActionCartOrBuy stock={productData.details.stock} />


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

      {/* <ReviewCard /> */}

      <section className="py-6 sm:py-8 bg-white md-px-10">
        <div className="container mx-auto px-4">

          <CardRating productData={productData} />

          <ReviewCard reviews={productData.reviews.items} />

        </div>
      </section>




      {/* ================================== */}
      {/* BAGIAN BARU: Ulasan Pembeli        */}
      {/* ================================== */}



      {/* ================================== */}
      {/* BAGIAN BARU: Produk Serupa         */}
      {/* ================================== */}


      <section className="py-8 sm:py-12 bg-gray-50  md:px-10">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">Produk Serupa</h2>
                <ProductSectionHorizontal relatedProducts={
            [
              { category: "Makanan", id: 1, name: "Browseer", price: 1000, rating: 4.5 },
              { category: "Makanan", id: 2, name: "Browseer", price: 1000, rating: 4.5 },
              { category: "Makanan", id: 9, name: "Browseer", price: 1000, rating: 4.5 },
            ]
          } />
        </div>
      </section>


      <Footer />

    </div>
  );
}