import { apiClient } from "@/lib/api-client";
import type { Cart, CartItem } from "@/types";

// Tipe untuk data saat menambahkan item ke keranjang
export type AddToCartData = {
  product_id: string;
  variant_id?: string;
  quantity: number;
};

/** Mengambil data keranjang pengguna saat ini */
export const getCartItems = (): Promise<{data:CartItem[]}> => {
  return apiClient<{data:CartItem[]}>('/customer/cart/items');
};

/** Mengambil data keranjang pengguna saat ini */
export const getCart = (): Promise<{data:Cart}> => {
  return apiClient<{data:Cart}>('/customer/cart');
};


/** Menambah item baru ke keranjang */
export const addToCart = (data: AddToCartData): Promise<Cart> => {
  return apiClient<Cart>('/customer/cart/items', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/** Mengupdate kuantitas item di keranjang */
export const updateCartItem = ({ item_id, quantity,variant_id }: { item_id: string; quantity: number,variant_id?:string  | null }): Promise<Cart> => {
  return apiClient<Cart>(`/customer/cart/items/${item_id}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity,variant_id }),
  });
};

/** Menghapus item dari keranjang */
export const removeCartItem = (itemId: string): Promise<Cart> => {
  return apiClient<Cart>(`/customer/cart/items/${itemId}`, {
    method: 'DELETE',
  });
};