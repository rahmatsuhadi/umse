import { CartItem } from "@/types";
import Image from "next/image";
import { getComputedPrice } from "@/lib/price-helper";
import { formatRupiah } from "@/lib/curency-format";

export default function CheckoutItemCard({ item }: { item: CartItem }) {
  const imageUrl = item.variant
    ? item.variant.thumbnail?.media_url || item.product.thumbnail?.media_url || "/assets/no-image.jpg"
    : item.product.thumbnail?.media_url || "/assets/no-image.jpg";

  const itemPrice = getComputedPrice(item.product, item.variant);
  const totalValue = itemPrice.originalPriceValue * item.quantity;

  return (
    <div className="checkout-item-card">
      <div className="checkout-item-img-box">
        <Image
          className="object-cover"
          src={imageUrl}
          fill
          sizes="56px"
          alt={"gambar-" + item.product.name}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h5 className="checkout-item-title truncate">
          {item.variant?.name ?? item.product.name}
        </h5>
        
        {item.variant ? (
          <span className="checkout-item-badge">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--terracotta-light)" }}></span>
            Varian: {item.variant.name}
          </span>
        ) : (
          <span className="checkout-item-badge">
            Standard
          </span>
        )}

        <p className="checkout-item-price">
          {itemPrice.originalPriceFormatted} <span className="font-medium text-[10px]" style={{ color: "var(--text-muted)" }}>x {item.quantity}</span>
        </p>
      </div>
      <div className="text-right flex-shrink-0 pl-2">
        <p className="checkout-item-total">
          {formatRupiah(totalValue)}
        </p>
      </div>
    </div>
  );
}
