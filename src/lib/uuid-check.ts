export type UUIDVersion = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | "any";

const UUID_REGEXPS: Record<UUIDVersion, RegExp> = {
  1: /^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  2: /^[0-9a-f]{8}-[0-9a-f]{4}-2[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  3: /^[0-9a-f]{8}-[0-9a-f]{4}-3[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  4: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  5: /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  6: /^[0-9a-f]{8}-[0-9a-f]{4}-6[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  7: /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  8: /^[0-9a-f]{8}-[0-9a-f]{4}-8[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  any: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
};

export function isUUID(value: unknown, version?: UUIDVersion): boolean {
  if (typeof value !== "string") return false;
  const v = version ? String(version) : "any";
  const re = UUID_REGEXPS[v as UUIDVersion];
  if (!re) return false;
  return re.test(value.trim());
}

export function isUUIDv4(value: unknown): boolean {
  return isUUID(value, 4);
}

export function normalizeUUID(
  value: unknown,
  version?: UUIDVersion
): string | null {
  if (typeof value !== "string") return null;
  const s = value.trim().toLowerCase();
  return isUUID(s, version) ? s : null;
}

export function assertUUID(value: unknown, version?: UUIDVersion): string {
  const normalized = normalizeUUID(value, version);
  if (!normalized) {
    const verMsg = version ? `v${version} ` : "";
    throw new TypeError(`Expected ${verMsg}UUID string, got: ${String(value)}`);
  }
  return normalized;
}

export function generateUUID(): string {
  // Prefer native randomUUID
  const globalAny: any = typeof globalThis !== "undefined" ? globalThis : {};
  if (
    typeof globalAny.crypto === "object" &&
    typeof globalAny.crypto.randomUUID === "function"
  ) {
    return globalAny.crypto.randomUUID();
  }

  if (
    typeof globalAny.crypto === "object" &&
    typeof globalAny.crypto.getRandomValues === "function"
  ) {
    const bytes = new Uint8Array(16);
    globalAny.crypto.getRandomValues(bytes);

    // Per RFC4122 v4:
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10

    const hex: string[] = Array.from(bytes, (b) =>
      b.toString(16).padStart(2, "0")
    );
    return [
      hex.slice(0, 4).join(""),
      hex.slice(4, 6).join(""),
      hex.slice(6, 8).join(""),
      hex.slice(8, 10).join(""),
      hex.slice(10, 16).join(""),
    ].join("-");
  }

  const rnd = () => Math.floor(Math.random() * 0xff);
  const bytes = new Array(16).fill(0).map(() => rnd());
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.map((b) => b.toString(16).padStart(2, "0"));
  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-");
}

export default {
  isUUID,
  isUUIDv4,
  normalizeUUID,
  assertUUID,
  generateUUID,
};
