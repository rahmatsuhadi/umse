export interface ProductTypeInfo {
  type: 'service' | 'ready_to_serve' | 'frozen' | 'food' | 'product';
  label: string;
  badgeClass: string;
  smClass: string;
}

export interface ProductTypeSource {
  type?: string;
  is_food?: boolean | number;
  is_ready_to_serve?: boolean | number;
  is_frozen?: boolean | number;
  isFood?: boolean | number;
  isReadyToServe?: boolean | number;
  isFrozen?: boolean | number;
}

/**
 * Membedakan jenis produk menjadi:
 * - Jasa: '🛠️ Jasa'
 * - Siap Saji: '🍲 Siap Saji'
 * - Frozen Food: '🧊 Frozen'
 * - Makanan: '🍱 Makanan'
 * - Barang umum: '📦 Barang'
 */
export function getProductTypeInfo(product?: ProductTypeSource | null): ProductTypeInfo {
  if (!product) {
    return {
      type: 'product',
      label: '📦 Barang',
      badgeClass: 'tipe-barang',
      smClass: 'tipe-barang-sm',
    };
  }

  const typeStr = (product.type || '').toLowerCase();
  if (typeStr === 'service' || typeStr === 'jasa') {
    return {
      type: 'service',
      label: '🛠️ Jasa',
      badgeClass: 'tipe-jasa',
      smClass: 'tipe-jasa-sm',
    };
  }

  const isReadyToServe = Boolean(
    product.is_ready_to_serve ||
    product.isReadyToServe ||
    typeStr === 'ready_to_serve' ||
    typeStr === 'siap_saji' ||
    typeStr === 'siapsaji' ||
    typeStr === 'fast_food'
  );
  if (isReadyToServe) {
    return {
      type: 'ready_to_serve',
      label: '🍲 Siap Saji',
      badgeClass: 'tipe-siap-saji',
      smClass: 'tipe-siap-saji-sm',
    };
  }

  const isFrozen = Boolean(
    product.is_frozen ||
    product.isFrozen ||
    typeStr === 'frozen' ||
    typeStr === 'beku'
  );
  if (isFrozen) {
    return {
      type: 'frozen',
      label: '🧊 Frozen',
      badgeClass: 'tipe-frozen',
      smClass: 'tipe-frozen-sm',
    };
  }

  const isFood = Boolean(
    product.is_food ||
    product.isFood ||
    typeStr === 'food' ||
    typeStr === 'makanan'
  );
  if (isFood) {
    return {
      type: 'food',
      label: '🍱 Makanan',
      badgeClass: 'tipe-makanan',
      smClass: 'tipe-makanan-sm',
    };
  }

  return {
    type: 'product',
    label: '📦 Barang',
    badgeClass: 'tipe-barang',
    smClass: 'tipe-barang-sm',
  };
}
