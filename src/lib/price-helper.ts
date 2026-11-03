/* eslint-disable @typescript-eslint/no-explicit-any */
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

export interface LowestPriceResult {
  displayPrice: string;
  priceOld?: string;
  discountStr: string | null;
  hasDiscount: boolean;
  lowestPriceValue: number;
}

export function getLowestProductPrice(product: any): LowestPriceResult {
  if (!product) {
    return {
      displayPrice: "Rp 0",
      discountStr: null,
      hasDiscount: false,
      lowestPriceValue: 0,
    };
  }

  const formatPriceSafe = (price: any): string => {
    if (!price) return "Rp 0";
    if (typeof price === "number") {
      return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
    }
    if (typeof price === "object") {
      if (typeof price.value === "number") {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price.value);
      }
      if (price.formatted) return price.formatted as string;
    }
    const val = parsePriceValue(price);
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);
  };

  interface Candidate {
    effective: number;
    original: number;
    hasDiscount: boolean;
    discountPct: number;
    discountBadge: string | null;
  }

  const candidates: Candidate[] = [];

  const productDiscPct = product.discount_percentage ? Number(product.discount_percentage) : 0;
  const productDiscPriceVal = product.discount_price != null ? parsePriceValue(product.discount_price) : null;

  // 1. Base Product: gunakan getComputedPrice agar aturan diskon produk konsisten
  const baseComputed = getComputedPrice(product, null);
  if (baseComputed.originalPriceValue > 0 || baseComputed.finalPriceValue > 0) {
    candidates.push({
      effective: baseComputed.finalPriceValue,
      original: baseComputed.originalPriceValue,
      hasDiscount: baseComputed.hasDiscount,
      discountPct: baseComputed.discountPercentage,
      discountBadge: baseComputed.discountBadge,
    });
  }

  // 2. Variants (jika ada data variants)
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    for (const v of product.variants) {
      const vComputed = getComputedPrice(product, v);
      if (vComputed.originalPriceValue > 0 || vComputed.finalPriceValue > 0) {
        candidates.push({
          effective: vComputed.finalPriceValue,
          original: vComputed.originalPriceValue,
          hasDiscount: vComputed.hasDiscount,
          discountPct: vComputed.discountPercentage,
          discountBadge: vComputed.discountBadge,
        });
      }
    }
  }

  // 3. lowest_price dari API (misal saat variants tidak di-include dalam respons paginasi)
  if (product.lowest_price != null) {
    const lowestVal = parsePriceValue(product.lowest_price);
    if (lowestVal > 0) {
      let computedDiscountPrice: number | null = null;
      if (productDiscPriceVal !== null && productDiscPriceVal > 0 && productDiscPriceVal < lowestVal) {
        computedDiscountPrice = productDiscPriceVal;
      } else if (productDiscPct > 0) {
        computedDiscountPrice = Math.round(lowestVal - (lowestVal * productDiscPct) / 100);
      }

      const hasDiscount = computedDiscountPrice !== null && computedDiscountPrice > 0 && computedDiscountPrice < lowestVal;
      const effective = hasDiscount ? computedDiscountPrice! : lowestVal;
      const pct = productDiscPct > 0 ? Math.round(productDiscPct) : Math.round(((lowestVal - effective) / lowestVal) * 100);

      candidates.push({
        effective,
        original: lowestVal,
        hasDiscount,
        discountPct: pct,
        discountBadge: hasDiscount && pct > 0 ? `-${pct}%` : null,
      });
    }
  }

  // Cari kandidat harga terendah berdasarkan harga efektif (setelah diskon)
  const validCandidates = candidates.filter((c) => c.effective > 0);
  if (validCandidates.length > 0) {
    const lowest = validCandidates.reduce(
      (min, curr) => (curr.effective < min.effective ? curr : min),
      validCandidates[0]
    );

    // Jika kandidat terendah memiliki diskon
    if (lowest.hasDiscount && lowest.original > lowest.effective) {
      return {
        displayPrice: formatPriceSafe(lowest.effective),
        priceOld: formatPriceSafe(lowest.original),
        discountStr: lowest.discountBadge ?? (lowest.discountPct > 0 ? `-${Math.round(lowest.discountPct)}%` : null),
        hasDiscount: true,
        lowestPriceValue: lowest.effective,
      };
    }

    // Jika tidak ada promo diskon tapi ada rentang harga highest_price > lowest_price
    if (product.highest_price != null) {
      const highestVal = parsePriceValue(product.highest_price);
      if (highestVal > lowest.effective) {
        const rangePct = Math.round(((highestVal - lowest.effective) / highestVal) * 100);
        return {
          displayPrice: formatPriceSafe(lowest.effective),
          priceOld: formatPriceSafe(highestVal),
          discountStr: rangePct > 0 ? `-${rangePct}%` : null,
          hasDiscount: true,
          lowestPriceValue: lowest.effective,
        };
      }
    }

    return {
      displayPrice: formatPriceSafe(lowest.effective),
      priceOld: undefined,
      discountStr: null,
      hasDiscount: false,
      lowestPriceValue: lowest.effective,
    };
  }

  // Fallback
  const baseComp = getComputedPrice(product, null);
  return {
    displayPrice: baseComp.hasDiscount ? baseComp.finalPriceFormatted : baseComp.originalPriceFormatted,
    priceOld: baseComp.hasDiscount ? baseComp.originalPriceFormatted : undefined,
    discountStr: baseComp.discountBadge,
    hasDiscount: baseComp.hasDiscount,
    lowestPriceValue: baseComp.finalPriceValue,
  };
}
