"use client";

import { useShippingRates } from "@/features/shipping/hooks";
import { Product, ResponseShippingRates, Variant } from "@/types";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

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

export default function ShippingCardEstimation({
  items,
  storeVillageId,
  handleValidShipping = () => {},
}: ShippingCardEstimationProps) {
  const { watch } = useFormContext();

  const destination_village_id = watch("village_id");

  const {
    data: shippingRate,
    isLoading: isLoadingShippingRates,
    error: errorShippingRates,
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

  const shipping = shippingRate?.data
    ? shippingRate.data.find((item) => item.service === service_name)
    : null;

  const subtotal = items.reduce(
    (acc, item) =>
      acc +
      item.quantity *
        (item.variant ? item.variant.price.value : item.product.price.value),
    0
  );

  const total = shipping ? subtotal + Number(shipping?.cost.value ?? 0) : "-";
  useEffect(() => {
    if (shipping) {
      handleValidShipping(shipping);
    }
  }, [shipping]);

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600">Ongkos Kirim</span>

        {!destination_village_id ? (
          <p className="text-red-500 mt-2">
            Silahkan tentukan alamat pengiriman anda!
          </p>
        ) : isLoadingShippingRates ? (
          <span>Mengkalkulasi ongkos kirim...</span>
        ) : errorShippingRates ? (
          <p className="text-red-500 mt-2 max-w-100 truncate">
            {errorShippingRates.message || "Gagal memuat ongkos kirim."}
          </p>
        ) : shipping ? (
          <span className="font-medium">
            {shipping ? shipping.cost.formatted : "Rp.0 "}{" "}
            {shippingRate?.data ? `( ${shipping?.service_name})` : ""}
          </span>
        ) : (
          <p className="text-red-500 mt-2">
            Layanan pengiriman tidak tersedia untuk alamat tujuan.
          </p>
        )}
      </div>
      <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-2">
        <span>Total</span>
        <span className="text-primary">Rp {total.toLocaleString()}</span>
      </div>
    </div>
  );
}
