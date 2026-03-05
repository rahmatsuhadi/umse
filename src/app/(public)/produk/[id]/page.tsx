import { getProductById } from "@/features/products/api";
import { getDistrictById } from "@/features/locations/api";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import ContactSection from "@/components/landing/Contact";
import { trimDescription } from "@/lib/seoMetadataUtils";
import ProductSimilarProduct from "@/components/products/ProductSimilarList";
import ProductSimilarDistrict from "@/components/products/ProductSimilarDistrict";
import { ProductRatingReview } from "@/components/products/ProductRatingReview";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import { APP_URL } from "@/lib/envConfig";
import { generateManualDescription } from "@/lib/metadata";

const buildSlug = (name: string | undefined, id: string | number | undefined) => {
  if (!name || !id) return "sleman";
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") + `~${id}`;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const { data: product } = await getProductById(id);

    const ogImageUrl =
      product.media.length > 0
        ? product.media[0].media_url
        : "/assets/no-image.jpg";

    const trimmedDescription = trimDescription(product.description);

    return {
      title: product.name,
      description: trimmedDescription,
      openGraph: {
        title: product.name,
        description: generateManualDescription(product),
        url: `${APP_URL}/produk/${product.id}`,
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: product.name }],
        type: "website",
      },
      twitter: {
        title: product.name,
        description: generateManualDescription(product),
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: product.name }],
        card: "summary_large_image",
      },
    };
  } catch (error) {
    console.log(error);
    return {
      title: "Produk Tidak Ditemukan",
      description: "Halaman yang Anda cari tidak ada.",
    };
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  let product;
  try {
    const response = await getProductById(id);
    product = response.data;

    if (product.store?.district_id && !product.store.district) {
      try {
        const districtRes = await getDistrictById(product.store.district_id);
        product.store.district = districtRes.data;
      } catch (districtErr) {
        console.error("Failed to fetch district:", districtErr);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "MAINTENANCE_MODE") {
        redirect("/pemeliharaan");
      }
    }
    notFound();
  }

  const images = product.media.map((item) => item.media_url);
  const mainImage =
    images[0] || product.thumbnail?.media_url || "/assets/no-image.jpg";

  return (
    <div className="page-bg-cream">

      {/* ===== Product Detail Body ===== */}
      <div className="product-detail-body">

        {/* Breadcrumb */}
        <div className="detail-breadcrumb">
          <Link href="/" className="no-underline">
            <span>Beranda</span>
          </Link>
          <span className="sep">›</span>
          <Link href="/produk" className="no-underline">
            <span>Produk</span>
          </Link>
          <span className="sep">›</span>
          <Link href={`/produk?category=${product.category.slug}`} className="no-underline">
            <span>{product.category.name}</span>
          </Link>
          <span className="sep">›</span>
          <span className="current">{product.name}</span>
        </div>


        {/* Main 2-Column Layout */}
        <div className="detail-layout">

          {/* Gallery (Left / Sticky) */}
          <ProductImageGallery images={images} isClosed={!product.store?.is_open} />

          {/* Product Info (Right) — client wrapper holds shared variant/qty state */}
          <ProductDetailClient
            product={product}
            isClosed={!product.store?.is_open}
            mainImage={mainImage}
          />

        </div>
      </div>

      {/* ===== Reviews Section ===== */}
      <div className="product-detail-footer">
        <ProductRatingReview product={product} />
      </div>

      {/* ===== Similar Products Section ===== */}
      <div className="bg-white pt-40">
        <div className="container-1200">
          <div className="flex-between mb-20">
            <h2 className="section-title font-22">
              Produk <span>Serupa</span>
            </h2>
            <Link href="/produk" className="see-all-link">Lihat Semua →</Link>
          </div>
        </div>
        <ProductSimilarProduct category_slug={product.category.slug} />
      </div>

      {/* ===== District Products Section ===== */}
      <div className="bg-white pt-40">
        <div className="container-1200">
          <div className="flex-between mb-20">
            <h2 className="section-title font-22">
              Produk Kapanewon <span>{product.store.district?.name || 'Sleman'}</span>
            </h2>
            <Link href={`/kecamatan/${buildSlug(product.store.district?.name, product.store.district?.id)}`} className="see-all-link">Lihat Semua →</Link>
          </div>
        </div>
        <ProductSimilarDistrict district_id={product.store.district?.id} />
      </div>

      {/* ===== Footer / Contact ===== */}
      <AnimatedWrapper>
        <ContactSection />
      </AnimatedWrapper>


    </div>
  );
}
