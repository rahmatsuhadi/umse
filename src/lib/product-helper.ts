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

/**
 * Membersihkan karakter pemisah di awal / akhir string dan kurung pembungkus
 */
function cleanOuterText(str: string): string {
  let s = str
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/^[\s\-_:,/|]+|[\s\-_:,/|]+$/g, '')
    .trim();

  if (s.startsWith('(') && s.endsWith(')')) {
    s = s.slice(1, -1).trim();
  }

  return s.replace(/^[\s\-_:,/|]+|[\s\-_:,/|]+$/g, '').trim();
}

/**
 * Menghilangkan teks duplikat antara product_name dan variant_name,
 * serta memastikan nama produk dan varian yang ditampilkan bersih dan jelas.
 */
export function getCleanItemNames(
  rawProductName?: string | null,
  rawVariantName?: string | null
): { productName: string; variantName: string | null } {
  const p = cleanOuterText(rawProductName || '');
  const v = cleanOuterText(rawVariantName || '');

  if (!v) {
    return { productName: p || 'Produk', variantName: null };
  }

  const lowerV = v.toLowerCase();
  if (
    lowerV === 'tanpa varian' ||
    lowerV === 'tanpa variant' ||
    lowerV === 'default' ||
    lowerV === 'standard' ||
    lowerV === '-' ||
    lowerV === 'none'
  ) {
    return { productName: p || 'Produk', variantName: null };
  }

  if (!p) {
    return { productName: v || 'Produk', variantName: null };
  }

  const lowerP = p.toLowerCase();

  // 1. Jika nama produk dan varian persis sama (case-insensitive)
  if (lowerP === lowerV) {
    return { productName: p, variantName: null };
  }

  // 2. Jika nama produk sudah berakhiran dengan nama varian (contoh: "Batik Sleman - Biru" dengan varian "Biru")
  if (lowerP.endsWith(lowerV) && p.length > v.length) {
    const pTrimmed = cleanOuterText(p.slice(0, p.length - v.length));
    if (pTrimmed) {
      return { productName: pTrimmed, variantName: v };
    }
  }

  // 3. Jika nama varian diawali nama produk (contoh: "dimsum frozen isi 20 pcs" dengan produk "dimsum")
  if (lowerV.startsWith(lowerP)) {
    const remainder = cleanOuterText(v.slice(p.length));
    return { productName: p, variantName: remainder || null };
  }

  // 4. Jika nama varian diakhiri nama produk (contoh: "Biru - Kaos Polos" dengan produk "Kaos Polos")
  if (lowerV.endsWith(lowerP)) {
    const remainder = cleanOuterText(v.slice(0, v.length - p.length));
    return { productName: p, variantName: remainder || null };
  }

  // 5. Cek kata awalan bersama (common prefix words)
  // Contoh: "sambel pecel handayani" dan "sambel pecel family box" -> varian jadi "family box"
  // Contoh: "Wedang Uwuh Larecang" dan "Wedang Uwuh Isi 5" -> varian jadi "Isi 5"
  const pWords = p.split(/\s+/);
  const vWords = v.split(/\s+/);
  let matchCount = 0;
  while (
    matchCount < pWords.length &&
    matchCount < vWords.length &&
    pWords[matchCount].toLowerCase().replace(/[^a-z0-9]/gi, '') ===
      vWords[matchCount].toLowerCase().replace(/[^a-z0-9]/gi, '')
  ) {
    matchCount++;
  }

  if (matchCount > 0) {
    const remainingWords = vWords.slice(matchCount);
    if (remainingWords.length > 0) {
      const remainder = cleanOuterText(remainingWords.join(' '));
      if (remainder) {
        return { productName: p, variantName: remainder };
      }
    }
  }

  return { productName: p, variantName: v || null };
}

