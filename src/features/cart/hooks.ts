import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart, addToCart, updateCartItem, removeCartItem, getCartItems } from "./api";
import type { AddToCartData } from "./api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CART_QUERY_KEY = ["cart"];

/**
 * Hook untuk mengambil data keranjang.
 * Data ini akan di-cache dan bisa diakses di seluruh aplikasi.
 */
export const useCartItems = () => {
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: getCartItems,
  });
};

/**
 * Hook untuk mengambil  keranjang user.
 * Data ini akan di-cache dan bisa diakses di seluruh aplikasi.
 */
export const useCart = () => {
  return useQuery({
    queryKey: [CART_QUERY_KEY[1] + "-item"],
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
      // Invalidate query 'cart' agar data keranjang di seluruh aplikasi otomatis ter-update
      queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY[0] + "-item", CART_QUERY_KEY[0]] });
      router.push("/keranjang")
    },
    onError: (error) => {
      toast.error("Gagal menambahkan ke keranjang", { description: error.message });
    }
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