"use client";

import { useAddressPrimary } from "@/features/address/hooks";
import { CartItem, Store } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/features/store/hooks";
import { CheckoutStep } from "@/components/checkouts/lib";
import CheckoutEmpty from "@/components/checkouts/CheckoutEmpyt";
import CheckoutSkeletonPage from "@/components/checkouts/CheckoutSkeletonPage";
import CheckoutForm from "./CheckoutForm";
import CheckoutMixedOrder from "./CheckoutMixedOrder";
import { hasMixedOrderItems, isGoodsItem, isServiceItem } from "@/lib/product-helper";
import { toast } from "sonner";

export const animationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const useLocalCheckoutItem = () => {
  const [store, setStore] = useState<Store>();
  const [isLoading, setLoading] = useState(true);

  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const itemData = localStorage.getItem("checkout_items");
    if (itemData) {
      try {
        setLoading(true);
        const parsed = JSON.parse(itemData);

        if (parsed) {
          const { store, items = [] } = parsed;
          setStore(store);
          setItems(items);
        }
        setLoading(false);
      } catch (e) {
        console.error("Gagal parsing checkout_items", e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  return { store, isLoading, items, setItems };
};

export default function CheckoutItem({
  currentStep: step,
}: {
  currentStep: CheckoutStep;
}) {
  const searchParams = useSearchParams();
  const { isLoading: isLocalLoading, items, store: localStore, setItems } = useLocalCheckoutItem();

  const storeId = searchParams.get("store") || localStore?.id || "";
  const { data: storeApiData, isLoading: isStoreLoading } = useStore(storeId);

  // Selalu prioritaskan data toko terbaru dari database / API SlemanMart
  const store: Store | undefined = useMemo(() => {
    if (storeApiData?.data) {
      return {
        ...(localStore || {}),
        ...storeApiData.data,
      } as Store;
    }
    return localStore;
  }, [storeApiData?.data, localStore]);

  const { data: primaryAddress, isLoading: loadPrimaryAddress } =
    useAddressPrimary();

  const isLoading = isLocalLoading || (Boolean(storeId) && isStoreLoading && !localStore);

  // Validasi: Jenis barang dan jasa tidak boleh digabung dalam satu checkout order
  const isMixedOrder = useMemo(() => hasMixedOrderItems(items), [items]);

  const handleSelectFilteredType = (type: "goods" | "service") => {
    if (!store) return;
    const filtered = items.filter((item) =>
      type === "service" ? isServiceItem(item) : isGoodsItem(item)
    );
    const saveLocal = {
      store,
      items: filtered,
    };
    try {
      localStorage.setItem("checkout_items", JSON.stringify(saveLocal));
    } catch (err) {
      console.error("Gagal memperbarui checkout_items:", err);
    }
    setItems(filtered);
    toast.success(
      type === "goods"
        ? "Melanjutkan checkout khusus Produk Barang."
        : "Melanjutkan checkout khusus Layanan Jasa."
    );
  };

  const renderContent = () => {
    if (isLoading || loadPrimaryAddress) {
      return <CheckoutSkeletonPage />;
    } else if (!isLoading && !!store && items && items.length > 0) {
      if (isMixedOrder) {
        return (
          <CheckoutMixedOrder
            items={items}
            store={store}
            onSelectType={handleSelectFilteredType}
          />
        );
      }
      return (
        <CheckoutForm
          address={primaryAddress?.data}
          store={store}
          items={items}
        />
      );
    } else {
      return <CheckoutEmpty />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        variants={animationVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
      >
        <div id="orderSection">
          {renderContent()}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
