
import { getProductById } from '@/features/products/api';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Image from 'next/image';
import { AnimatedWrapper } from '@/components/shared/AnimateWrapper';
import ContactSection from '@/components/landing/Contact';
import { trimDescription } from '@/lib/seoMetadataUtils';
import Link from 'next/link';
import ProductSimilarProduct from '@/components/products/ProductSimilarList';
import { StarRating } from '@/components/products/ProductStarRating';
import { ProductRatingReview } from '@/components/products/ProductRatingReview';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import { ProductShareModal } from '@/components/products/ProductShareModal';
import ProductCheckoutButton from '@/components/products/ProductCheckoutButton';

const APP_URL = process.env['NEXT_PUBLIC_APP_URL'] || "http://localhost:3000"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const { data: product } = await getProductById(id);

    // Gambar untuk Open Graph dan Twitter Card
    const ogImageUrl = product.media[0]?.media_url || '/assets/no-image.jpg';

    const trimmedDescription = trimDescription(product.description);

    return {
      title: product.name,  // Dinamis berdasarkan produk
      description: trimmedDescription,  // Deskripsi produk
      openGraph: {
        title: product.name,
        description: trimmedDescription,
        url: `${APP_URL}/produk/${product.id}`,  // URL produk
        image: ogImageUrl,
        type: 'website',  // Menunjukkan bahwa ini adalah halaman produk
      },
      twitter: {
        title: product.name,
        description: trimmedDescription,
        image: ogImageUrl,
        card: 'summary_large_image',  // Format Twitter Card yang besar
      },
    };
  } catch (error) {
    console.log(error);
    return {
      title: 'Produk Tidak Ditemukan',
      description: 'Halaman yang Anda cari tidak ada.',
    };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {

  const id = (await params).id;

  let product;
  try {
    const response = await getProductById(id);
    product = response.data;
  } catch (error) {

    if (error instanceof Error) {
      console.log(error.message)
    }
    // Jika produk tidak ditemukan (API melempar error), tampilkan halaman not-found
    notFound();
  }

  const totalReviews = Object.values(product.rating_count).reduce((sum, count) => sum + count, 0);
  const images = product.media.map((item) => item.media_url)


  return (
    <div className="bg-gray-50">
      <Breadcrumb breadcrumbs={[
        { name: "Beranda", link: "/" },
        { name: product.name, active: true }
      ]} />


      {/* ===== Product Detail Section ===== */}
      <section className="py-4 sm:py-8  md:px-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-12">

            {/* Product Images */}
            <ProductImageGallery images={images} />

            {/* Product Information */}
            <div>
              <div className="mb-4">
                <span className="bg-orange-100 text-orange-800 text-xs sm:text-sm px-3 py-1 rounded-full">
                  {product.category.name}
                </span>
                <div className="mt-2">
                  <StarRating rating={Number(product.average_rating)} count={totalReviews} />
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>


              <div className="flex flex-wrap items-baseline mb-6 gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-primary">{product.price.formatted}</span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-start sm:items-center mb-3">
                  <div className="bg-primary rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mr-3 flex-shrink-0">
                    {/* <i className="fas fa-store text-white text-sm sm:text-base"></i> */}
                    <Image src={product.store.logo_url} className='rounded-full' alt='store-img' width={200} height={200} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={"/store/" + product.store.id} className='hover:underline hover:cursor-pointer'>
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base">{product.store.name}</h3>
                    </Link>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <i className="fas fa-map-marker-alt mr-1 flex-shrink-0"></i>

                      <span className="truncate w-48 sm:w-full">{product.store.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3 text-base sm:text-lg">Detail Produk</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex flex-col sm:flex-row"><span className="text-gray-600 sm:w-24 font-medium">Variant:</span><span className="sm:ml-2">{`${product.variants.length==0 ? "Tidak ada" : product.variants.length} Variant `}</span></div>
                  <div className="flex flex-col sm:flex-row"><span className="text-gray-600 sm:w-24 font-medium">Status:</span><span className="sm:ml-2">{product.stock_status == "in_stock" ? "Tersedia" : "Tidak tersedia"}</span></div>
                  <div className="flex flex-col sm:flex-row"><span className="text-gray-600 sm:w-24 font-medium">Kategori:</span><span className="sm:ml-2">{product.category.name}</span></div>
                  <div className="flex flex-col sm:flex-row"><span className="text-gray-600 sm:w-24 font-medium">Stok:</span><span className="text-green-600 font-medium sm:ml-2">{product.stock_quantity} tersedia</span></div>
                </div>
              </div>
              <ProductCheckoutButton product={product}/>

              {/* Product Description */}
              <div className="mb-8 mt-3">
                <h3 className="font-bold text-gray-800 mb-3 text-base sm:text-lg">Deskripsi Produk</h3>
                <div className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  <p className="mb-3">{product.description}</p>
                </div>
              </div>
              <div className="mt-2"> <ProductShareModal productName={product.name} productUrl={APP_URL + "/produk/" + product.id} /></div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-6 sm:py-8 bg-white md-px-10">
        <div className="container mx-auto px-4">

          <ProductRatingReview product={product}  />


        </div>
      </section>


      <section className="py-8 sm:py-12 bg-gray-50  md:px-10">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">Produk Serupa</h2>
          <ProductSimilarProduct category_slug={product.category.slug} />
        </div>
      </section>


      <AnimatedWrapper>
        <ContactSection />
      </AnimatedWrapper>

    </div>
  );
}