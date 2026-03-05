"use client";

import { useState, useEffect } from "react";
import type { Price, Product, Variant } from "@/types";
import { useAddToCart } from "@/features/cart/hooks";
import { useUser } from "@/features/auth/hooks";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const buildSlug = (name: string, id: string | number) =>
  String(name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") + `~${id}`;

interface CheckoutButtonProps {
  product: Product;
  isAuth?: boolean;
  isClosed?: boolean;
  onVariantChange?: (variant: Variant | null) => void;
  onQuantityChange?: (quantity: number) => void;
}

export default function ProductCheckoutButton({ product, isClosed, onVariantChange, onQuantityChange }: CheckoutButtonProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { data: user } = useUser();

  const handleVariantChange = (v: Variant | null) => {
    setSelectedVariant(v);
    onVariantChange?.(v);
  };

  const handleQuantityUpdate = (newQty: number) => {
    setQuantity(newQty);
    onQuantityChange?.(newQty);
  };

  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const first = product.variants[0];
      setSelectedVariant(first);
      onVariantChange?.(first);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.variants]);

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant
    ? selectedVariant.stock_quantity
    : product.stock_quantity;

  const formatPrice = (price: Price) => {
    return price.formatted.split(",")[0];
  };

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= currentStock) {
      handleQuantityUpdate(newQuantity);
    }
  };

  useCheckout({
    isAuth: !!user,
    product,
  });

  const isAvailable = selectedVariant
    ? selectedVariant.stock_quantity > 0
    : product.stock_status === "in_stock";

  // Total ulasan
  const totalReviews = Object.values(product.rating_count).reduce((a, b) => a + b, 0);

  return (
    <>
      {isClosed && (
        <div className="relative overflow-hidden bg-white border border-red-500 rounded-2xl p-4 shadow-sm mb-4 flex flex-col sm:flex-row items-center gap-4" style={{ padding: 20, marginBottom: 16 }}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-400 to-red-600"></div>
          <div className="w-10 h-10 bg-red-100/80 rounded-full flex items-center justify-center text-red-600 shadow-sm flex-shrink-0">
            <i className="fas fa-door-closed text-lg"></i>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-red-600 mb-0.5">Toko Sedang Tutup</h3>
            <p className="text-sm text-red-800/80 leading-tight font-medium">
              {product.store.emergency_close_reason || "Maaf, toko ini sedang tidak dapat menerima pesanan untuk sementara waktu."}
            </p>
          </div>
        </div>
      )}
      {/* Badges */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
        <span className="badge badge-terracotta">🔥 Terlaris</span>
        {isAvailable ? (
          <span className="badge badge-forest">✓ Stok Tersedia</span>
        ) : (
          <span className="badge" style={{ background: '#fee2e2', color: '#991b1b' }}>✗ Stok Habis</span>
        )}
        <span className="badge badge-saffron">🏅 Produk Unggulan</span>
      </div>

      {/* Nama Produk */}
      <h1 id="detailName">{product.name}</h1>

      {/* Rating Row — with sold count */}
      <div className="detail-rating-row">
        <span className="detail-stars">★★★★★</span>
        <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
          {Number(product.average_rating).toFixed(1)}
        </span>
        <span className="detail-rating-count">({totalReviews} ulasan)</span>
        <span className="detail-sold">{totalReviews > 0 ? `${totalReviews}+ terjual` : 'Belum ada penjualan'}</span>
      </div>

      {/* Harga */}
      <div className="detail-price-row">
        <span className="detail-price">{formatPrice(currentPrice)}</span>
        {/* Tampilkan harga lama & diskon jika ada varian dengan harga lebih tinggi */}
        {product.highest_price && product.highest_price.value > product.lowest_price.value && (
          <>
            <span className="detail-price-old">{formatPrice(product.highest_price)}</span>
            <span className="detail-discount">
              -{Math.round(((product.highest_price.value - product.lowest_price.value) / product.highest_price.value) * 100)}%
            </span>
          </>
        )}
      </div>

      {/* Merchant Card */}
      <Link href={"/umkm/" + product.store.id} className="detail-merchant-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="detail-merchant-icon" style={{ background: '#D4EFDF', overflow: 'hidden', padding: 0, flexShrink: 0 }}>
          <Image
            src={product.store.logo_url || "/assets/no-image.jpg"}
            alt={product.store.name}
            width={80}
            height={80}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
          />
        </div>
        <div className="detail-merchant-info" style={{ flex: 1, minWidth: 0 }}>
          <h4>{product.store.name}</h4>
          <Link
            href={`/kecamatan/${buildSlug(product.store.district?.name, product.store.district?.id) || 'sleman'}`}
            style={{ textDecoration: "none" }}
            className="location hover:text-terracotta transition-colors"
          >
            {product.store.district?.logo || product.store.district?.icon ? (
              <Image
                src={(product.store.district?.logo) as string}
                alt={product.store.district?.name || 'Kapanewon'}
                width={16}
                height={16}
                style={{ width: 16, height: 16, objectFit: 'contain', display: 'inline', verticalAlign: 'middle', marginRight: 4 }}
                unoptimized
              />
            ) : (
              product.store.district?.emoji || '📍'
            )}{' '}
            {product.store.district?.name || 'Sleman'}
          </Link>
        </div>
        <div style={{ color: 'var(--terracotta)', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
          Lihat Toko →
        </div>
      </Link>

      {/* Varian — hanya tampil jika ada */}
      {product.variants && product.variants.length > 0 && (
        <>
          <div className="detail-section-label">Varian</div>
          <div className="variant-options">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                className={`variant-btn${selectedVariant?.id === variant.id ? ' active' : ''}`}
                onClick={() => handleVariantChange(variant)}
              >
                {variant.name}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Jumlah */}
      <div className="detail-section-label">Jumlah</div>
      <div className="qty-control">
        <button
          className="qty-btn"
          onClick={() => handleQuantityChange(-1)}
          disabled={quantity <= 1}
        >
          −
        </button>
        <input
          className="qty-input"
          type="number"
          value={quantity}
          min={1}
          max={currentStock}
          readOnly
        />
        <button
          className="qty-btn"
          onClick={() => handleQuantityChange(1)}
          disabled={quantity >= currentStock}
        >
          +
        </button>
      </div>

      {/* Deskripsi */}
      <div className="detail-desc" dangerouslySetInnerHTML={{ __html: product.description }} />

      {/* Specs */}
      <div className="detail-specs">
        <div className="spec-row">
          <span className="spec-label">Kategori</span>
          <span className="spec-value">{product.category.name}</span>
        </div>
        <div className="spec-row">
          <span className="spec-label">Status</span>
          <span className="spec-value">{isAvailable ? '✓ Tersedia' : '✗ Stok Habis'}</span>
        </div>
        <div className="spec-row">
          <span className="spec-label">Stok</span>
          <span className="spec-value">{currentStock} unit</span>
        </div>
        <div className="spec-row">
          <span className="spec-label">Pengiriman</span>
          <span className="spec-value">Sleman &amp; sekitarnya</span>
        </div>
      </div>

      {/* Store checkout handlers (hidden, exposed via window for sticky CTA) */}
      <div id="__checkout_handlers" style={{ display: 'none' }}
        data-product-id={product.id}
      />

      {/* WhatsApp Button replacement logic */}
      <div style={{ marginTop: '24px' }}>
        <button
          id="detailWAButton"
          disabled={isClosed}
          className="btn btn-whatsapp btn-lg"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '15px',
            padding: '14px',
            borderRadius: '12px',
            fontWeight: 600,
            cursor: isClosed ? 'not-allowed' : 'pointer',
            opacity: isClosed ? 0.6 : 1,
            background: isClosed ? '#888' : '#25D366',
            color: 'white',
            border: 'none',
          }}
          onClick={() => {
            if (!isClosed) {
              const variantPart = selectedVariant ? `, varian: *${selectedVariant.name}*` : '';
              const msg = `Halo, saya ingin memesan *${product.name}*${variantPart} sebanyak *${quantity} pcs*. Apakah masih tersedia? Terima kasih.`;
              const phone = product.store?.user?.phone_number || product.store?.phone || '';
              window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
            }
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "20px", height: "20px", opacity: isClosed ? 0.5 : 1 }}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {isClosed ? 'Toko Tutup' : 'Pesan via WhatsApp'}
        </button>
      </div>
    </>
  );
}

const useCheckout = ({ isAuth = false, product }: CheckoutButtonProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { mutate: addToCart, isPending } = useAddToCart();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddToCart = ({
    quantity,
    selectedVariant,
  }: {
    selectedVariant: Variant | null;
    quantity: number;
  }) => {
    if (!isAuth) {
      router.push(`/masuk?redirect=${pathname}`);
      return;
    }
    const reqData: { product_id: string; quantity: number; variant_id?: string } = {
      product_id: product.id,
      quantity,
    };
    if (selectedVariant) reqData.variant_id = selectedVariant.id;
    addToCart(reqData);
  };

  const handleQuickOrder = async ({
    quantity,
    selectedVariant,
  }: {
    selectedVariant: Variant | null;
    quantity: number;
    price: Price;
  }) => {
    if (!isAuth) {
      router.push(`/masuk?redirect=${pathname}`);
      return;
    }
    setIsLoading(true);
    const items = [
      {
        product: {
          id: product.id,
          name: product.name,
          thumbnail: product.thumbnail,
          price: product.price,
        },
        variant: selectedVariant
          ? {
            id: selectedVariant.id,
            name: selectedVariant.name,
            thumbnail: selectedVariant.thumbnail,
            price: selectedVariant.price,
          }
          : null,
        quantity,
      },
    ];
    const saveLocal = {
      store: {
        id: product.store.id,
        name: product.store.name,
        slug: product.store.slug,
        logo_url: product.store.logo_url,
        qris_url: product.store.qris_url,
        address: product.store.address,
        village_id: product.store.village_id,
        district_id: product.store.district_id,
        regency_id: product.store.regency_id,
        description: product.store.description,
      },
      items,
    };
    await localStorage.setItem("checkout_items", JSON.stringify(saveLocal));
    setIsLoading(false);
    router.push("/checkout?store=" + product.store.id);
  };

  return { loading: isLoading || isPending, handleAddToCart, handleQuickOrder };
};
