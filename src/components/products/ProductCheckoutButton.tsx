"use client";

import { useState, useEffect } from "react";
import type { Price, Product, Variant } from "@/types";
import { useAddToCart } from "@/features/cart/hooks";
import { useUser } from "@/features/auth/hooks";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface CheckoutButtonProps {
  product: Product;
  isAuth?: boolean;
}

export default function ProductCheckoutButton({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { data: user } = useUser();

  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
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
      setQuantity(newQuantity);
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
          <span>⭐ {Number(product.store.average_rating).toFixed(1)} · {product.store.products_count} produk</span>
          <div className="location">📍 {product.store.district?.name || 'Sleman'}</div>
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
                onClick={() => setSelectedVariant(variant)}
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
      <p className="detail-desc">{product.description}</p>

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
