"use client";

import { useShippingRates } from "@/features/shipping/hooks";
import { Product, ResponseShippingRates, Variant } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Loader2, RefreshCw, AlertTriangle, Truck, Zap, ShieldCheck } from "lucide-react";
import { getComputedPrice } from "@/lib/price-helper";

interface ShippingCardEstimationProps {
  storeVillageId: number;
  storeLatitude?: number | null;
  storeLongitude?: number | null;
  items: Array<{
    id?: string;
    cart_item_id?: string;
    product: Product;
    variant?: Variant;
    quantity: number;
  }>;
  handleValidShipping?: (val: ResponseShippingRates | null) => void;
}

export const service_name = "jne";

export default function ShippingCardEstimation({
  items,
  storeVillageId,
  storeLatitude,
  storeLongitude,
  handleValidShipping = () => {},
}: ShippingCardEstimationProps) {
  const { watch } = useFormContext();

  // Kondisi 2: Kategori Jasa -> tidak ada opsi kurir (bebas ongkir)
  const isServiceOrder = useMemo(
    () =>
      items.length > 0 &&
      items.every((item) => {
        const type = item.product?.type?.toLowerCase();
        return type === "service" || type === "jasa";
      }),
    [items]
  );

  // Kondisi 3: Kategori barang, dan Is Ready to eat OR is Frozen -> tampilkan opsi kurir hanya instant
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

  // Key untuk kurir yang dipilih: `${service}_${service_type}`
  const [selectedServiceKey, setSelectedServiceKey] = useState<string>("");
  // Filter tab kurir: "all" | "instant" | "regular"
  const [filterType, setFilterType] = useState<"all" | "instant" | "regular">(
    isReadyToEatOrFrozen ? "instant" : "all"
  );

  // Jika kondisi ready to eat/frozen berubah, paksa filterType menjadi instant
  useEffect(() => {
    if (isReadyToEatOrFrozen) {
      setFilterType("instant");
    }
  }, [isReadyToEatOrFrozen]);

  const destination_village_id = watch("village_id");
  const watchedLatitude = watch("latitude");
  const watchedLongitude = watch("longitude");

  // Query tarif KiriminAja hanya jika BUKAN order jasa
  const {
    data: shippingRateResponse,
    isLoading: isLoadingShippingRates,
    isError: isErrorShippingRates,
    error: errorShippingRates,
    refetch,
  } = useShippingRates({
    origin_village_id: storeVillageId,
    include_instant: true,
    origin_lat: storeLatitude ? Number(storeLatitude) : undefined,
    origin_long: storeLongitude ? Number(storeLongitude) : undefined,
    destination_lat: watchedLatitude ? Number(watchedLatitude) : undefined,
    destination_long: watchedLongitude ? Number(watchedLongitude) : undefined,
    items: items.map((item) => {
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
    }),
    destination_village_id: Number(destination_village_id),
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

  // Daftar opsi pengiriman real langsung dari KiriminAja API
  const rawRates: ResponseShippingRates[] = useMemo(() => {
    return isServiceOrder ? [] : (shippingRateResponse?.data ?? []);
  }, [isServiceOrder, shippingRateResponse?.data]);

  // Hitung kurir instant
  const isRateInstant = (rate: ResponseShippingRates) =>
    ["gosend", "grab"].includes(rate.service.toLowerCase()) ||
    rate.service_type.toLowerCase() === "instant";

  // Filter daftar kurir berdasarkan kondisi
  // Jika Ready to Eat / Frozen, HANYA kurir instant yang boleh muncul
  const availableRates: ResponseShippingRates[] = useMemo(() => {
    if (isServiceOrder) return [];
    if (isReadyToEatOrFrozen) {
      return rawRates.filter((r) => isRateInstant(r));
    }
    return rawRates;
  }, [rawRates, isServiceOrder, isReadyToEatOrFrozen]);

  const instantCount = useMemo(
    () => rawRates.filter((r) => isRateInstant(r)).length,
    [rawRates]
  );

  const regularCount = rawRates.length - instantCount;

  // Filter daftar kurir berdasarkan tab aktif
  const filteredRates = useMemo(() => {
    if (isReadyToEatOrFrozen) {
      return availableRates; // Sudah difilter hanya instant
    }
    if (filterType === "instant") {
      return availableRates.filter((r) => isRateInstant(r));
    }
    if (filterType === "regular") {
      return availableRates.filter((r) => !isRateInstant(r));
    }
    return availableRates;
  }, [availableRates, filterType, isReadyToEatOrFrozen]);

  // Opsi terpilih: cari berdasarkan key, fallback ke opsi pertama
  const activeShipping: ResponseShippingRates | null = useMemo(() => {
    if (isServiceOrder) return null;
    return (
      filteredRates.find(
        (item) => `${item.service}_${item.service_type}` === selectedServiceKey
      ) ??
      filteredRates[0] ??
      null
    );
  }, [filteredRates, selectedServiceKey, isServiceOrder]);

  const total = isServiceOrder
    ? finalSubtotal
    : activeShipping
    ? finalSubtotal + Number(activeShipping.cost.value ?? 0)
    : 0;

  // Reset selected key saat user mengganti desa tujuan
  useEffect(() => {
    setSelectedServiceKey("");
  }, [destination_village_id]);

  // Set default selectedServiceKey saat data pertama kali masuk
  useEffect(() => {
    if (activeShipping && !selectedServiceKey) {
      setSelectedServiceKey(`${activeShipping.service}_${activeShipping.service_type}`);
    }
  }, [activeShipping, selectedServiceKey]);

  // Notify parent component saat opsi pengiriman aktif/berubah
  useEffect(() => {
    if (isServiceOrder) {
      // Untuk jasa, beri tahu parent bahwa pengiriman valid (bebas ongkir)
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
    } else {
      handleValidShipping(activeShipping);
    }
  }, [activeShipping, isServiceOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectRate = (rate: ResponseShippingRates) => {
    const key = `${rate.service}_${rate.service_type}`;
    setSelectedServiceKey(key);
    handleValidShipping(rate);
  };

  const handleRetry = () => {
    setSelectedServiceKey("");
    refetch();
  };

  const formatEtdDisplay = (etd: string, isInstant: boolean) => {
    if (!etd) return isInstant ? "1-2 jam tiba" : "Estimasi reguler";
    const lower = etd.toLowerCase();
    if (lower.includes("jam") || lower.includes("hour")) {
      return `${etd} tiba`;
    }
    return `${etd.replace(/hari/gi, "").trim()} hari`;
  };

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

      {/* KONDISI 2: Produk JASA — Tidak ada opsi kurir */}
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

      {/* KONDISI 3: Warning Khusus Ready to Eat / Frozen Food */}
      {!isServiceOrder && isReadyToEatOrFrozen && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] text-amber-800 leading-relaxed">
            <strong>Perhatian Produk Siap Saji / Frozen:</strong> Demi menjaga kesegaran dan kualitas, produk ini <strong>hanya dapat dikirim menggunakan kurir Instant</strong>.
          </div>
        </div>
      )}

      {/* Pilihan Ekspedisi / Kurir Real dari KiriminAja (Hanya untuk Produk Fisik / Barang) */}
      {!isServiceOrder && destination_village_id && availableRates.length > 0 && !isLoadingShippingRates && (
        <div className="space-y-2.5 pt-1 pb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: "var(--text-primary)" }}>
              <Truck className="w-3.5 h-3.5" style={{ color: "var(--terracotta)" }} />
              Pilih Ekspedisi ({availableRates.length} Opsi {isReadyToEatOrFrozen ? "Instant" : "Real"})
            </span>
          </div>

          {/* Filter Chips: Ditampilkan jika ada instant dan BUKAN restricted to instant only */}
          {!isReadyToEatOrFrozen && instantCount > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] pb-1">
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  filterType === "all"
                    ? "bg-[var(--terracotta)] text-white shadow-xs font-semibold"
                    : "bg-[#F3EFEA] text-gray-600 hover:bg-[#EAE4DC]"
                }`}
              >
                Semua ({availableRates.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("instant")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                  filterType === "instant"
                    ? "bg-emerald-600 text-white shadow-xs font-semibold"
                    : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                }`}
              >
                <Zap className="w-2.5 h-2.5 fill-current" />
                Instant ({instantCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("regular")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  filterType === "regular"
                    ? "bg-[var(--terracotta)] text-white shadow-xs font-semibold"
                    : "bg-[#F3EFEA] text-gray-600 hover:bg-[#EAE4DC]"
                }`}
              >
                Reguler ({regularCount})
              </button>
            </div>
          )}

          {/* List Opsi Kurir */}
          <div className="grid gap-2 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredRates.map((rate) => {
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
        </div>
      )}

      {/* Ongkos Kirim Ringkasan */}
      <div className="checkout-shipping-row items-start">
        <span className="checkout-shipping-label mt-0.5">
          {isServiceOrder ? "Ongkos Kirim" : "Ongkos Kirim Terpilih"}
        </span>
        <div className="text-right max-w-[220px]">
          {isServiceOrder ? (
            /* Produk Jasa: Gratis / Bebas Ongkir */
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-2.5 py-1 rounded-lg inline-block">
              Rp 0 (Bebas Ongkir)
            </span>
          ) : !destination_village_id ? (
            /* Belum pilih alamat */
            <span className="checkout-badge-alert">
              <i className="fas fa-exclamation-circle" />
              Tentukan Alamat
            </span>
          ) : isLoadingShippingRates ? (
            /* Loading */
            <div className="flex items-center gap-2 justify-end text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
              <Loader2 className="animate-spin w-3.5 h-3.5" style={{ color: "var(--terracotta)" }} />
              <span>Menghubungi KiriminAja...</span>
            </div>
          ) : isReadyToEatOrFrozen && availableRates.length === 0 ? (
            /* KONDISI 3: Ready to eat/frozen di luar jangkauan instant */
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
                Di Luar Jangkauan Instant
              </span>
            </div>
          ) : isErrorShippingRates || (availableRates.length === 0 && destination_village_id) ? (
            /* Error dari vendor */
            <div className="flex flex-col items-end gap-2">
              <div className="checkout-badge-warning max-w-[200px] text-right">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">
                  {errorShippingRates?.message || "Gagal memuat tarif KiriminAja"}
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
            /* Data aktif dari KiriminAja */
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
            /* Tidak ada data sama sekali */
            <span className="checkout-badge-alert">
              Tidak tersedia
            </span>
          )}
        </div>
      </div>

      {/* KONDISI 3: Pesan Error Alert Khusus jika Ready to Eat / Frozen di luar jangkauan instant */}
      {!isServiceOrder && isReadyToEatOrFrozen && destination_village_id && !isLoadingShippingRates && availableRates.length === 0 && (
        <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl flex items-start gap-3 shadow-xs animate-shake">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h5 className="text-xs font-bold text-rose-900">
              Alamat Di Luar Jangkauan Kurir Instant
            </h5>
            <p className="text-[11px] text-rose-700 mt-1 leading-relaxed">
              Produk makanan siap saji atau frozen food memerlukan pengantaran cepat dan <strong>hanya dapat dikirim via kurir Instant</strong>. Alamat tujuan Anda saat ini berada di luar area jangkauan kurir Instant dari toko ini. Silakan ubah alamat pengiriman yang lebih dekat dengan lokasi toko agar dapat melakukan checkout.
            </p>
          </div>
        </div>
      )}

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
            {isServiceOrder ? "Produk Jasa (Tanpa Ongkir)" : "Termasuk Ongkos Kirim"}
          </span>
        </div>
        <span className="checkout-total-price">
          {isServiceOrder || activeShipping ? `Rp ${total.toLocaleString("id-ID")}` : "-"}
        </span>
      </div>
    </div>
  );
}
