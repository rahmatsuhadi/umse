import { Product } from "@/types";


export function generateManualDescription(product: Product): string {
  // Contoh kalimat pembuka yang hangat dan ramah
  const opening = `Temukan kemudahan dan kenyamanan dengan produk "${product.name}" dari Sleman Mart.`;

  // Highlight manfaat produk, bisa ambil dari deskripsi tapi disesuaikan
  // Misalnya, ambil kalimat pertama dari deskripsi asli sebagai gambaran manfaat
  const benefit = product.description
    ? product.description.split('. ')[0] + '.'
    : "Produk ini dibuat khusus untuk memenuhi kebutuhan Anda dengan kualitas terbaik.";

  // Ajakan yang sopan dan menenangkan
  const callToAction = `Pesan sekarang dan rasakan sendiri bagaimana produk ini membantu kehidupan sehari-hari Anda menjadi lebih mudah dan menyenangkan.`;

  // Tambahkan harga jika ada (opsional)
  const priceInfo = product.price
    ? `Hanya dengan harga Rp${product.price.value.toLocaleString("id-ID")}, dapatkan manfaat luar biasa ini.`
    : '';

  // Gabungkan semuanya jadi deskripsi yang ramah dan informatif
  return `${opening} ${benefit} ${priceInfo} ${callToAction}`;
}
