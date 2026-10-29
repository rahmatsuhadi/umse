import { Order } from "@/types/order";

export type ShippingCategory = "cod" | "instant" | "regular" | "service";

export interface ShippingMethodInfo {
  category: ShippingCategory;
  categoryLabel: "COD" | "Instant" | "Reguler" | "Layanan Jasa";
  categoryFullLabel: string;
  courierName: string;
  serviceType: string;
  icon: string;
  badgeClass: string;
  accentColor: string;
  description: string;
}

/**
 * Format nama jasa kurir agar tampil ramah dan profesional
 */
export function getCourierDisplayName(service?: string | null): string {
  if (!service) return "-";
  const s = service.toLowerCase().trim();

  switch (s) {
    case "gosend":
      return "GoSend";
    case "grab":
    case "grab_express":
    case "grabexpress":
      return "GrabExpress";
    case "jne":
      return "JNE Express";
    case "sicepat":
      return "SiCepat Express";
    case "jnt":
    case "j&t":
      return "J&T Express";
    case "jnt_cargo":
    case "j&t cargo":
      return "J&T Cargo";
    case "anteraja":
      return "AnterAja";
    case "pos":
    case "posindonesia":
      return "Pos Indonesia";
    case "idexpress":
      return "ID Express";
    case "tiki":
      return "TIKI";
    case "ninja":
      return "Ninja Xpress";
    case "lion":
      return "Lion Parcel";
    case "wahana":
      return "Wahana Express";
    case "sap":
      return "SAP Express";
    case "sentral":
      return "Sentral Cargo";
    case "indah":
      return "Indah Logistik Cargo";
    case "kurir_toko":
      return "Kurir Toko";
    case "pickup":
      return "Ambil di Toko";
    case "cod":
      return "Kurir Toko (COD)";
    case "none":
    case "service":
      return "Tanpa Kurir (Jasa)";
    default:
      // Ubah camelCase atau snake_case jadi Capital
      return s
        .split(/[_\s-]+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
  }
}

/**
 * Mendeteksi klasifikasi pengiriman pesanan (COD, Instant, atau Reguler)
 * beserta nama kurirnya jika Instant / Reguler
 */
export function getShippingMethodInfo(order: Partial<Order>): ShippingMethodInfo {
  const service = (order.shipping_service || "").toLowerCase().trim();
  const serviceType = (order.shipping_service_type || "").toLowerCase().trim();
  const paymentMethod = (order.payment_method || "").toLowerCase().trim();
  const estimatedDelivery = (order.estimated_delivery || "").toLowerCase();

  // 1. Cek apakah pesanan bertipe COD
  const isCod =
    paymentMethod === "cash_on_delivery" ||
    paymentMethod === "cod" ||
    service === "cod" ||
    serviceType === "cod" ||
    estimatedDelivery.includes("cod");

  if (isCod) {
    return {
      category: "cod",
      categoryLabel: "COD",
      categoryFullLabel: "COD (Bayar di Tempat)",
      courierName: "Kurir Toko / Seller",
      serviceType: "Cash on Delivery",
      icon: "fas fa-hand-holding-usd",
      badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
      accentColor: "#D97706",
      description: "Bayar tunai di tempat saat pesanan diterima langsung dari penjual.",
    };
  }

  // 2. Cek apakah pesanan bertipe Instant
  const isInstant =
    service === "gosend" ||
    service === "grab" ||
    service === "grab_express" ||
    service === "grabexpress" ||
    service === "instant" ||
    serviceType.includes("instant") ||
    serviceType.includes("sameday") ||
    serviceType.includes("same_day");

  if (isInstant) {
    const courier = getCourierDisplayName(service || "instant");
    return {
      category: "instant",
      categoryLabel: "Instant",
      categoryFullLabel: `Instant (${courier})`,
      courierName: courier,
      serviceType: order.shipping_service_type || "Instant Delivery",
      icon: "fas fa-bolt",
      badgeClass: "bg-orange-100 text-orange-800 border-orange-300",
      accentColor: "var(--terracotta)",
      description: `Pengiriman kilat langsung sampai di hari yang sama dengan ${courier}.`,
    };
  }

  // 3. Cek apakah pesanan jasa (tidak ada fisik kurir)
  const isServiceOnly =
    (service === "none" || service === "service") ||
    (order.items &&
      order.items.length > 0 &&
      order.items.every((it) => {
        const type = it.product?.type?.toLowerCase();
        return type === "service" || type === "jasa";
      }));

  if (isServiceOnly) {
    return {
      category: "service",
      categoryLabel: "Layanan Jasa",
      categoryFullLabel: "Layanan Jasa (Tanpa Kurir)",
      courierName: "Tanpa Kurir",
      serviceType: "Layanan Langsung",
      icon: "fas fa-tools",
      badgeClass: "bg-purple-100 text-purple-800 border-purple-300",
      accentColor: "#8E44AD",
      description: "Layanan jasa langsung dikerjakan oleh penyedia jasa tanpa pengiriman fisik barang.",
    };
  }

  // 4. Default: Reguler (Ekspedisi standar)
  const regularCourier = getCourierDisplayName(service || "Ekspedisi");
  return {
    category: "regular",
    categoryLabel: "Reguler",
    categoryFullLabel: `Reguler (${regularCourier})`,
    courierName: regularCourier,
    serviceType: order.shipping_service_type || "Reguler",
    icon: "fas fa-truck",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-300",
    accentColor: "#2980B9",
    description: `Pengiriman standar ekspedisi menggunakan kurir ${regularCourier}.`,
  };
}
