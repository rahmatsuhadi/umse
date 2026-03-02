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

  const price = product.variants_exists ? product.lowest_price : product.price;

  const priceDisplay = `Rp ${price.value.toLocaleString()}`;

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    logVisitor({ product_id: product.id });

    // @ts-expect-error Type not matched - store.user may not be in type but present in runtime
    const phone = product.store?.user?.phone_number || product.store?.phone || '';
    const message = `Halo, saya tertarik dengan produk ${product.name}`;
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
      </div>
      <div className="product-body-lg flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="badge badge-terracotta flex-shrink-0 max-w-[60%] truncate">
            {product.category.name}
          </span>

          <div className="flex items-center text-yellow-400">
            <i className="fas fa-star text-xs"></i>
            <span className="text-gray-600 text-xs ml-1 font-semibold">
              {product.average_rating}
            </span>
          </div>
        </div>
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
            <div className="sold-row">
              Stok: {product.stock_quantity}
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
