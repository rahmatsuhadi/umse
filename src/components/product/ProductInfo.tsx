import { Badge } from "@/components/ui/badge";
import { FaLocationDot } from "react-icons/fa6";

// Kita tidak lagi memerlukan 'use client' karena komponen ini menjadi lebih statis
// dan tidak mengelola state seperti kuantitas.

interface Product{
  id: string;
  name: string;
  seller: string;
  price: number;
  stock: number;
  location: string;
}

export default function ProductInfo({ product }: { product: Product }) {
  // Format harga ke Rupiah
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(product.price);

  return (
    // Menggunakan flexbox vertikal dengan jarak antar elemen
    <div className="flex flex-col space-y-4">

      {/* Judul Produk */}
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
        {product.name}
      </h1>

      {/* Harga Produk */}
      <p className="text-2xl md:text-3xl font-bold text-green-500">
        {formattedPrice}
      </p>

      {/* Info Penjual dan Lokasi */}
      <div>
        <p className="text-lg font-medium text-slate-800">{product.seller}</p>
        <div className="flex items-center mt-2 text-slate-500">
          <FaLocationDot className="h-4 w-4 mr-2 flex-shrink-0 text-red-600" />
          <span className="text-sm">{product.location || 'Jl. Parasamya No.6, Beran, Tridadi, Sleman'}</span>
        </div>
      </div>

      {/* Badge/Tag Info */}
      <div className="flex items-center gap-2 pt-2">
         <h4 className="font-semibold border-b border-primary text-primary">Detail</h4>
        <h4 className="font-semibold">Info Penting</h4>
      </div>

      {/* Deskripsi Singkat Produk */}
      <div className="pt-2 text-slate-600 leading-relaxed space-y-4">
        <p>
         {` It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`}
        </p>
        <p>
          {`Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.`}
        </p>
      </div>

      {/* Link Lihat Selengkapnya */}
      <div className="pt-2">
        <button className="text-primary font-semibold hover:underline">
          Lihat selengkapnya
        </button>
      </div>

    </div>
  );
}