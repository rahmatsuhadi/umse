"use client";

import { useAddressPrimary } from "@/features/address/hooks";
import { CartItem, Store } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckoutStep } from "@/components/checkouts/lib";
import CheckoutEmpty from "@/components/checkouts/CheckoutEmpyt";
import CheckoutSkeletonPage from "@/components/checkouts/CheckoutSkeletonPage";
import CheckoutForm from "./CheckoutForm";

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

  return { store, isLoading, items };
};

export default function CheckoutItem({
  currentStep: step,
}: {
  currentStep: CheckoutStep;
}) {
  const { isLoading, items, store } = useLocalCheckoutItem();

  const { data: primaryAddress, isLoading: loadPrimaryAddress } =
    useAddressPrimary();

  const renderContent = () => {
    if (isLoading || loadPrimaryAddress) {
      return <CheckoutSkeletonPage />;
    } else if (!isLoading && !!store && !!items) {
      return (
        <div className="p-6">
          <CheckoutForm
            address={primaryAddress?.data}
            store={store}
            items={items}
          />
        </div>
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
        <div id="orderSection" className="bg-white rounded-lg shadow-md mb-6">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">Detail Pesanan</h3>
            <p className="text-sm text-gray-600">
              Lengkapi informasi pengiriman
            </p>
          </div>

          {renderContent()}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
