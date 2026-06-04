"use client";

import { useShippingRates } from "@/features/shipping/hooks";
import { Product, ResponseShippingRates, Variant } from "@/types";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Loader2, RefreshCw, AlertTriangle, PackageCheck } from "lucide-react";

interface ShippingCardEstimationProps {
  storeVillageId: number;
  items: Array<{
    id?: string;
    cart_item_id?: string;
    product: Product;
    variant?: Variant;
    quantity: number;
  }>;
  handleValidShipping?: (val: ResponseShippingRates) => void;
}

export const service_name = "jne";

/** Buat mock shipping berdasarkan subtotal (10%, min 10rb, max 50rb) */
function createMockShipping(subtotal: number): ResponseShippingRates {
  const mockCost = Math.min(Math.max(Math.round((subtotal * 0.1) / 1000) * 1000, 10000), 50000);
  return {
    service: "jne",
    service_name: "JNE Reguler (Estimasi)",
    service_type: "REG",
    cost: {
      value: mockCost,
      amount: String(mockCost),
      formatted: `Rp ${mockCost.toLocaleString("id-ID")}`,
      currency: "IDR",
    },
    etd: "2-4",
  };
}

export default function ShippingCardEstimation({
  items,
  storeVillageId,
  handleValidShipping = () => {},
}: ShippingCardEstimationProps) {
  const { watch } = useFormContext();

  // State: apakah user memilih pakai mock shipping secara manual
  const [useMock, setUseMock] = useState(false);

  const destination_village_id = watch("village_id");

  const {
    data: shippingRate,
    isLoading: isLoadingShippingRates,
    error: errorShippingRates,
    refetch,
  } = useShippingRates({
    origin_village_id: storeVillageId,
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

  const subtotal = items.reduce(
    (acc, item) =>
      acc +
      item.quantity *
        (item.variant ? item.variant.price.value : item.product.price.value),
    0
  );

  // Cek apakah query sukses tetapi merupakan data mock fallback dari hook
  const isHookMock = !!shippingRate && 'isMock' in shippingRate && shippingRate.isMock;
  const errorMsg = (shippingRate && 'errorMsg' in shippingRate) ? (shippingRate.errorMsg as string) : "";

  // Data real/mock dari query
  const queryShipping = shippingRate?.data
    ? (shippingRate.data.find((item) => item.service === service_name) ??
      shippingRate.data[0] ??
      null)
    : null;

  // Manual mock fallback jika dipicu oleh state useMock
  const manualMockShipping = useMock ? createMockShipping(subtotal) : null;

  // Active shipping prioritizes query result (which could be the hook mock)
  const activeShipping: ResponseShippingRates | null = queryShipping ?? manualMockShipping;

  const total = activeShipping
    ? subtotal + Number(activeShipping.cost.value ?? 0)
    : 0;

  const isEstimationMockActive = isHookMock || useMock;

  // Reset mock saat user ganti desa
  useEffect(() => {
    setUseMock(false);
  }, [destination_village_id]);

  // Notify parent saat shipping valid (baik real mapupun mock fallback)
  useEffect(() => {
    if (activeShipping) {
      handleValidShipping(activeShipping);
    }
  }, [activeShipping]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRetry = () => {
    setUseMock(false);
    refetch();
  };

  return (
    <div className="checkout-shipping-section space-y-4">
      {/* Subtotal Barang */}
      <div className="checkout-shipping-row">
        <span className="checkout-shipping-label">Subtotal Barang</span>
        <span className="checkout-shipping-value">
          Rp {subtotal.toLocaleString("id-ID")}
        </span>
      </div>

      {/* Ongkos Kirim */}
      <div className="checkout-shipping-row items-start">
        <span className="checkout-shipping-label mt-0.5">Ongkos Kirim</span>
        <div className="text-right max-w-[220px]">
          {/* Belum pilih alamat */}
          {!destination_village_id ? (
            <span className="checkout-badge-alert">
              <i className="fas fa-exclamation-circle" />
              Tentukan Alamat
            </span>
          ) : isLoadingShippingRates ? (
            /* Loading */
            <div className="flex items-center gap-2 justify-end text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
              <Loader2 className="animate-spin w-3.5 h-3.5" style={{ color: "var(--terracotta)" }} />
              <span>Mengkalkulasi...</span>
            </div>
          ) : errorShippingRates && !useMock ? (
            /* Error dari vendor — tampilkan opsi mock */
            <div className="flex flex-col items-end gap-2">
              <div className="checkout-badge-warning">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Cek ongkir tidak tersedia</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: "6px 12px", fontSize: "11px", borderRadius: "8px" }}
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  Coba lagi
                </button>
                <button
                  type="button"
                  onClick={() => setUseMock(true)}
                  className="btn btn-primary btn-sm"
                  style={{ padding: "6px 12px", fontSize: "11px", borderRadius: "8px" }}
                >
                  <PackageCheck className="w-2.5 h-2.5" />
                  Gunakan estimasi
                </button>
              </div>
            </div>
          ) : activeShipping ? (
            /* Data aktif (baik real maupun mock fallback dari hook/state) */
            <div className="flex flex-col items-end gap-1">
              <span 
                className="font-extrabold text-sm" 
                style={{ color: isEstimationMockActive ? "var(--saffron)" : "var(--text-primary)" }}
              >
                {activeShipping.cost.formatted}
              </span>
              <div className="flex flex-col items-end">
                <span className="checkout-item-badge mt-1">
                  {activeShipping.service_name} ({activeShipping.service.toUpperCase()})
                </span>
                {isEstimationMockActive && (
                  <span 
                    className="checkout-badge-warning mt-1" 
                    style={{ fontSize: "9px", padding: "2px 6px" }}
                  >
                    ✦ Estimasi Sementara
                  </span>
                )}
              </div>
              {isEstimationMockActive && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="text-[10px] underline flex items-center gap-1 transition-colors mt-1.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  Coba cek ongkir lagi
                </button>
              )}
            </div>
          ) : (
            /* Tidak ada data sama sekali */
            <span className="checkout-badge-alert">
              Tidak tersedia
            </span>
          )}
        </div>
      </div>

      {/* Banner peringatan saat pakai mock */}
      {isEstimationMockActive && (
        <div className="checkout-shipping-banner">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--saffron)" }} />
          <span style={{ color: "var(--text-primary)" }}>
            {errorMsg ? (
              <>
                Layanan cek ongkir sedang tidak tersedia (<em>{errorMsg}</em>). Menggunakan <strong>estimasi ongkir sementara</strong> agar Anda dapat melanjutkan transaksi. Biaya final akan dikonfirmasi oleh penjual.
              </>
            ) : (
              <>
                Ongkos kirim bersifat <strong>estimasi sementara</strong> karena layanan cek ongkir sedang tidak tersedia. Biaya final akan dikonfirmasi oleh penjual.
              </>
            )}
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
            Sudah termasuk PPN
          </span>
        </div>
        <span className="checkout-total-price">
          {activeShipping ? `Rp ${total.toLocaleString("id-ID")}` : "-"}
        </span>
      </div>
    </div>
  );
}
