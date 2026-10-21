import { formatRupiah } from "@/lib/curency-format";
import type { Price, Product, Variant } from "@/types";

export interface ComputedPrice {
  originalPriceValue: number;
  originalPriceFormatted: string;
  hasDiscount: boolean;
  discountPercentage: number;
  discountPriceValue: number;
  discountPriceFormatted: string;
  finalPriceValue: number;
  finalPriceFormatted: string;
  discountBadge: string | null;
}

export function parsePriceValue(price: Price | number | string | undefined | null): number {
  if (price == null) return 0;
  if (typeof price === "number") return price;
  if (typeof price === "object") {
    if (typeof price.value === "number") return price.value;
    if (price.amount != null) {
      const amt = Number(price.amount);
      return isNaN(amt) ? 0 : amt / 100;
    }
  }
  const parsed = Number(price);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatPriceDisplay(price: Price | number | string | undefined | null): string {
  if (price == null) return "Rp 0";
  if (typeof price === "object" && price.formatted) {
    return price.formatted;
  }
  const val = parsePriceValue(price);
  return formatRupiah(val);
}

export function getComputedPrice(product?: Product | null, variant?: Variant | null): ComputedPrice {
  if (!product) {
    return {
      originalPriceValue: 0,
      originalPriceFormatted: "Rp 0",
      hasDiscount: false,
      discountPercentage: 0,
      discountPriceValue: 0,
      discountPriceFormatted: "Rp 0",
      finalPriceValue: 0,
      finalPriceFormatted: "Rp 0",
      discountBadge: null,
    };
  }

  const rawOriginalPrice =
    (variant as unknown as { original_price?: Price })?.original_price ??
    (product as unknown as { original_price?: Price })?.original_price ??
    (variant ? variant.price : product.price);

  let originalPriceValue = parsePriceValue(rawOriginalPrice);
  let originalPriceFormatted = formatPriceDisplay(rawOriginalPrice);

  const variantDiscPct = variant?.discount_percentage ? Number(variant.discount_percentage) : 0;
  const productDiscPct = product?.discount_percentage ? Number(product.discount_percentage) : 0;
  const discountPercentage = variantDiscPct > 0 ? variantDiscPct : productDiscPct;

  let computedDiscountPrice: number | null = null;

  if (variant) {
    if (variant.discount_price != null) {
      computedDiscountPrice = parsePriceValue(variant.discount_price);
    } else if (discountPercentage > 0) {
      computedDiscountPrice = Math.round(originalPriceValue - (originalPriceValue * discountPercentage) / 100);
    } else if (product.discount_price != null && !product.variants_exists) {
      computedDiscountPrice = parsePriceValue(product.discount_price);
    }
  } else {
    if (product.discount_price != null) {
      computedDiscountPrice = parsePriceValue(product.discount_price);
    } else if (discountPercentage > 0) {
      computedDiscountPrice = Math.round(originalPriceValue - (originalPriceValue * discountPercentage) / 100);
    }
  }

  // Jika harga tersimpan ternyata sudah berupa harga diskon (misal sama persis dengan discount_price):
  if (
    computedDiscountPrice !== null &&
    computedDiscountPrice > 0 &&
    discountPercentage > 0 &&
    Math.abs(originalPriceValue - computedDiscountPrice) < 1
  ) {
    originalPriceValue = Math.round(computedDiscountPrice / (1 - discountPercentage / 100));
    originalPriceFormatted = formatRupiah(originalPriceValue);
  } else if (
    variant &&
    computedDiscountPrice !== null &&
    Math.abs(originalPriceValue - computedDiscountPrice) < 1 &&
    parsePriceValue(product.price) > originalPriceValue
  ) {
    originalPriceValue = parsePriceValue(product.price);
    originalPriceFormatted = formatPriceDisplay(product.price);
  }

  const hasDiscount =
    computedDiscountPrice !== null &&
    computedDiscountPrice > 0 &&
    computedDiscountPrice < originalPriceValue;

  const finalPriceValue = hasDiscount ? computedDiscountPrice! : originalPriceValue;
  const finalPriceFormatted = hasDiscount ? formatRupiah(finalPriceValue) : originalPriceFormatted;
  const discountPriceValue = hasDiscount ? computedDiscountPrice! : originalPriceValue;
  const discountPriceFormatted = hasDiscount ? formatRupiah(discountPriceValue) : originalPriceFormatted;

  const pct = discountPercentage > 0
    ? Math.round(discountPercentage)
    : Math.round(((originalPriceValue - finalPriceValue) / (originalPriceValue || 1)) * 100);

  const discountBadge = hasDiscount && pct > 0 ? `-${pct}%` : null;

  return {
    originalPriceValue,
    originalPriceFormatted,
    hasDiscount,
    discountPercentage: pct,
    discountPriceValue,
    discountPriceFormatted,
    finalPriceValue,
    finalPriceFormatted,
    discountBadge,
  };
}
