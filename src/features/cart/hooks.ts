import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart, addToCart, updateCartItem, removeCartItem, getCartItems } from "./api";
import type { AddToCartData } from "./api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  });
};

/**
 * Hook untuk menambah item ke keranjang (Mutation).
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (data: AddToCartData) => addToCart(data),
    onSuccess: () => {
      toast.success("Produk berhasil ditambahkan ke keranjang!");
      // Invalidate both cart query keys so navbar badge & list both refresh
      queryClient.invalidateQueries({ queryKey: CART_ITEMS_KEY });
      queryClient.invalidateQueries({ queryKey: CART_KEY });
      router.push("/keranjang");
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
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
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
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: (error) => {
      toast.error("Gagal menghapus item", { description: error.message });
    }
  });
};