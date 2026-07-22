'use client';

export const GUEST_CART_KEY = 'guest_cart';

export interface GuestCartItem {
  /** ID unik item dalam guest cart (random uuid) */
  id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  // Info tampilan
  product_name: string;
  product_thumbnail: string;
  product_price_value: number;
  product_price_formatted: string;
  variant_name?: string;
  variant_price_value?: number;
  variant_price_formatted?: string;
  // Info toko (untuk pengelompokan)
  store_id: string;
  store_name: string;
  store_logo_url: string;
  store_address: string;
  store_slug?: string;
  store_qris_url?: string;
  store_village_id?: string;
  store_district_id?: string;
  store_regency_id?: string;
  store_description?: string;
}

/** Membaca semua item dari guest cart */
export const getGuestCart = (): GuestCartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? (JSON.parse(raw) as GuestCartItem[]) : [];
  } catch {
    return [];
  }
};

const dispatchCartUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('guest-cart-updated'));
  }
};

/** Menambahkan item ke guest cart (merge jika produk + varian sudah ada) */
export const addToGuestCart = (item: Omit<GuestCartItem, 'id'>): GuestCartItem[] => {
  const current = getGuestCart();
  const existingIdx = current.findIndex(
    (i) => i.product_id === item.product_id && i.variant_id === item.variant_id
  );
  let updated: GuestCartItem[];
  if (existingIdx !== -1) {
    updated = current.map((i, idx) =>
      idx === existingIdx ? { ...i, quantity: i.quantity + item.quantity } : i
    );
  } else {
    const newItem: GuestCartItem = {
      ...item,
      id: crypto.randomUUID(),
    };
    updated = [...current, newItem];
  }
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updated));
  dispatchCartUpdate();
  return updated;
};

/** Menghapus satu item dari guest cart berdasarkan id */
export const removeFromGuestCart = (id: string): GuestCartItem[] => {
  const updated = getGuestCart().filter((i) => i.id !== id);
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updated));
  dispatchCartUpdate();
  return updated;
};

/** Mengupdate quantity item di guest cart */
export const updateGuestCartItem = (id: string, quantity: number): GuestCartItem[] => {
  let updated: GuestCartItem[];
  if (quantity <= 0) {
    updated = getGuestCart().filter((i) => i.id !== id);
  } else {
    updated = getGuestCart().map((i) => (i.id === id ? { ...i, quantity } : i));
  }
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updated));
  dispatchCartUpdate();
  return updated;
};

/** Menghapus seluruh guest cart (dipanggil setelah sync ke server) */
export const clearGuestCart = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GUEST_CART_KEY);
  dispatchCartUpdate();
};
