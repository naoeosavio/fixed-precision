const BASE_POWER_CACHE = new Map<number, bigint>();

export function base_power(radix: 2 | 8 | 16, exponent: number): bigint {
  const key = radix * 0x10000 + exponent;
  let cached = BASE_POWER_CACHE.get(key);
  if (cached === undefined) {
    cached = BigInt(radix) ** BigInt(exponent);
    BASE_POWER_CACHE.set(key, cached);
  }
  return cached;
}
