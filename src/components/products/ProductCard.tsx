import { Product } from "@/types";
import { useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { useAddToCart } from "@/features/cart/hooks";
import { useUser } from "@/features/auth/hooks";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";

interface CardProductProps {
  product: Product;
}

export const ProductCard = ({ product }: CardProductProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  const discountPct = product.discount_percentage ? Number(product.discount_percentage) : 0;
  const hasDiscount = discountPct > 0 && product.discount_price != null;
  const discountStr = hasDiscount ? `-${Math.round(discountPct)}%` : null;

  const isNewCalculated = (() => {
    if (!product.created_at) return false;
    const created = new Date(product.created_at).getTime();
    const days = (Date.now() - created) / (1000 * 60 * 60 * 24);
    return days <= 8;
  })();

  const isNew = hasDiscount ? false : isNewCalculated;

  const promoRibbon = discountStr ? <div className="promo-ribbon">{discountStr}</div> : null;
  const newRibbon = isNew ? <div className="new-ribbon">✨ Baru</div> : null;

  const price = product.variants_exists ? product.lowest_price : product.price;

  const priceDisplay = `Rp ${price.value.toLocaleString()}`;

  const { data: user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const { mutate: addToCart, isPending } = useAddToCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push(`/masuk?redirect=${pathname}`);
      return;
    }
    addToCart({
      product_id: String(product.id),
      quantity: 1,
    });
  };

  return (
    <div
      ref={ref}
      className="product-card-lg h-full flex flex-col"
    >
      <div className="product-img-lg flex items-center justify-center relative">
        {isInView && (
          <Image
            src={product.thumbnail?.media_url || "/hero/hero.png"}
            alt={product.name}
            fill
            className="absolute inset-0 object-cover"
            loading="lazy"
          />
        )}
        {(promoRibbon || newRibbon) && (
          <div className="product-badge-overlay">
            {promoRibbon}{newRibbon}
          </div>
        )}
      </div>
      <div className="product-body-lg flex flex-col flex-1">

        <h3
          className="product-name-lg group-hover:text-primary transition-colors duration-300
               overflow-hidden line-clamp-2"
        >
          {product.name}
        </h3>
        <p className="product-shop-lg mb-1">
          {product.store ? product.store.name : "Store"}
        </p>
        <div className="product-actions-lg mt-auto p-0">
          <div className="price-col">
            <span className="product-price-lg">
              {priceDisplay}
            </span>
            <div className="sold-row flex items-center gap-1.5 flex-wrap text-[11px] text-gray-500 font-semibold mb-1">
              <i className="fas fa-star text-yellow-400"></i>
              {/* <span>{product.average_rating} · {product.sold_count || 0} terjual</span> */}
              <span>{product.sold_count || 0} terjual</span>
              {product.type && (
                <span className="tipe-barang-sm" style={{ padding: '0px 6px', fontSize: '10px' }}>
                  {product.type.toLowerCase() === 'jasa' ? '🛠️ Jasa' : '📦 Barang'}
                </span>
              )}
            </div>
          </div>
          {(() => {
            const isClosed = product.store?.is_open === false || product.store?.is_emergency_close === true;
            return isClosed ? (
              <button
                type="button"
                className="cat-card-cart disabled"
                title="Toko sedang tutup"
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
              >
                <ShoppingCart size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="cat-card-cart"
                onClick={handleAddToCart}
                disabled={isPending}
                title="Masukkan Keranjang"
              >
                <ShoppingCart size={16} />
              </button>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
