import { Product } from "@/types";
import { useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { useCreateVisitorLog } from "@/features/visitor-logs/hooks";

interface CardProductProps {
  product: Product;
}

export const ProductCard = ({ product }: CardProductProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });
  const { mutate: logVisitor } = useCreateVisitorLog();

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

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    logVisitor({ product_id: product.id });

    const phone = product.store?.user?.phone_number || product.store?.phone || '';
    const isService = product.type?.toLowerCase() === 'service' || product.type?.toLowerCase() === 'jasa';
    const message = isService
      ? `Halo, saya ingin memesan layanan *${product.name}*`
      : `Halo, saya tertarik dengan produk ${product.name}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
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
              <span>{product.average_rating} · {product.sold_count || 0} terjual</span>
              {product.type && (
                <span className="tipe-barang-sm" style={{ padding: '0px 6px', fontSize: '10px' }}>
                  {product.type.toLowerCase() === 'jasa' ? '🛠️ Jasa' : '📦 Barang'}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            className="btn-wa-compact"
            onClick={handleWhatsAppClick}
            title="Pesan via WhatsApp"
          >
            <i className="fab fa-whatsapp"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
