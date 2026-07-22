import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart, addToCart, updateCartItem, removeCartItem, getCartItems } from "./api";
import type { AddToCartData } from "./api";
import { toast } from "sonner";
import { useState, useEffect, useCallback } from "react";
import {
  getGuestCart,
  addToGuestCart,
  removeFromGuestCart,
  updateGuestCartItem,
  clearGuestCart,
  type GuestCartItem,
} from "@/lib/guest-cart-service";
import { getToken } from "@/lib/token-service";

const CART_ITEMS_KEY = ["cart"];
const CART_KEY = ["cart-summary"];

// Legacy alias kept for compatibility
const CART_QUERY_KEY = CART_ITEMS_KEY;

/**
 * Hook untuk mengambil data keranjang.
 * Data ini akan di-cache dan bisa diakses di seluruh aplikasi.
 */
export const useCartItems = () => {
  return useQuery({
    queryKey: CART_ITEMS_KEY,
    queryFn: getCartItems,
    enabled: typeof window !== "undefined" && !!getToken(),
  });
};

/**
 * Hook untuk mengambil  keranjang user.
 * Data ini akan di-cache dan bisa diakses di seluruh aplikasi.
 */
export const useCart = () => {
  return useQuery({
    queryKey: CART_KEY,
    queryFn: getCart,
    enabled: typeof window !== "undefined" && !!getToken(),
  });
};

/**
 * Hook untuk menambah item ke keranjang (Mutation).
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddToCartData) => addToCart(data),
    onSuccess: () => {
      toast.success("Produk berhasil ditambahkan ke keranjang!");
      // Invalidate both cart query keys so navbar badge & list both refresh
      queryClient.invalidateQueries({ queryKey: CART_ITEMS_KEY });
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
    onError: (error: Error) => {
      toast.error("Gagal menambahkan ke keranjang", {
        description: error.message || "Terjadi kesalahan, coba lagi.",
      });
    },
  });
};

/**
 * Hook untuk mengupdate item di keranjang (Mutation).
 */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ item_id, quantity, variant_id, }: {quantityMode?: number , item_id: string, quantity: number, variant_id?: string | null }) => updateCartItem({ item_id, quantity, variant_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_ITEMS_KEY });
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
    onError: (error) => {
      toast.error("Gagal mengupdate item", { description: error.message });
    }
  });
};

/**
 * Hook untuk menghapus item dari keranjang (Mutation).
 */
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: () => {
      toast.success("Produk berhasil dihapus dari keranjang.");
      queryClient.invalidateQueries({ queryKey: CART_ITEMS_KEY });
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
    onError: (error) => {
      toast.error("Gagal menghapus item", { description: error.message });
    }
  });
};

// ─── Guest Cart Hooks ───────────────────────────────────────────────────────

/**
 * Hook untuk membaca, menambah, mengupdate, dan menghapus item di guest cart (localStorage).
 */
export const useGuestCart = () => {
  const [items, setItems] = useState<GuestCartItem[]>([]);

  const refreshCart = useCallback(() => {
    setItems(getGuestCart());
  }, []);

  // Baca dari localStorage hanya di client side dan dengarkan event update
  useEffect(() => {
    refreshCart();

    const handleCartUpdate = () => {
      refreshCart();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("guest-cart-updated", handleCartUpdate);
      window.addEventListener("storage", handleCartUpdate);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("guest-cart-updated", handleCartUpdate);
        window.removeEventListener("storage", handleCartUpdate);
      }
    };
  }, [refreshCart]);

  const addItem = useCallback((item: Omit<GuestCartItem, 'id'>) => {
    addToGuestCart(item);
    toast.success('Produk berhasil ditambahkan ke keranjang!');
  }, []);

  const removeItem = useCallback((id: string) => {
    removeFromGuestCart(id);
    toast.success('Produk berhasil dihapus dari keranjang.');
  }, []);

  const updateItem = useCallback((id: string, quantity: number) => {
    updateGuestCartItem(id, quantity);
  }, []);

  const clearAll = useCallback(() => {
    clearGuestCart();
  }, []);

  return { items, addItem, removeItem, updateItem, clearAll };
};

/**
 * Hook untuk sync guest cart ke server setelah user berhasil login.
 * Mengembalikan fungsi `syncGuestCart` yang dipanggil sekali setelah login.
 */
export const useSyncGuestCart = () => {
  const queryClient = useQueryClient();

  const syncGuestCart = useCallback(async () => {
    const guestItems = getGuestCart();
    if (guestItems.length === 0) return;

    // Kirim setiap item ke server secara berurutan
    for (const item of guestItems) {
      try {
        await addToCart({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
        });
      } catch {
        // Lanjutkan meskipun satu item gagal
      }
    }

    // Bersihkan guest cart setelah sync
    clearGuestCart();

    // Invalidate cart queries agar data terbaru diambil
    queryClient.invalidateQueries({ queryKey: CART_ITEMS_KEY });
    queryClient.invalidateQueries({ queryKey: CART_KEY });
  }, [queryClient]);

  return { syncGuestCart };
};