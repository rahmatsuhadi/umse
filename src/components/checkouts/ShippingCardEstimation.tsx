"use client";

import { useShippingRates, useInstantShippingRates } from "@/features/shipping/hooks";
import { Product, ResponseShippingRates, Variant } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Loader2,
  RefreshCw,
  AlertTriangle,
  Truck,
  Zap,
  ShieldCheck,
  Banknote,
  Lock,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { getComputedPrice } from "@/lib/price-helper";

interface ShippingCardEstimationProps {
  storeVillageId: number;
  storeLatitude?: number | null;
  storeLongitude?: number | null;
  storeIsCod?: boolean | number | string | null;
  items: Array<{
    id?: string;
    cart_item_id?: string;
    product: Product;
    variant?: Variant;
    quantity: number;
  }>;
  handleValidShipping?: (val: ResponseShippingRates | null) => void;
}

export type ShippingTab = "cod" | "instant" | "regular";

/**
 * Menghitung jarak garis lurus (Straight-line / Haversine) dalam Kilometer (KM)
 */
function calculateDistanceInKm(
  lat1?: number | null,
  lon1?: number | null,
  lat2?: number | null,
  lon2?: number | null
): number | null {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const nLat1 = Number(lat1);
  const nLon1 = Number(lon1);
  const nLat2 = Number(lat2);
  const nLon2 = Number(lon2);
  if (isNaN(nLat1) || isNaN(nLon1) || isNaN(nLat2) || isNaN(nLon2)) return null;

  const R = 6371; // Radius bumi dalam KM
  const dLat = ((nLat2 - nLat1) * Math.PI) / 180;
  const dLon = ((nLon2 - nLon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((nLat1 * Math.PI) / 180) *
      Math.cos((nLat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const service_name = "jne";

export default function ShippingCardEstimation({
  items,
  storeVillageId,
  storeLatitude,
  storeLongitude,
  storeIsCod = false,
  handleValidShipping = () => {},
}: ShippingCardEstimationProps) {
  const { watch } = useFormContext();

  const destination_village_id = watch("village_id");
  const watchedLatitude = watch("latitude");
  const watchedLongitude = watch("longitude");

  // 1. Kategori Jasa -> tidak ada opsi kurir (bebas ongkir)
  const isServiceOrder = useMemo(
    () =>
      items.length > 0 &&
      items.every((item) => {
        const type = item.product?.type?.toLowerCase();
        return type === "service" || type === "jasa";
      }),
    [items]
  );

  // 2. Kategori barang Ready to Eat / Frozen
  const isReadyToEatOrFrozen = useMemo(
    () =>
      items.some(
        (item) =>
          Boolean(
            item.product?.is_ready_to_serve ||
            item.product?.is_frozen ||
            item.product?.category?.is_ready_to_serve ||
            item.product?.category?.is_frozen
          )
      ),
    [items]
  );

  // 3. Hitung perkiraan jarak seller ke customer dalam KM
  const distanceKm = useMemo(() => {
    return calculateDistanceInKm(
      storeLatitude,
      storeLongitude,
      watchedLatitude,
      watchedLongitude
    );
  }, [storeLatitude, storeLongitude, watchedLatitude, watchedLongitude]);

  // Payload format untuk hit API kurir
  const itemsPayload = useMemo(() => {
    return items.map((item) => {
      if (item.id) {
        return {
          cart_item_id: item.id || undefined,
          quantity: item.quantity,
          product_id: undefined,
          variant_id: undefined,
        };
      } else {
        return {
          cart_item_id: undefined,
          product_id: item.product.id || undefined,
          quantity: item.quantity,
          variant_id: item.variant?.id || undefined,
        };
      }
    });
  }, [items]);

  // Cek apakah koordinat lokasi pelanggan sudah terisi
  const hasCoordinates = Boolean(
    watchedLatitude != null &&
    watchedLongitude != null &&
    Number(watchedLatitude) !== 0 &&
    Number(watchedLongitude) !== 0
  );

  // =========================================================================
  // ON CHANGE TITIK KOORDINAT LOKASI:
  // Lakukan pengecekan jarak ulang & tarif antara seller dan customer via API KiriminAja Instant Price
  // =========================================================================
  const {
    data: instantPriceResponse,
    isLoading: isLoadingInstantRates,
    isFetching: isFetchingInstantRates,
    isError: isErrorInstantRates,
    error: errorInstantRates,
    refetch: refetchInstantRates,
  } = useInstantShippingRates({
    origin_village_id: storeVillageId,
    origin_lat: storeLatitude ? Number(storeLatitude) : undefined,
    origin_long: storeLongitude ? Number(storeLongitude) : undefined,
    destination_lat: watchedLatitude ? Number(watchedLatitude) : undefined,
    destination_long: watchedLongitude ? Number(watchedLongitude) : undefined,
    destination_village_id: Number(destination_village_id),
    items: itemsPayload,
    enabled: Boolean(destination_village_id) && hasCoordinates && !isServiceOrder,
  });

  // Re-fetch instan pricing saat koordinat berubah (on change koordinat)
  useEffect(() => {
    if (hasCoordinates && destination_village_id && !isServiceOrder) {
      refetchInstantRates();
    }
  }, [watchedLatitude, watchedLongitude]); // eslint-disable-line react-hooks/exhaustive-deps

  const instantRatesFromApi: ResponseShippingRates[] = useMemo(() => {
    return instantPriceResponse?.data ?? [];
  }, [instantPriceResponse?.data]);

  // Jika API KiriminAja instant pricing mengembalikan data kurir, berarti jarak terverifikasi < 40 km
  const hasInstantFromApi = instantRatesFromApi.length > 0;

  // 4. Kriteria ketersediaan masing-masing opsi:
  // - Opsi COD: hanya muncul saat seller mengaktifkan fitur COD, semua jenis barang fisik bisa COD, bukan jasa
  const canShowCod =
    !isServiceOrder &&
    Boolean(
      storeIsCod === true ||
      storeIsCod === 1 ||
      String(storeIsCod) === "1" ||
      String(storeIsCod) === "true"
    );

  // - Opsi Instant: di-enable jika titik koordinat terisi dan terverifikasi di bawah 40 KM (melalui hasil API KiriminAja Instant Price atau jarak straight-line < 40 KM)
  const canShowInstant =
    !isServiceOrder &&
    hasCoordinates &&
    (hasInstantFromApi || (distanceKm !== null && distanceKm < 40));

  // - Opsi Reguler: di-enable hanya jika barang fisik, bukan jasa, bukan ready to eat, dan bukan frozen food
  const canShowRegular = !isServiceOrder && !isReadyToEatOrFrozen;

  // Daftar tab yang aktif/bisa dipilih (enabled)
  const enabledTabs = useMemo<ShippingTab[]>(() => {
    if (isServiceOrder) return [];
    const tabs: ShippingTab[] = [];
    if (canShowCod) tabs.push("cod");
    if (canShowInstant) tabs.push("instant");
    if (canShowRegular) tabs.push("regular");
    return tabs;
  }, [isServiceOrder, canShowCod, canShowInstant, canShowRegular]);

  // Tab aktif saat ini
  const [activeTab, setActiveTab] = useState<ShippingTab>("regular");

  // State pesan error jika user mengklik tab yang di-disable
  const [disabledTabError, setDisabledTabError] = useState<{
    tab: "Instant" | "Reguler";
    message: string;
  } | null>(null);

  // Key kurir terpilih: `${service}_${service_type}`
  const [selectedServiceKey, setSelectedServiceKey] = useState<string>("");

  // Otomatis tentukan default tab yang valid
  useEffect(() => {
    if (enabledTabs.length === 0) return;
    if (!enabledTabs.includes(activeTab)) {
      if (isReadyToEatOrFrozen) {
        if (enabledTabs.includes("instant")) {
          setActiveTab("instant");
        } else if (enabledTabs.includes("cod")) {
          setActiveTab("cod");
        } else {
          setActiveTab(enabledTabs[0]);
        }
      } else {
        // Untuk barang biasa, pilih tab pertama yang tersedia
        setActiveTab(enabledTabs[0]);
      }
    }
  }, [enabledTabs, activeTab, isReadyToEatOrFrozen]);

  // Helper alasan kenapa Instant disabled
  const getInstantDisabledReason = () => {
    if (isServiceOrder) {
      return "Produk layanan jasa tidak memerlukan kurir pengiriman.";
    }
    if (distanceKm !== null && distanceKm >= 40) {
      return `Berdasarkan pengecekan API KiriminAja, jarak pengiriman (${distanceKm} km) melebihi batas jangkauan maksimal kurir Instant 40 km dari lokasi toko.`;
    }
    if (!hasCoordinates) {
      return "Kurir Instant belum dapat digunakan karena titik koordinat lokasi alamat belum ditentukan pada peta (dibutuhkan untuk validasi jarak < 40 km).";
    }
    if (!hasInstantFromApi && !isLoadingInstantRates) {
      return "Kurir Instant (GoSend / Grab) tidak menjangkau rute lokasi ini dari toko terkait.";
    }
    return "Kurir Instant sedang tidak tersedia untuk pesanan ini.";
  };

  // Helper alasan kenapa Reguler disabled
  const getRegularDisabledReason = () => {
    if (isServiceOrder) {
      return "Produk layanan jasa tidak memerlukan kurir pengiriman.";
    }
    if (isReadyToEatOrFrozen) {
      return `Pengiriman Reguler tidak tersedia untuk produk makanan siap saji atau frozen food demi menjaga kesegaran produk${
        canShowCod ? " (Silakan gunakan kurir Instant atau layanan COD Toko)" : " (Silakan gunakan kurir Instant)"
      }.`;
    }
    return "Kurir Reguler sedang tidak tersedia untuk pesanan ini.";
  };

  // Handler saat tab yang di-disable diklik
  const handleDisabledTabClick = (tab: "instant" | "regular") => {
    if (tab === "instant") {
      const reason = getInstantDisabledReason();
      toast.error("Kurir Instant Tidak Dapat Dipilih", {
        description: reason,
      });
      setDisabledTabError({ tab: "Instant", message: reason });
    } else if (tab === "regular") {
      const reason = getRegularDisabledReason();
      toast.error("Kurir Reguler Tidak Dapat Dipilih", {
        description: reason,
      });
      setDisabledTabError({ tab: "Reguler", message: reason });
    }
  };

  // Objek opsi pengiriman khusus COD (Ongkos Kirim Rp 0)
  const codShippingRate: ResponseShippingRates = useMemo(
    () => ({
      service: "cod",
      service_name: "COD (Bayar di Tempat)",
      service_type: "cod",
      etd: "1-3 hari",
      cost: {
        amount: "0",
        currency: "IDR",
        formatted: "Rp 0",
        value: 0,
      },
    }),
    []
  );

  // Kapan API reguler KiriminAja perlu di-hit?
  const shouldHitKiriminAja =
    !isServiceOrder &&
    Boolean(destination_village_id) &&
    canShowRegular;

  // Query tarif reguler KiriminAja
  const {
    data: shippingRateResponse,
    isLoading: isLoadingShippingRates,
    isError: isErrorShippingRates,
    error: errorShippingRates,
    refetch,
  } = useShippingRates({
    origin_village_id: storeVillageId,
    include_instant: false,
    origin_lat: storeLatitude ? Number(storeLatitude) : undefined,
    origin_long: storeLongitude ? Number(storeLongitude) : undefined,
    destination_lat: watchedLatitude ? Number(watchedLatitude) : undefined,
    destination_long: watchedLongitude ? Number(watchedLongitude) : undefined,
    items: itemsPayload,
    destination_village_id: Number(destination_village_id),
    enabled: shouldHitKiriminAja,
  });

  // Subtotal barang tanpa diskon
  const originalSubtotal = items.reduce((acc, item) => {
    const itemPrice = getComputedPrice(item.product, item.variant);
    return acc + item.quantity * itemPrice.originalPriceValue;
  }, 0);

  // Total potongan diskon produk
  const totalDiscount = items.reduce((acc, item) => {
    const itemPrice = getComputedPrice(item.product, item.variant);
    if (itemPrice.hasDiscount) {
      return acc + item.quantity * (itemPrice.originalPriceValue - itemPrice.finalPriceValue);
    }
    return acc;
  }, 0);

  // Subtotal setelah diskon
  const finalSubtotal = originalSubtotal - totalDiscount;

  // Daftar opsi pengiriman reguler real langsung dari KiriminAja API
  const regularRates: ResponseShippingRates[] = useMemo(() => {
    if (isServiceOrder || !canShowRegular) return [];
    return (shippingRateResponse?.data ?? []).filter(
      (r) =>
        !["gosend", "grab"].includes(r.service.toLowerCase()) &&
        r.service_type.toLowerCase() !== "instant"
    );
  }, [isServiceOrder, canShowRegular, shippingRateResponse?.data]);

  // Daftar kurir instant langsung dari hasil hit API KiriminAja Instant Price
  const instantRates: ResponseShippingRates[] = useMemo(() => {
    if (isServiceOrder || !canShowInstant) return [];
    return instantRatesFromApi;
  }, [isServiceOrder, canShowInstant, instantRatesFromApi]);

  const isRateInstant = (rate: ResponseShippingRates) =>
    ["gosend", "grab"].includes(rate.service.toLowerCase()) ||
    rate.service_type.toLowerCase() === "instant";

  // Opsi kurir sesuai tab yang sedang aktif
  const currentTabRates = useMemo<ResponseShippingRates[]>(() => {
    if (activeTab === "cod") {
      return canShowCod ? [codShippingRate] : [];
    }
    if (activeTab === "instant") {
      return canShowInstant ? instantRates : [];
    }
    if (activeTab === "regular") {
      return canShowRegular ? regularRates : [];
    }
    return [];
  }, [activeTab, canShowCod, codShippingRate, canShowInstant, instantRates, canShowRegular, regularRates]);

  // Opsi terpilih yang aktif
  const activeShipping: ResponseShippingRates | null = useMemo(() => {
    if (isServiceOrder) return null;
    if (activeTab === "cod") {
      return canShowCod ? codShippingRate : null;
    }
    if (activeTab === "instant" && !canShowInstant) return null;
    if (activeTab === "regular" && !canShowRegular) return null;

    return (
      currentTabRates.find(
        (item) => `${item.service}_${item.service_type}` === selectedServiceKey
      ) ??
      currentTabRates[0] ??
      null
    );
  }, [
    isServiceOrder,
    activeTab,
    canShowCod,
    canShowInstant,
    canShowRegular,
    codShippingRate,
    currentTabRates,
    selectedServiceKey,
  ]);

  // Total harga akhir
  const total = isServiceOrder
    ? finalSubtotal
    : activeShipping
    ? finalSubtotal + Number(activeShipping.cost.value ?? 0)
    : 0;

  // Reset saat alamat tujuan berganti
  useEffect(() => {
    setSelectedServiceKey("");
    setDisabledTabError(null);
  }, [destination_village_id]);

  // Sinkronisasi opsi kurir terpilih ke parent saat tab atau data berubah
  useEffect(() => {
    if (isServiceOrder) {
      handleValidShipping({
        service: "none",
        service_name: "Tanpa Kurir (Jasa)",
        service_type: "none",
        etd: "-",
        cost: {
          amount: "0",
          currency: "IDR",
          formatted: "Rp 0",
          value: 0,
        },
      } as ResponseShippingRates);
      return;
    }

    if (activeTab === "cod") {
      if (canShowCod) {
        setSelectedServiceKey("cod_cod");
        handleValidShipping(codShippingRate);
      } else {
        handleValidShipping(null);
      }
      return;
    }

    if (activeTab === "instant" && !canShowInstant) {
      handleValidShipping(null);
      return;
    }

    if (activeTab === "regular" && !canShowRegular) {
      handleValidShipping(null);
      return;
    }

    if (currentTabRates.length > 0) {
      const match = currentTabRates.find(
        (item) => `${item.service}_${item.service_type}` === selectedServiceKey
      );
      const chosen = match || currentTabRates[0];
      setSelectedServiceKey(`${chosen.service}_${chosen.service_type}`);
      handleValidShipping(chosen);
    } else {
      if (!isLoadingShippingRates && !isLoadingInstantRates) {
        handleValidShipping(null);
      }
    }
  }, [
    isServiceOrder,
    activeTab,
    canShowCod,
    canShowInstant,
    canShowRegular,
    codShippingRate,
    currentTabRates,
    isLoadingShippingRates,
    isLoadingInstantRates,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectRate = (rate: ResponseShippingRates) => {
    const key = `${rate.service}_${rate.service_type}`;
    setSelectedServiceKey(key);
    handleValidShipping(rate);
  };

  const handleTabChange = (tab: ShippingTab) => {
    setDisabledTabError(null);
    setActiveTab(tab);
    if (tab === "cod") {
      setSelectedServiceKey("cod_cod");
      handleValidShipping(codShippingRate);
    } else if (tab === "instant") {
      const first = instantRates[0] ?? null;
      if (first) {
        setSelectedServiceKey(`${first.service}_${first.service_type}`);
        handleValidShipping(first);
      } else {
        setSelectedServiceKey("");
        handleValidShipping(null);
      }
    } else if (tab === "regular") {
      const first = regularRates[0] ?? null;
      if (first) {
        setSelectedServiceKey(`${first.service}_${first.service_type}`);
        handleValidShipping(first);
      } else {
        setSelectedServiceKey("");
        handleValidShipping(null);
      }
    }
  };

  const handleRetry = () => {
    setSelectedServiceKey("");
    refetch();
    if (hasCoordinates) {
      refetchInstantRates();
    }
  };

  const formatEtdDisplay = (etd: string, isInstant: boolean) => {
    if (!etd) return isInstant ? "1-2 jam tiba" : "Estimasi reguler";
    const lower = etd.toLowerCase();
    if (lower.includes("jam") || lower.includes("hour")) {
      return `${etd} tiba`;
    }
    return `${etd.replace(/hari/gi, "").trim()} hari`;
  };

  const isCurrentTabLoading =
    activeTab === "instant" ? isFetchingInstantRates : isLoadingShippingRates;

  return (
    <div className="checkout-shipping-section space-y-4">
      {/* Subtotal Barang / Jasa (Harga Tanpa Diskon) */}
      <div className="checkout-shipping-row">
        <span className="checkout-shipping-label">
          {isServiceOrder ? "Subtotal Jasa" : "Subtotal Barang"}
        </span>
        <span className="checkout-shipping-value">
          Rp {originalSubtotal.toLocaleString("id-ID")}
        </span>
      </div>

      {/* KONDISI 1: Produk JASA — Bebas Ongkir */}
      {isServiceOrder && (
        <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center flex-shrink-0 text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              Layanan / Produk Jasa
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                Bebas Ongkir
              </span>
            </h5>
            <p className="text-[11px] text-emerald-700 mt-1 leading-relaxed">
              Pesanan ini berisi produk jasa sehingga tidak memerlukan pengiriman kurir fisik. Anda hanya perlu membayar pesanan melalui QRIS BPD DIY.
            </p>
          </div>
        </div>
      )}

      {/* KONDISI 2: Warning Khusus Ready to Eat / Frozen Food */}
      {!isServiceOrder && isReadyToEatOrFrozen && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] text-amber-800 leading-relaxed">
            <strong>Perhatian Produk Siap Saji / Frozen:</strong> Demi menjaga kesegaran dan kualitas, produk ini hanya dapat dikirim menggunakan kurir <strong>Instant</strong>
            {canShowCod ? " atau layanan COD Toko" : ""} (opsi Reguler dinonaktifkan).
          </div>
        </div>
      )}

      {/* KONDISI 3: Warning Khusus jika Ready to Eat / Frozen di luar 40 KM dan Toko tidak COD */}
      {!isServiceOrder &&
        isReadyToEatOrFrozen &&
        destination_village_id &&
        hasCoordinates &&
        !isFetchingInstantRates &&
        !hasInstantFromApi &&
        !canShowCod && (
          <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl flex items-start gap-3 shadow-xs animate-shake">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h5 className="text-xs font-bold text-rose-900">
                Alamat Di Luar Jangkauan Kurir Instant {distanceKm !== null ? `(${distanceKm} KM)` : ""}
              </h5>
              <p className="text-[11px] text-rose-700 mt-1 leading-relaxed">
                Produk makanan siap saji atau frozen food hanya dapat dikirim via kurir Instant (&lt; 40 KM). Berdasarkan pengecekan sistem KiriminAja, alamat lokasi pengiriman Anda berada di luar area jangkauan instant dari toko ini. Silakan ubah titik koordinat lokasi alamat pengiriman yang lebih dekat agar dapat melakukan checkout.
              </p>
            </div>
          </div>
        )}

      {/* BAGIAN UTAMA: TABS METODE PENGIRIMAN */}
      {!isServiceOrder && destination_village_id && (
        <div className="space-y-3 pt-1 pb-2">
          {/* Header Pilihan Ekspedisi & Indikator Pengecekan Jarak */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: "var(--text-primary)" }}>
              <Truck className="w-3.5 h-3.5" style={{ color: "var(--terracotta)" }} />
              Metode Pengiriman
            </span>
            {isFetchingInstantRates ? (
              <span className="text-[10px] font-semibold text-emerald-800 flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300 animate-pulse">
                <Loader2 className="w-2.5 h-2.5 animate-spin text-emerald-600" />
                Mengecek jarak via KiriminAja...
              </span>
            ) : distanceKm !== null ? (
              <span className="text-[10px] font-semibold text-gray-500 flex items-center gap-1 bg-[#F5F2EB] px-2 py-0.5 rounded-full border border-[var(--cream-dark)]">
                <MapPin className="w-2.5 h-2.5 text-[var(--terracotta)]" />
                Jarak: {distanceKm} km {hasInstantFromApi ? "• Terjangkau" : ""}
              </span>
            ) : null}
          </div>

          {/* Tabs Ekspedisi: 1. COD (jika seller aktifkan), 2. Instant (selalu muncul), 3. Reguler (selalu muncul) */}
          <div
            className={`grid gap-1.5 p-1 bg-[#F3EFEA] rounded-xl border border-[var(--cream-dark)] ${
              canShowCod ? "grid-cols-3" : "grid-cols-2"
            }`}
          >
            {/* Tab 1: COD (hanya jika seller aktifkan) */}
            {canShowCod && (
              <button
                type="button"
                onClick={() => handleTabChange("cod")}
                className={`py-2 px-2 rounded-lg font-bold text-xs flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
                  activeTab === "cod"
                    ? "bg-[var(--terracotta)] text-white shadow-sm ring-1 ring-[var(--terracotta)]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                }`}
              >
                <div className="flex items-center gap-1">
                  <Banknote className="w-3.5 h-3.5" />
                  <span>COD</span>
                </div>
                <span
                  className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full ${
                    activeTab === "cod" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  Bebas Ongkir
                </span>
              </button>
            )}

            {/* Tab 2: Instant (Selalu muncul, disable jika jarak >= 40 KM atau tidak memenuhi syarat) */}
            <button
              type="button"
              onClick={() => {
                if (!canShowInstant) {
                  handleDisabledTabClick("instant");
                  return;
                }
                handleTabChange("instant");
              }}
              className={`py-2 px-2 rounded-lg font-bold text-xs flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
                !canShowInstant
                  ? "bg-gray-100/90 text-gray-400 border border-dashed border-gray-300 cursor-not-allowed hover:bg-rose-50/70 hover:text-rose-600 hover:border-rose-300"
                  : activeTab === "instant"
                  ? "bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
              }`}
              title={!canShowInstant ? getInstantDisabledReason() : "Pilih Kurir Instant"}
              aria-disabled={!canShowInstant}
            >
              <div className="flex items-center gap-1">
                <Zap className={`w-3.5 h-3.5 ${canShowInstant ? "fill-current" : "text-gray-400"}`} />
                <span>Instant</span>
                {!canShowInstant && <Lock className="w-2.5 h-2.5 ml-0.5 text-gray-400" />}
              </div>
              <span
                className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full ${
                  !canShowInstant
                    ? "bg-gray-200/80 text-gray-500"
                    : activeTab === "instant"
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {canShowInstant ? (hasInstantFromApi ? `${instantRates.length} Opsi` : "< 40 km") : "Tidak Tersedia"}
              </span>
            </button>

            {/* Tab 3: Reguler (Selalu muncul, disable jika produk ready to eat atau frozen) */}
            <button
              type="button"
              onClick={() => {
                if (!canShowRegular) {
                  handleDisabledTabClick("regular");
                  return;
                }
                handleTabChange("regular");
              }}
              className={`py-2 px-2 rounded-lg font-bold text-xs flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
                !canShowRegular
                  ? "bg-gray-100/90 text-gray-400 border border-dashed border-gray-300 cursor-not-allowed hover:bg-rose-50/70 hover:text-rose-600 hover:border-rose-300"
                  : activeTab === "regular"
                  ? "bg-[var(--terracotta)] text-white shadow-sm ring-1 ring-[var(--terracotta)]"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
              }`}
              title={!canShowRegular ? getRegularDisabledReason() : "Pilih Kurir Reguler"}
              aria-disabled={!canShowRegular}
            >
              <div className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                <span>Reguler</span>
                {!canShowRegular && <Lock className="w-2.5 h-2.5 ml-0.5 text-gray-400" />}
              </div>
              <span
                className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full ${
                  !canShowRegular
                    ? "bg-gray-200/80 text-gray-500"
                    : activeTab === "regular"
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {canShowRegular ? `${regularRates.length} Opsi` : "Tidak Tersedia"}
              </span>
            </button>
          </div>

          {/* Banner Peringatan Inline saat User Mengklik Tab yang Di-disable */}
          {disabledTabError && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-[11px] text-rose-800 leading-relaxed">
                <strong>Opsi {disabledTabError.tab} Dinonaktifkan:</strong>{" "}
                {disabledTabError.message}
              </div>
            </div>
          )}

          {/* KONTEN TAB: 1. Tab COD */}
          {activeTab === "cod" && canShowCod && (
            <div className="p-3 bg-emerald-50/70 border border-emerald-300 rounded-xl space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 flex-shrink-0 mt-0.5">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      COD (Cash on Delivery)
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                        Aktif
                      </span>
                    </h5>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Pengiriman langsung oleh Toko. Bayar tunai kepada kurir saat pesanan tiba di alamat Anda.
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-extrabold text-emerald-700 block">
                    Rp 0
                  </span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">
                    1-3 hari tiba
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* KONTEN TAB: 2. Tab Instant atau 3. Tab Reguler */}
          {activeTab !== "cod" && (
            <div>
              {isCurrentTabLoading ? (
                <div className="p-6 text-center space-y-2 bg-white rounded-xl border border-[var(--cream-dark)]">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-[var(--terracotta)]" />
                  <p className="text-xs font-semibold text-gray-600">
                    {activeTab === "instant"
                      ? "Mengecek jarak & tarif kurir Instant KiriminAja..."
                      : "Memuat pilihan kurir Reguler dari KiriminAja..."}
                  </p>
                </div>
              ) : isErrorShippingRates || (activeTab === "instant" && isErrorInstantRates) ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-rose-700 text-xs">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {activeTab === "instant"
                        ? errorInstantRates?.message || "Gagal memuat kurir Instant"
                        : errorShippingRates?.message || "Gagal memuat tarif kurir"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="btn btn-secondary btn-sm flex items-center gap-1 text-[11px] px-2 py-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Coba Lagi
                  </button>
                </div>
              ) : currentTabRates.length === 0 ? (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-xs text-gray-500">
                  {activeTab === "instant"
                    ? "Kurir Instant (GoSend / Grab) tidak tersedia untuk rute koordinat lokasi ini."
                    : "Tidak ada opsi kurir Reguler yang tersedia untuk rute alamat ini."}
                </div>
              ) : (
                <div className="grid gap-2 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin">
                  {currentTabRates.map((rate) => {
                    const key = `${rate.service}_${rate.service_type}`;
                    const isSelected = activeShipping && `${activeShipping.service}_${activeShipping.service_type}` === key;
                    const isInstant = isRateInstant(rate);

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectRate(rate)}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                          isSelected
                            ? isInstant
                              ? "border-emerald-600 bg-emerald-50/60 shadow-sm ring-1 ring-emerald-600"
                              : "border-[var(--terracotta)] bg-[#FFF8F4] shadow-sm ring-1 ring-[var(--terracotta)]"
                            : "border-[var(--cream-dark)] bg-white hover:border-[#D0C0B0] hover:bg-[#FAF8F5]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                              isSelected
                                ? isInstant
                                  ? "border-emerald-600 bg-emerald-600"
                                  : "border-[var(--terracotta)] bg-[var(--terracotta)]"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div className="truncate">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-xs uppercase tracking-wide" style={{ color: "var(--text-primary)" }}>
                                {rate.service}
                              </span>

                              {isInstant ? (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-0.5 border border-emerald-300">
                                  <Zap className="w-2.5 h-2.5 fill-emerald-600" />
                                  INSTANT
                                </span>
                              ) : (
                                <span
                                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                                  style={{
                                    background: "var(--cream)",
                                    color: "var(--text-secondary)",
                                  }}
                                >
                                  {rate.service_type}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] truncate text-gray-500 mt-0.5">
                              {rate.service_name}
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span
                            className="font-extrabold text-xs block"
                            style={{
                              color: isSelected
                                ? isInstant
                                  ? "#059669"
                                  : "var(--terracotta)"
                                : "var(--text-primary)",
                            }}
                          >
                            {rate.cost.formatted}
                          </span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">
                            {formatEtdDisplay(rate.etd, isInstant)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Ongkos Kirim Ringkasan */}
      <div className="checkout-shipping-row items-start">
        <span className="checkout-shipping-label mt-0.5">
          {isServiceOrder ? "Ongkos Kirim" : "Ongkos Kirim Terpilih"}
        </span>
        <div className="text-right max-w-[220px]">
          {isServiceOrder ? (
            /* Produk Jasa: Bebas Ongkir */
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-2.5 py-1 rounded-lg inline-block">
              Rp 0 (Bebas Ongkir)
            </span>
          ) : !destination_village_id ? (
            /* Belum pilih alamat */
            <span className="checkout-badge-alert">
              <i className="fas fa-exclamation-circle" />
              Tentukan Alamat
            </span>
          ) : activeTab === "cod" && canShowCod ? (
            /* COD: Rp 0 */
            <div className="flex flex-col items-end gap-1">
              <span className="font-extrabold text-sm text-emerald-700">
                Rp 0
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 mt-0.5">
                <Banknote className="w-2.5 h-2.5" />
                COD (Bayar di Tempat)
              </span>
            </div>
          ) : isCurrentTabLoading ? (
            /* Loading */
            <div className="flex items-center gap-2 justify-end text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
              <Loader2 className="animate-spin w-3.5 h-3.5" style={{ color: "var(--terracotta)" }} />
              <span>Memeriksa KiriminAja...</span>
            </div>
          ) : isReadyToEatOrFrozen && hasCoordinates && !isFetchingInstantRates && !hasInstantFromApi && !canShowCod ? (
            /* KONDISI Khusus Ready to Eat / Frozen di luar 40 KM */
            <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
              Di Luar Jangkauan Instant
            </span>
          ) : isErrorShippingRates || (currentTabRates.length === 0 && destination_village_id && activeTab !== "cod") ? (
            /* Error atau kosong */
            <div className="flex flex-col items-end gap-2">
              <div className="checkout-badge-warning max-w-[200px] text-right">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">
                  {errorShippingRates?.message || "Kurir tidak tersedia"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRetry}
                className="btn btn-secondary btn-sm"
                style={{ padding: "6px 12px", fontSize: "11px", borderRadius: "8px" }}
              >
                <RefreshCw className="w-2.5 h-2.5" />
                Coba lagi
              </button>
            </div>
          ) : activeShipping ? (
            /* Opsi Terpilih */
            <div className="flex flex-col items-end gap-1">
              <span className="font-extrabold text-sm" style={{ color: "var(--text-primary)" }}>
                {activeShipping.cost.formatted}
              </span>
              <div className="flex flex-col items-end">
                {isRateInstant(activeShipping) ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 mt-1">
                    <Zap className="w-2.5 h-2.5 fill-emerald-600" />
                    {activeShipping.service_name} ({activeShipping.service.toUpperCase()})
                  </span>
                ) : (
                  <span className="checkout-item-badge mt-1">
                    {activeShipping.service_name} ({activeShipping.service.toUpperCase()} - {activeShipping.service_type})
                  </span>
                )}
              </div>
            </div>
          ) : (
            <span className="checkout-badge-alert">
              Tidak tersedia
            </span>
          )}
        </div>
      </div>

      {/* Pengurangan Total Diskon */}
      {totalDiscount > 0 && (
        <div className="checkout-shipping-row">
          <span className="checkout-shipping-label font-medium flex items-center gap-1.5" style={{ color: "#059669" }}>
            <i className="fas fa-tag text-xs" />
            Total Diskon
          </span>
          <span className="checkout-shipping-value font-bold" style={{ color: "#059669" }}>
            - Rp {totalDiscount.toLocaleString("id-ID")}
          </span>
        </div>
      )}

      {/* Total Belanja */}
      <div className="checkout-total-container">
        <div>
          <span className="checkout-total-title">
            Total Pembayaran
          </span>
          <span className="checkout-total-subtitle">
            {isServiceOrder
              ? "Produk Jasa (Tanpa Ongkir)"
              : activeTab === "cod"
              ? "Metode COD (Ongkir Rp 0)"
              : "Termasuk Ongkos Kirim"}
          </span>
        </div>
        <span className="checkout-total-price">
          {isServiceOrder || activeShipping ? `Rp ${total.toLocaleString("id-ID")}` : "-"}
        </span>
      </div>
    </div>
  );
}
